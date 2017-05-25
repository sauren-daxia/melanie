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
    content = $('[charset]');
  } catch (e) {
      callback(e);
      return charset;
  }

  if (!content || content.length === 0) {
    content = $('[http-equiv=Content-Type]');
  } else {
    isOk = true;
    charset = content.eq(0).attr('charset');
  }

  if (!content || content.length === 0) {
    content = $('[http-equiv=content-type]');
  } else if(!isOk) {
    isOk = true;
    charset = content.eq(0).attr('content');
  }

  if (!content || content.length === 0) {
    callback(new Error('no rule to get charset'));
    return configs.default_charset;
  } else if(!isOk) {
    charset = content.eq(0).attr('content');
  }

  if(!charset){
      callback(new Error('no charset'));
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
