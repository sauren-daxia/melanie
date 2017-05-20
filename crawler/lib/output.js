const fs = require('fs');
const exec = require('child_process').exec;
const xml2js = require('xml2js');
const logger = require('./logger')('output');
const mkdirs = require('./tools').mkdirs;
const getPath = require('./tools').getPath;

const builder = new xml2js.Builder();

function output(items, callback) {
  const path = getPath(items);

  if (path.indexOf('resume') !== -1) {
    return callback(false);
  }

  if (items.resume === '') {
    return callback(false);
  }

  if (!items.resume) {
    return callback(false);
  }

  items.resume = items.resume.toString().trim();

  mkdirs(path);

  let xmlStr = '';

  try {
    xmlStr = builder.buildObject(items);
    xmlStr = xmlStr.toString();
  } catch (e) {
    logger.error(`[Xml Build Error] ${items.href}`);
    return callback(false);
  }

  fs.writeFile(path, xmlStr, (err) => {
    if (err) {
      logger.error(`[Write Error] ${path} => ${err}`);
      return callback(false);
    }

    exec(`python module/check.py ${path}`, (stderr, stdout) => {
      if (stderr) {
        logger.error(`[Exec Error] ${path}`);
        return callback(false);
      }

      if (stdout.indexOf('100') === -1) {
        setTimeout(() => {
          fs.unlink(path, () => {
            if (err) {
              logger.error(`[Unlink Error] ${err}`);
            }
          });
        }, 10000);
        return callback(false);
      }

      if (!fs.existsSync(path)) {
        // logger.debug(`Crawled: ${path}`);
      } else {
        // logger.debug(`Updated: ${path}`);
      }

      logger.debug(`[Predict] ${path} => ${stdout}`);
      return callback(true);
    });
  });
}

module.exports = output;
