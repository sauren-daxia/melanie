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

let currentDepth = 0;
const maxDepth = 2;
const csvList = [];
const cache = new Set();
const depMap = new Map();

function linkExt(html, task) {
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
          if (child.depth <= maxDepth && child.domain === task.domain) {
            linkQueue.push(child);
          } else {
            logger.debug(`skip ${child.url}, current ${task.domain}`);
          }
          logger.debug(`follow: ${link}`);
        }
      }
    }
  }
}

const linkQueue = async.queue((task, callback) => {
  if (cache.has(task.url)) {
    logger.debug(`${task.url} alread in cache, skip`);
    return callback();
  }

  if (depMap.get(task.domain) && depMap.get(task.domain) > 20) {
    logger.debug(`${task.domain} hash more than 20 resumes, skip`);
    return callback();
  }

  cache.add(task.url);

  if (currentDepth < task.depth) {
    logger.info(`current depth: ${task.depth}`);
    currentDepth = task.depth;
  }

  if (task.times > 3) {
    callback();
    return logger.info(`url: ${task.url} request failed, will not retry`);
  }

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
    callback();

    if (err) {
      return logger.error(`${task.url} request failed:\n${err}`);
    }

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

    if (task.charset.indexOf('gb') !== -1) {
      html = iconv.decode(body, 'gb2312');
    }

    const items = htmlParser(html, task.pattern);
    items.url = task.url;
    items.org = task.org;
    items.href = task.href ? task.href : '';
    if (task.crawl()) {
      try {
        if (output(items)) {
          if (depMap.get(task.domain)) {
            depMap.set(task.domain, depMap.get(task.domain) + 1);
          } else {
            depMap.set(task.domain, 1);
          }
        }
      } catch (e) {
        logger.error(e);
      }
    }

    linkExt(html, task);
  });
}, 15);

const csvQueue = async.queue((csv, cb) => {
  logger.info(`read csv file: ${csv}`);
  const rl = readline.createInterface({
    input: fs.createReadStream(csv),
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    linkQueue.push(new Link({
      url: line.split(',')[1],
      org: `${csv.split('/')[1].replace('.csv', '')}-${line.split(',')[0]}`,
    }));
  });

  rl.on('close', () => {
    cb();
    const next = csvList.pop();
    if (next) {
      // DEBUG
      currentDepth = 0;
      csvQueue.push(next);
    }
  });
});

fs.readdirSync('data').forEach((file) => {
  if (file.indexOf('.csv') !== -1) {
    logger.debug(`find csv file: ${file}`);
    csvList.push(`data/${file}`);
  }
});

csvQueue.push(csvList.pop());
