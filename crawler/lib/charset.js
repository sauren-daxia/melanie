/**
 * 获取charset
 */
const cheerio = require('cheerio');
const configs = require('../configs');

function getCharset(html, callback) {
  let charset = configs.default_charset;
  if (!html) {
    callback(new Error('Undefined html'));
    return charset;
  }

  const $ = cheerio.load(html);
  let content;
  /* 检查是否是正常的html文本，如果是zip或其他文件会抛出异常 */
  try {
    content = $('[http-equiv=Content-Type]');
  } catch (e) {
    callback(e);
    return charset;
  }

  if (!content || content.length === 0) {
    content = $('[charset]');
    if (!content || content.length === 0) {
      return charset;
    }
    charset = content.attr('charset');
  } else {
    charset = content.attr('content');
  }

  if (charset.toLowerCase().indexOf('gb') !== -1) {
    charset = 'gbk';
  } else {
    charset = 'utf-8';
  }
  return charset;
}

module.exports = getCharset;
