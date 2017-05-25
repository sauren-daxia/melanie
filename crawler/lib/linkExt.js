const url = require('url');
const cheerio = require('cheerio');
const logger = require('./logger')('linkExt');

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

  function filter(link, href) {
    /* 过滤链接 */
    if (!link || link.match(/download|javascript|jump|mailto|login/g) || link === '/') {
      return;
    }
    /* 过滤后缀 要求含htm */
    let ext = link.replace('http://', '').replace('https://', '').split('/');
    if (ext.length > 1) {
      ext = ext[ext.length - 1].match(/[^.]*\.([^.]+)/);
      if (ext && ext[1].indexOf('htm') === -1) {
        logger.debug(`skip: ${link}, ext: ${ext[1]}`);
        return;
      }
    }
    /* 过滤域名前缀 */
    const prefix = link.replace('http://', '').replace('https://', '').split('.')[0];
    if (prefix.match(/^(g|t|credit|mail|data)$/g)) {
      return;
    }
    link = url.resolve(seed, link);
    link = link.replace('#', '');
    if (set.has(link)) {
      return;
    }
    set.add(link);
    length++;
    callback(null, { link, href });
  }

  /* 处理 document.location 跳转 */
  const doc = $.text();
  const infos = doc.match(/document\.location[\s]*=[\s]*['"]+[^"']+['"]+/g);
  if (infos) {
    infos.forEach((info) => {
      const href = 'document';
      const link = info.match(/[\s]*['"]+([^"']+)['"]+/)[1];
      filter(link, href);
    });
  }

  for (let i = 0; i < links.length; i++) {
    const linkeq = links.eq(i);
    /* 获取链接 */
    const link = linkeq.attr('href');
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

    filter(link, href);
  }

  return length;
}

module.exports = linkExt;
