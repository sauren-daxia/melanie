const fs = require('fs');
const path = require('path');
const readline = require('readline');
const async = require('async');
const request = require('request');
const iconv = require('iconv-lite');
const Link = require('./lib/link');
const logger = require('./lib/logger')('crawler');
const output = require('./lib/output');
const htmlParser = require('./lib/htmlParser');
const linkExt = require('./lib/linkExt');
const clean = require('./lib/clean');
const configs = require('./configs');

const csvQueue = async.queue((csvName, csvCb) => {
  /* TODO remove is callback check */
  const csv = {
    name: csvName,
    /* 爬取的网页总数 */
    total: 0,
    /* 下载的网页总数 */
    download: 0,
    isCallback: false,
  };

  const domainQueue = async.queue((seed, domainCb) => {
    const cache = new Set();
    const domain = {
      name: seed.org,
      download: 0,
      total: 0,
      isCallback: false,
    };

    const linkQueue = async.queue((task, callback) => {
      let options = { uri: task.url };

      /* TODO check charset */
      if (task.charset.indexOf('gb') !== -1) {
        options = {
          url: task.url,
          encoding: null,
          headers: {
            'Content-Type': 'content=text/html; charset=gbk',
          },
        };
      }

      request(options, (err, res, body) => {
        domain.total++;
        if (err) {
          task.times++;
          if (task.times < configs.max_retry_times) {
            linkQueue.push(task);
          }
          logger.warn(`${task.url} request failed:\n${err}, try ${task.times} times`);
          return callback();
        }

        // 处理编码问题
        try {
          const charset = body.match(/charset="[^"]+"|charset=[^"]+/)[0].replace('charset=', '').replace(/"/, '').toLowerCase();
          if (task.charset !== charset) {
            task.charset = charset;
            linkQueue.push(task);
            return callback();
          }
        } catch (e) {
          logger.warn(`${task.url} read charset failed`);
        }

        let html = body;

        if (task.charset.indexOf('gb') !== -1) {
          html = iconv.decode(body, 'gb2312');
        }

        // 下载
        const items = htmlParser(html, (htmlParserErr) => {
          logger.error(htmlParserErr);
        });
        items.url = task.url;
        items.org = task.org;
        items.href = task.href;
        output(items, (outputErr, xmlPath) => {
          if (err) {
            return logger.warn(outputErr);
          }

          logger.debug(`Download ${xmlPath}`);
          domain.download++;
        });

        if (task.depth === configs.max_depth) {
          return callback();
        }

        linkExt({
          html,
          seed: task.url,
          set: cache,
        }, (linkErr, linkRes) => {
          if (linkErr) {
            return logger.error(linkErr);
          }

          const child = new Link({
            url: linkRes.link,
            org: task.org,
            depth: task.depth + 1,
            href: linkRes.href,
          });
          if (child.domain === task.domain) {
            linkQueue.push(child);
          }
        });
        callback();
      });
    }, configs.link_queue_limit);

    /* domain task end when last link task finished */
    linkQueue.drain = () => {
      if (!domain.isCallback) {
        domain.isCallback = true;
        csv.total += domain.total;
        csv.download += domain.download;
        logger.info(`domain ${domain.name} FINISHED; download ${domain.download}/${domain.total}; queue ${domainQueue.running()}/${domainQueue.length()}`);
        domainCb();
      }
    };

    linkQueue.push(seed);
  }, configs.domain_queue_limit);

  /* csv task finished when last domain task finished */
  domainQueue.drain = () => {
    if (!csv.isCallback) {
      csv.isCallback = true;
      logger.info(`csv task ${csv.name} is FINISHED; download ${csv.download}/${csv.total}`);
      csvCb();
    }
  };

  logger.info(`start read csv file: ${csv.name}`);

  const rl = readline.createInterface({
    input: fs.createReadStream(csv.name),
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    domainQueue.push(new Link({
      url: line.split(',')[1],
      org: `${csv.name.split('/')[1].replace('.csv', '')}-${line.split(',')[0].trim()}`,
    }));
  });
}, configs.csv_queue_limit);

/* when the last csv task finished => clean negative xml files */
csvQueue.drain = () => {
  clean(configs.negative_file, (err) => {
    logger.error(err);
  });
};

/* walk dir and push csv files to csvQueue */
fs.readdirSync(configs.csv_dir).forEach((file) => {
  if (file.indexOf('.csv') !== -1) {
    logger.debug(`find csv file: ${file}`);
    csvQueue.push(path.join(configs.csv_dir, file));
  }
});
