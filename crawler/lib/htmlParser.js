const cheerio = require('cheerio');
const logger = require('./logger')('html-parser');

function htmlParser(html, pattern) {
  const items = {};
  if (!html) {
    return {};
  }
  try {
    const $ = cheerio.load(html);
    items.name = pattern.name ? $(pattern.name).eq(0).text().replace(/\s/g, '') : '';
    let lines = pattern.resume ? $(pattern.resume) : $('p');
    if (lines.length === 0) {
      lines = $('td');
    }
    if (lines.length === 0) {
      lines = $('*');
    }
    items.resume = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines.eq(i).text().replace(/\s/g, '');
      if (line.length > 0) {
        items.resume += `${line}\n`;
      }
    }
  } catch (e) {
    logger.error(`[Html Parse Error] ${e}`);
  }

  return items;
}

module.exports = htmlParser;
