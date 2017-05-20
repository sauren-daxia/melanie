const assert = require('assert');
const request = require('request');
const linkExt = require('../lib/linkExt');
const logger = require('../lib/logger')('test-linkExt');

const cache = new Set();

function testLinkExt(options, callback) {
  request(options, (err, res, body) => {
    if (err) {
      logger.error(err);
      callback(-1);
      return null;
    }

    const length = linkExt({
      html: body,
      seed: options.uri,
      set: cache,
    }, (linkErr, linkRes) => {
      if (linkErr) {
        logger.error(linkErr);
        return null;
      }
      logger.debug(`${linkRes.href}: ${linkRes.link}`);
    });
    callback(length);
  });
}

describe('linkExt', () => {
  describe('#default', () => {
    it('should return -1 when the value is not present', (done) => {
      const defaultOptions = { uri: 'http://www.baidu.com' };
      testLinkExt(defaultOptions, (length) => {
        assert.equal(36, length);
        done();
      });
    });
  });
});
