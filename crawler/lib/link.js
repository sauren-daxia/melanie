/**
 * @class Link
 *
 * 链接类
 * @property {String} url - 链接url
 * @property {String} org - 所属组织
 * @property {String} domain - 域名，从url中解析
 * @property {Number} depth - 链接深度，默认0
 * @property {String} charset - 编码方式，默认从config.js读取
 * @property {Number} times - 下载次数，默认0
 */
const tools = require('./tools');
const configs = require('../configs');

class Link {
  constructor(obj) {
    this.url = obj.url;
    this.org = obj.org;
    this.domain = tools.getDomain(this.url);
    this.depth = 0;
    this.charset = configs.default_charset;
    this.href = '';
    this.times = 0;

    if (obj.depth) {
      this.depth = obj.depth;
    }
    if (obj.charset) {
      this.charset = obj.charset;
    }
    if (obj.href) {
      this.href = obj.href;
    }

    if (this.url.indexOf('htm') === -1 && this.url[this.url.length - 1] !== '/') {
      this.url += '/';
    }
  }
}

module.exports = Link;
