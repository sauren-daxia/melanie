const fs = require('fs');
const configs = require('../configs');

function mkdirSync(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function makeParentDir(path) {
  const dirs = path.split('/');
  let currentDir = '';
  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i].indexOf('.') && i === dirs.length - 1) {
      break;
    }

    currentDir += `${dirs[i]}/`;
    mkdirSync(currentDir);
  }
}

function pathParse(path) {
  path = path.toString().replace(/[\s\\*/:?"<>|&()]/g, '');
  if (path.length > 15) {
    path = path.substring(0, 15);
  }
  return path;
}

function getPath(items) {
  let path = 'resume';
  if (items.name !== '') {
    path = pathParse(items.name);
  } else if (items.href !== '') {
    path = pathParse(items.href);
    items.name = items.href;
  }

  return `${configs.output_dir}/${items.org.split('-')[0]}/${items.org.split('-')[1]}/${path}.xml`;
}

function getDomain(url) {
  return url.replace('http://', '').split('/')[0].split('.')[1];
}

exports.mkdirSync = mkdirSync;
exports.mkdirs = makeParentDir;
exports.getPath = getPath;
exports.pathParse = pathParse;
exports.getDomain = getDomain;
