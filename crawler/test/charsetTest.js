const assert = require('assert');
const request = require('request');
const getCharset = require('../lib/charset');
const logger = require('../lib/logger')('test-htmlParser');

function testCharset(options, callback) {
  request(options, (err, res, body) => {
    if (err) {
      logger.error(err);
      callback('null');
      return null;
    }

    const charset = getCharset(body, (linkErr) => {
      if (linkErr) {
        logger.error(linkErr);
        return null;
      }
    });
    callback(charset);
  });
}


// const resumeOptions = { uri: 'http://www.mlr.gov.cn/zwgk/ldzc/jdm/' };
const charsetOptions = { uri: 'http://f.mlr.gov.cn/' };
// testCharset(resumeOptions, (charset) => {
//  assert.notEqual('test', charset);
// });
testCharset(charsetOptions, (charset) => {
  assert.notEqual('test', charset);
});
