/**
 * 输出xml文件
 */
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const xml2js = require('xml2js');
const mkdirs = require('./tools').mkdirs;
const getPath = require('./tools').getPath;
const configs = require('../configs');

function output(csvFile, items, callback) {
  const negativeFile = path.join(configs.tmp_dir, csvFile.replace('.csv', '.negative'));
  const builder = new xml2js.Builder();
  if (items.name === '' && items.href === '') {
    return callback(new Error('No name and href'));
  }
  if (items.resume === '') {
    return callback(new Error('No resume'));
  }

  const outputPath = getPath(items);
  mkdirs(outputPath);
  let xmlStr;
  try {
    xmlStr = builder.buildObject(items).toString();
  } catch (buildErr) {
    return callback(new Error('Charset Error'));
  }

  fs.writeFile(outputPath, xmlStr, (err) => {
    if (err) {
      return callback(err);
    }

    /* 检测是否为简历 */
    exec(`python module/check.py ${outputPath}`, (stderr, stdout) => {
      if (stderr) {
        fs.appendFile(negativeFile, `${outputPath}\n`, (appendErr) => {
          if (appendErr) {
            callback(appendErr);
          }
        });
        return callback(stderr);
      }

      if (stdout.indexOf('Accuracy = 100%') === -1) {
        fs.appendFile(negativeFile, `${outputPath}\n`, (appendErr) => {
          if (appendErr) {
            callback(appendErr);
          }
        });
        return;
      }

      return callback(null, outputPath);
    });
  });
}

module.exports = output;
