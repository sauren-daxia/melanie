/**
 * 解析html, 获得姓名和简历
 */
const cheerio = require('cheerio');

function htmlParser(html, callback) {
  const items = {
    name: '',
    resume: '',
  };
  if (!html) {
    callback(new Error('Undefined html'));
    return items;
  }

  const $ = cheerio.load(html);

  /* 获取姓名 */
  let name;
  /* 检查是否是正常的html文本，如果是zip或其他文件会抛出异常 */
  try {
    name = $('h1');
  } catch (e) {
    callback(e);
    return items;
  }
  if (name.length === 0) {
    name = $('.tit');
  }
  if (name.length !== 0) {
    items.name = name.eq(0).text().replace(/\s/g, '');
  }

  /* 获取简历 */
  let lines = $('p');
  if (lines.length === 0) {
    lines = $('td');
  }
  if (lines.length === 0) {
    lines = $('dd');
  }
  if (lines.length === 0) {
    lines = $('*');
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines.eq(i).text().replace(/\s/g, '');
    if (line.length > 0) {
      items.resume += `${line}\n`;
    }
  }

  return items;
}

module.exports = htmlParser;
