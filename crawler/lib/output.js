const fs = require('fs');
const exec = require('child_process').exec;
const xml2js = require('xml2js');
const logger = require('./logger');
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

  fs.writeFile(path, builder.buildObject(items).toString(), (err) => {
    if (err) {
      logger.error(`${path} => ${err}`);
      return callback(false);
    }

    exec(`python module/check.py ${path}`, (stderr, stdout) => {
      if (stderr) {
        logger.error(`${path} => ${stderr}`);
        return callback(false);
      }

      if (stdout.indexOf('100') === -1) {
        setTimeout(() => {
          fs.unlink(path, () => {
            if (err) {
              logger.error(err);
            }
          });
        }, 5000);
        return callback(false);
      }

      if (!fs.existsSync(path)) {
        logger.debug(`Crawled: ${path}`);
      } else {
        logger.debug(`Updated: ${path}`);
      }

      logger.debug(`${path} => ${stdout}`);
      return callback(true);
    });
  });
}

module.exports = output;
