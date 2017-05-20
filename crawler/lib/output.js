/**
 * 输出xml文件
 */
const fs = require('fs');
const exec = require('child_process').exec;
const xml2js = require('xml2js');
const mkdirs = require('./tools').mkdirs;
const getPath = require('./tools').getPath;
const configs = require('../configs');

function output(items, callback) {
  const builder = new xml2js.Builder();
  if (items.name === '' && items.href === '') {
    callback(new Error('No name and href'));
  }
  if (items.resume === '') {
    return callback(new Error('No resume'));
  }

  const path = getPath(items);
  mkdirs(path);

  fs.writeFile(path, builder.buildObject(items).toString(), (err) => {
    if (err) {
      return callback(err);
    }

    /* 检测是否为简历 */
    exec(`python module/check.py ${path}`, (stderr, stdout) => {
      if (stderr) {
        return callback(stderr);
      }

      if (stdout.indexOf('Accuracy = 100%') === -1) {
        fs.appendFile(configs.negative_file, `${path}\n`, (appendErr) => {
          if (appendErr) {
            return callback(appendErr);
          }
        });
      }

      return callback(null, path);
    });
  });
}

module.exports = output;
