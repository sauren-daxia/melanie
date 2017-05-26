const fs = require('fs');
const readline = require('readline');
const async = require('async');
const request = require('request');
const iconv = require('iconv-lite');
const Link = require('./lib/link');
const logger = require('./lib/logger')('worker');
const output = require('./lib/output');
const htmlParser = require('./lib/htmlParser');
const getCharset = require('./lib/charset');
const linkExt = require('./lib/linkExt');
const configs = require('./configs');

const csv = {
  /* csv文件名 */
  name: process.argv[2],
  /* 爬取的网页总数 */
  total: 0,
  /* 下载的网页总数 */
  download: 0,
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
        logger.debug(`${task.url} request failed: ${err.message}, try ${task.times} times`);
        return callback();
      }

      let html = body;
      /* 处理charset */
      const charset = getCharset(html, (charsetErr) => {
        if (charsetErr) {
          logger.warn(`${task.url} get charset failed: ${charsetErr.message}`);
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
        logger.warn(`${task.url} html parse failed: ${htmlParserErr.message}`);
      });
      items.url = task.url;
      items.org = task.org;
      items.href = task.href;
      output(csv.name, items, (outputErr, xmlPath) => {
        if (err) {
          return logger.warn(`${task.url} output failed: ${outputErr.message}`);
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
          return logger.warn(`${task.url} get links failed: ${linkErr.message}`);
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

/* exit */
domainQueue.drain = () => {
  logger.info(`csv task ${csv.name} is FINISHED; download ${csv.download}/${csv.total}`);
  process.exit();
};

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
