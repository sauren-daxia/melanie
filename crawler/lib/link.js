class Link {
  constructor(obj) {
    this.url = obj.url;
    this.org = obj.org;
    this.domain = this.url.replace('http://', '').split('/')[0];
    this.pattern = {};
    this.depth = 0;
    this.charset = 'utf-8';
    this.href = '';

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
  follow() {
    if (this.href.length > 5) {
      return false;
    }
    return true;
  }
  crawl() {
    if (this.href.length > 5) {
      return false;
    }
    return true;
  }
}

module.exports = Link;
