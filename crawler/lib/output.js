const fs = require('fs');
const xml2js = require('xml2js');
const logger = require('./logger');
const mkdirs = require('./tools').mkdirs;
const getPath = require('./tools').getPath;

const builder = new xml2js.Builder();

function isResume(text) {
  if (text.indexOf('参加工作') !== -1) {
    return true;
  }

  if (text.indexOf('加入中国共产党') !== -1) {
    return true;
  }

  const year = text.match(/19\d\d[^[\d]|20\d\d([^\d]|$)/g);
  if (year && year.length >= 3) {
    return true;
  }

  return false;
}

function output(items) {
  const path = getPath(items);

  if (path.indexOf('resume') !== -1) {
    return false;
  }

  if (items.resume === '') {
    return false;
  }

  items.resume = items.resume.toString().trim();
  if (!isResume(items.resume)) {
    return false;
  }

  mkdirs(path);

  if (!fs.existsSync(path)) {
    logger.info(`Crawled: ${path}`);
  } else {
    logger.info(`Updated: ${path}`);
  }

  fs.writeFile(path, builder.buildObject(items).toString());
  return true;
}

module.exports = output;
