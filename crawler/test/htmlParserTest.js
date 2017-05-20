const assert = require('assert');
const request = require('request');
const htmlParser = require('../lib/htmlParser');
const logger = require('../lib/logger')('test-htmlParser');

function testHtmlParser(options, callback) {
  request(options, (err, res, body) => {
    if (err) {
      logger.error(err);
      callback(-1);
      return null;
    }

    const items = htmlParser(body, (linkErr) => {
      if (linkErr) {
        logger.error(linkErr);
        return null;
      }
    });
    callback(items);
  });
}

describe('htmlParser', () => {
  describe('#resume', () => {
    it('should return -1 when the value is not present', (done) => {
      const resumeOptions = { uri: 'http://www.shzj.gov.cn/col/col30481/index.html' };
      testHtmlParser(resumeOptions, (items) => {
        const resume = items.resume;
        assert.notEqual(0, resume.length);
        done();
      });
    });
  });
});
