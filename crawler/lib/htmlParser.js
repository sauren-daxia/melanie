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

  let name;
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
