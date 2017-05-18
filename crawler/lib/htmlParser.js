const cheerio = require('cheerio');

function htmlParser(html, pattern) {
  const items = {};
  if (!html) {
    return {};
  }
  const $ = cheerio.load(html);
  items.name = pattern.name ? $(pattern.name).eq(0).text().replace(/\s/g, '') : '';
  const lines = pattern.resume ? $(pattern.resume) : $('p');
  items.resume = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines.eq(i).text().replace(/\s/g, '');
    if (line.length > 0) {
      items.resume += `${line}\n`;
    }
  }
  return items;
}

module.exports = htmlParser;
