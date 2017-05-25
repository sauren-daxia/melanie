/**
 * 获取charset
 */
const cheerio = require('cheerio');
const configs = require('../configs');

function getCharset(html, callback) {
  let isOk = false;
  let charset = configs.default_charset;
  if (!html) {
    callback(new Error('Undefined html'));
    return charset;
  }

  const $ = cheerio.load(html);
  let content;
  /* 检查是否是正常的html文本，如果是zip或其他文件会抛出异常 */
  try {
    /* default rule: [charset] attr: charset*/
    content = $('[charset]');
    if (content && content.length !== 0) {
      isOk = true;
      charset = content.eq(0).attr('charset');
    }
  } catch (e) {
    callback(e);
    return charset;
  }

  /* rule: [http-equiv=Content-Type] attr: content */
  if (!isOk) {
    content = $('[http-equiv=Content-Type]');
    if (content && content.length !== 0) {
      isOk = true;
      charset = content.eq(0).attr('content');
    }
  }

  /* rule: [http-equiv=content-type] attr: content */
  if (!isOk) {
    content = $('[http-equiv=content-type]');
    if (content && content.length !== 0) {
      isOk = true;
      charset = content.eq(0).attr('content');
    }
  }

  /* use default charset */
  if (!isOk) {
    callback(new Error('No suitable rule'));
    return configs.default_charset;
  }

  if (!charset) {
    callback(new Error('Rule is suitable'));
    return configs.default_charset;
  }

  if (charset.toLowerCase().indexOf('gb') !== -1) {
    charset = 'gbk';
  } else {
    charset = 'utf-8';
  }
  return charset;
}

module.exports = getCharset;
