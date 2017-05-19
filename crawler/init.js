const fs = require('fs');
const url = require('url');
const readline = require('readline');
const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const Link = require('./lib/link');
const logger = require('./lib/logger');
const output = require('./lib/output');
const htmlParser = require('./lib/htmlParser');

const maxDepth = 1;
const limitDownloadNumber = 5;
const maxDownloadNumber = 5000;
const csvQueueLimit = 1;
const csvList = [];

let currentDepth = 0;
const cache = new Set();

/**
 * csvList
 */
const csvQueue = async.queue((csv, csvCb) => {
  const nextQueue = [];
  const firstQueueLimit = 20;
  const domainQueueLimit = 100;
  let totalCount = 0;
  let isCallback = false;

  function linkExt(html, task, callback) {
    if (!html) {
      logger.debug(`undefined html: ${task.link.url}`);
    }

    const $ = cheerio.load(html);
    const links = $('a');

    for (let i = 0; i < links.length; i++) {
      let link = links.eq(i).attr('href');
      const href = links.eq(i).text().trim();
      if (link && link.indexOf('javascript') === -1) {
        link = url.resolve(task.link.url, link).replace('#', '');
        if (link.indexOf('http') !== -1 && !cache.has(link)) {
          if (task.link.follow(link)) {
            const child = new Link({
              url: link,
              org: task.link.org,
              depth: task.link.depth + 1,
              href,
            });
            if (child.domain === task.link.domain) {
              if (task.domain.depth < task.link.depth) {
                task.domain.depth = task.link.depth;
              }
              task.domain.nextLayer.push({ link: child, domain: task.domain });
            } else {
              logger.debug(`skip ${child.url}, current ${task.link.domain}`);
            }
            logger.debug(`follow: ${link}`);
          }
        }
      }
    }
    callback();
  }

  const firstQueue = async.queue((task, callback) => {
    // console.log(firstQueue.running());
    const updateDomain = () => {
      task.domain.running--;
      if (task.domain.running < 1) {
        if (task.domain.download >= limitDownloadNumber && !task.domain.isCallback) {
          task.domain.isCallback = true;
          logger.info(`${task.domain.name} work end(limit download number); download: ${task.domain.download}; depth: ${task.domain.depth}`);
          return task.domain.callback();
        }

        if (task.domain.depth > maxDepth && !task.domain.isCallback) {
          task.domain.isCallback = true;
          logger.info(`${task.domain.name} work end(max depth); download: ${task.domain.download}; depth: ${task.domain.depth}`);
          return task.domain.callback();
        }

        if (task.domain.nextLayer.length === 0 && !task.domain.isCallback) {
          task.domain.isCallback = true;
          logger.info(`${task.domain.name}  work end(next layer); download: ${task.domain.download}; depth: ${task.domain.depth}`);
          return task.domain.callback();
        }

        // update domain
        // task.domain.depth++;
        task.domain.nextLayer.forEach((child) => {
          task.running++;
          if (task.domain.total < maxDownloadNumber) {
            task.domain.total++;
            nextQueue.push(child);
          } else {
            if (!task.domain.isCallback) {
              task.domain.isCallback = true;
              logger.info(`${task.domain.name}  work end(max download number); download: ${task.domain.download}/${task.domain.total}; depth: ${task.domain.depth}`);
              task.domain.callback();
            }
          }
        });
      }
    };

    if (cache.has(task.link.url)) {
      logger.debug(`${task.link.url} alread in cache, skip`);
      updateDomain();
      return callback();
    }

    cache.add(task.link.url);

    if (task.link.times > 3) {
      updateDomain();
      callback();
      return logger.info(`url: ${task.link.url} request failed, will not retry`);
    }

    let options = { uri: task.link.url };

    if (task.link.charset.indexOf('gb') !== -1) {
      options = {
        url: task.link.url,
        encoding: null,
        headers: {
          'Content-Type': 'content=text/html; charset=gbk',
        },
      };
    }

    request(options, (err, res, body) => {
      // [--- work end ---]
      callback();

      if (err) {
        updateDomain();
        return logger.error(`${task.link.url} request failed:\n${err}`);
      }

      try {
        task.link.charset = body.match(/charset="[^"]+"|charset=[^"]+/)[0].replace('charset=', '').replace(/"/, '').toLowerCase();
        logger.debug(`${task.link.url}: charset=${task.link.charset}`);
        if (task.link.charset.indexOf('gb') !== -1) {
          return firstQueue.push(task);
        }
      } catch (e) {
        logger.debug(`${task.link.url}: no charset`);
        task.link.charset = 'utf-8';
      }

      if (!task.link.charset) {
        task.link.charset = 'utf-8';
      }

      let html = body;

      if (task.link.charset.indexOf('gb') !== -1) {
        html = iconv.decode(body, 'gb2312');
      }

      const items = htmlParser(html, task.link.pattern);
      items.url = task.link.url;
      items.org = task.link.org;
      items.href = task.link.href ? task.link.href : '';
      if (task.link.crawl()) {
        try {
          output(items, (isResume) => {
            if (isResume) {
              task.domain.download++;
              totalCount++;
            }
          });
        } catch (e) {
          logger.error(e);
        }
      }

      linkExt(html, task, updateDomain);
    });
  }, firstQueueLimit);

  firstQueue.drain = () => {
    const len = nextQueue.length;
    logger.info(`lenth: ${nextQueue.length}`);
    if (len === 0 && !isCallback) {
      isCallback = true;
      csvCb();
      const next = csvList.pop();
      if (next) {
        csvQueue.push(next);
      }
      return logger.info(`csv file work ${csv} end; total download: ${totalCount}`);
    }

    for (let i = 0; i < len; i++) {
      firstQueue.push(nextQueue.pop());
    }

    logger.info(`next: ${nextQueue.length}`);

    logger.info(`current depth ${currentDepth++}; total download: ${totalCount}`);
  };

  const domainQueue = async.queue((task, callback) => {
    const domain = {
      name: task.org, // 组织名称
      depth: 0, // 深度
      running: 1, // 正在进行的子任务
      download: 0, // 已下载的网页
      nextLayer: [], // 下一层的子任务
      total: 1, // 总数
      isCallback: false,
      callback, // 回调
    };

    firstQueue.push({ link: task, domain });
  }, domainQueueLimit);

  domainQueue.drain = () => {

  };

  logger.info(`start read csv file: ${csv}`);
  const rl = readline.createInterface({
    input: fs.createReadStream(csv),
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    domainQueue.push(new Link({
      url: line.split(',')[1],
      org: `${csv.split('/')[1].replace('.csv', '')}-${line.split(',')[0]}`,
    }));
  });
}, csvQueueLimit);

fs.readdirSync('data').forEach((file) => {
  if (file.indexOf('.csv') !== -1) {
    logger.debug(`find csv file: ${file}`);
    csvList.push(`data/${file}`);
  }
});

csvQueue.push(csvList.pop());
