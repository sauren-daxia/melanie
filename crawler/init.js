const fs = require('fs');
const readline = require('readline');
const async = require('async');
const request = require('request');
const iconv = require('iconv-lite');
const Link = require('./lib/link');
const logger = require('./lib/logger')('crawler');
const output = require('./lib/output');
const htmlParser = require('./lib/htmlParser');
const linkExt = require('./lib/linkExt');

const maxDepth = 2; // 最大深度
const maxRetryTimes = 1; // 下载重试次数
const csvQueueLimit = 4;
const domainQueueLimit = 5;
const linkQueueLimit = 1;

/**
 * csvList
 */
const csvQueue = async.queue((csvName, csvCb) => {
  const csv = {
    name: csvName,
    total: 0, // 爬取的网页总数
    download: 0, // 下载的网页总数
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
      // 检查重复
      logger.info(`${task.url} running: ${linkQueue.running()}/${linkQueue.length()}`);

      let options = { uri: task.url };

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
        csv.total++;
        domain.total++;
        if (err) {
          task.times++;
          if (task.times < maxRetryTimes) {
            linkQueue.push(task);
          }
          callback();
          return logger.debug(`[Connect Error] ${task.url} request failed:\n${err}, try ${task.times} times`);
        }

        // 处理编码问题
        try {
          task.charset = body.match(/charset="[^"]+"|charset=[^"]+/)[0].replace('charset=', '').replace(/"/, '').toLowerCase();
          // logger.debug(`${task.url}: charset=${task.charset}`);
          if (task.charset.indexOf('gb') !== -1) {
            callback();
            return linkQueue.push(task);
          }
        } catch (e) {
          // logger.debug(`${task.url}: no charset`);
          task.charset = 'utf-8';
        }

        if (!task.charset) {
          task.charset = 'utf-8';
        }

        let html = body;

        try {
          if (task.charset.indexOf('gb') !== -1) {
            html = iconv.decode(body, 'gb2312');
          }
        } catch (e) {
          logger.error(`[Charset Error] ${JSON.stringify(task)}`);
        }

        // 下载
        const items = htmlParser(html, (htmlParserErr) => {
          logger.error(htmlParserErr);
        });
        items.url = task.url;
        items.org = task.org;
        items.href = task.href ? task.href : '';
        if (task.crawl()) {
          try {
            output(items, (isResume) => {
              if (isResume) {
                domain.download++;
                csv.download++;
              }
            });
          } catch (e) {
            logger.error(`[Output error] ${e}`);
          }
        }

        if (task.depth === maxDepth) {
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
    }, linkQueueLimit);

    linkQueue.drain = () => {
      if (!domain.isCallback) {
        domain.isCallback = true;
        domainCb();
        logger.info(`domain ${domain.name} FINISHED; download ${domain.download}/${domain.total}; queue ${domainQueue.running()}/${domainQueue.length()}`);
      }
    };

    linkQueue.push(seed);
  }, domainQueueLimit);

  domainQueue.drain = () => {
    if (!csv.isCallback) {
      csv.isCallback = true;
      csvCb();
      logger.info(`csv task ${csv.name} is FINISHED; download ${csv.download}/${csv.total}`);
    }
  };

  // -------- push domain to domainQueue --------
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
}, csvQueueLimit);

// -------- push csv to csvQueue --------
fs.readdirSync('data').forEach((file) => {
  if (file.indexOf('.csv') !== -1) {
    logger.debug(`find csv file: ${file}`);
    csvQueue.push(`data/${file}`);
  }
});
