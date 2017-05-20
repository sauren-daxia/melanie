const url = require('url');
const cheerio = require('cheerio');

/**
 * 获取链接
 *
 * - html: html to be load
 * - seed: uri of html
 * - set: Set() of links
 * @param {Object}
 * @param {Function} callback - callback(err, {link, href})
 * @return {Number} length - the length of links
 */
function linkExt({ html, seed, set }, callback) {
  let length = 0;

  if (!html) {
    callback(new Error('Undefined html'));
    return length;
  }

  const $ = cheerio.load(html);
  let links;
  try {
    links = $('[href]');
  } catch (e) {
    callback(e);
    return length;
  }

  for (let i = 0; i < links.length; i++) {
    const linkeq = links.eq(i);
    let href;
    href = linkeq.text();
    if (!href || href === '') {
      href = linkeq.attr('title');
    }
    if (!href) {
      href = '';
    }
    href = href.replace(/\s/g, '');
    if (href.match(/RSS|下载/)) {
      continue;
    }

    let link = linkeq.attr('href');
    if (!link || link.match(/download|javascript/g) || link === '/') {
      continue;
    }
    link = url.resolve(seed, link);
    link = link.replace('#', '');
    if (set.has(link)) {
      continue;
    }
    set.add(link);
    callback(null, { link, href });
    length++;
  }

  return length;
}

module.exports = linkExt;
