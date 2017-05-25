const assert = require('assert');
const request = require('request');
const getCharset = require('../lib/charset');
const logger = require('../lib/logger')('test');

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


// const charsetOptions = { uri: 'http://f.mlr.gov.cn/' };
// const charsetOptions = { uri: 'http://www.baidu.com' };
// const charsetOptions = { uri: 'http://egov.mofcom.gov.cn' };
// const charsetOptions = { uri: 'http://wmsw.mofcom.gov.cn/wmsw/' }; /* no rule */
// const charsetOptions = { uri: 'http://www.shmzw.gov.cn/' }; /* no rule */
// const charsetOptions = { uri: 'http://www.shmzw.gov.cn/gb/mzw/index.html' }; /* gbk */
const charsetOptions = { uri: 'http://manage.mofcom.gov.cn/article/shehsj/' };

testCharset(charsetOptions, (charset) => {
  console.log(charset);
});

// testCharset(optionB, (charset) => {
//  assert.notEqual('test', charset);
// });
