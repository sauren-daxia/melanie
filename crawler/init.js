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

const maxDepth = 1; // 最大深度
const maxRetryTimes = 1; // 下载重试次数
const csvQueueLimit = 1;
const domainQueueLimit = 20;
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
      depth: 0, // 深度
      nextLayer: [], // 下一层任务
    };

    const linkQueue = async.queue((task, callback) => {
      // 检查重复
      if (cache.has(task.url)) {
        logger.debug(`${task.url} alread in cache, skip`);
        return callback();
      }

      cache.add(task.url);

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

      function linkExt(html) {
        if (!html) {
          logger.debug(`undefined html: ${task.url}`);
        }

        const $ = cheerio.load(html);
        const links = $('a');

        for (let i = 0; i < links.length; i++) {
          let link = links.eq(i).attr('href');
          const href = links.eq(i).text().trim();
          if (link && link.indexOf('javascript') === -1) {
            link = url.resolve(task.url, link).replace('#', '');
            if (link.indexOf('http') !== -1 && !cache.has(link)) {
              if (task.follow(link)) {
                const child = new Link({
                  url: link,
                  org: task.org,
                  depth: task.depth + 1,
                  href,
                });
                if (child.domain === task.domain) {
                  if (!cache.has(child.url)) {
                    domain.nextLayer.push(child);
                  }
                } else {
                  logger.debug(`skip ${child.url}, current ${task.domain}`);
                }
              }
            }
          }
        }

        callback();
      }

      request(options, (err, res, body) => {
        csv.total++;
        domain.total++;
        if (err) {
          task.times++;
          if (task.times < maxRetryTimes) {
            linkQueue.push(task);
          }
          return logger.error(`${task.url} request failed:\n${err}, try ${task.times} times`);
        }

        // 处理编码问题
        try {
          task.charset = body.match(/charset="[^"]+"|charset=[^"]+/)[0].replace('charset=', '').replace(/"/, '').toLowerCase();
          logger.debug(`${task.url}: charset=${task.charset}`);
          if (task.charset.indexOf('gb') !== -1) {
            return linkQueue.push(task);
          }
        } catch (e) {
          logger.debug(`${task.url}: no charset`);
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
          logger.error(`${JSON.stringify(task)}: charset`);
        }

        // 下载
        const items = htmlParser(html, task.pattern);
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
            logger.error(e);
          }
        }

        linkExt(html);
      });
    }, linkQueueLimit);

    linkQueue.drain = () => {
      const nextLayerLength = domain.nextLayer.length;

      if (nextLayerLength === 0) {
        domainCb();
        return logger.info(`domain ${domain.name} FINISHED(no-next-layer); download ${domain.download}/${domain.total}; queue ${domainQueue.running()}/${domainQueue.length()}`);
      }

      if (domain.depth > maxDepth) {
        domainCb();
        return logger.info(`domain ${domain.name} FINISHED(max-depth); download ${domain.download}/${domain.total}`);
      }

      logger.info(`domain ${domain.name}, current depth: ${domain.depth}; download ${domain.download}/${domain.total}; next layer length: ${nextLayerLength}; queue ${domainQueue.running()}/${domainQueue.length()}`);
      domain.depth++;
      for (let i = 0; i < nextLayerLength; i++) {
        linkQueue.push(domain.nextLayer.shift());
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
      org: `${csv.name.split('/')[1].replace('.csv', '')}-${line.split(',')[0]}`,
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
