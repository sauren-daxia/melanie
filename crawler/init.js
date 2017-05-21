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
const getCharset = require('./lib/charset');
const linkExt = require('./lib/linkExt');
const clean = require('./lib/clean');
const configs = require('./configs');

const csvQueue = async.queue((csvName, csvCb) => {
  /* TODO remove isCallback check */
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
      let options = { uri: task.url, maxRedirects: 100 };

      if (task.charset === 'gbk') {
        options = {
          url: task.url,
          encoding: null,
          headers: {
            'Content-Type': 'content=text/html; charset=gbk',
          },
          maxRedirects: 100,
          timeout: 3000,
        };
      }
      request(options, (err, res, body) => {
        domain.total++;
        if (err) {
          task.times++;
          if (task.times < configs.max_retry_times) {
            linkQueue.push(task);
          }
          logger.warn(`${task.url} request failed:\n${err.message}, try ${task.times} times`);
          return callback();
        }

        let html = body;
        /* 处理charset */
        const charset = getCharset(html, (charsetErr) => {
          if (charsetErr) {
            logger.warn(charsetErr);
          }
        });

        if (task.charset !== charset) {
          task.charset = charset;
          linkQueue.push(task);
          return callback();
        }

        if (task.charset === 'gbk') {
          html = iconv.decode(body, 'gb2312');
        }

        /* 保存xml文件 */
        const items = htmlParser(html, (htmlParserErr) => {
          logger.warn(`${task.url}: ${htmlParserErr.message}`);
        });
        items.url = task.url;
        items.org = task.org;
        items.href = task.href;
        output(items, (outputErr, xmlPath) => {
          if (err) {
            return logger.warn(`${task.url}: ${outputErr.message}`);
          }

          if (!xmlPath) {
            return;
          }

          domain.download++;
        });

        if (task.depth === configs.max_depth) {
          return callback();
        }

        /* 获取子链接 */
        linkExt({
          html,
          seed: task.url,
          set: cache,
        }, (linkErr, linkRes) => {
          if (linkErr) {
            return logger.warn(`${task.url}: {linkErr.message}`);
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
      }).setMaxListeners(0);
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
      org: `${csv.name.split('/')[csv.name.split('/').length - 1].replace('.csv', '')}-${line.split(',')[0].trim()}`,
    }));
  });
}, configs.csv_queue_limit);

/*  clean negative xml files when the last csv task finished */
csvQueue.drain = () => {
  logger.info('All task finished, will clean negative files');
  clean(configs.negative_file, (err) => {
    if (err) {
      logger.error(err);
    }
  });
};

/* walk dir and push csv files to csvQueue */
fs.readdirSync(configs.csv_dir).forEach((file) => {
  if (file.indexOf('.csv') !== -1) {
    logger.debug(`find csv file: ${file}`);
    csvQueue.push(path.join(configs.csv_dir, file));
  }
});
