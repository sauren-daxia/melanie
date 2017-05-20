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
  /* 检查是否是正常的html文本，如果是zip或其他文件会抛出异常 */
  try {
    links = $('[href]');
  } catch (e) {
    callback(e);
    return length;
  }

  for (let i = 0; i < links.length; i++) {
    const linkeq = links.eq(i);
    /* 获取链接描述 */
    let href;
    href = linkeq.text();
    if (!href || href === '') {
      href = linkeq.attr('title');
    }
    if (!href) {
      href = '';
    }
    href = href.replace(/\s/g, '').replace(/：/g, ':');
    href = href.split(':')[0];
    if (href.match(/RSS|下载|网站地图|联系我们/)) {
      continue;
    }

    /* 获取链接 */
    let link = linkeq.attr('href');
    if (!link || link.match(/download|javascript|ico|css/g) || link === '/') {
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