const fs = require('fs');

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

function getPath(items) {
  let path = `resume_${(new Date()).valueOf().toString()}`;
  if (items.name !== '') {
    path = pathParse(items.name);
  } else if (items.href !== '') {
    path = pathParse(items.href);
    items.name = items.href;
  }

  return `download/${items.org.split('-')[0]}/${items.org.split('-')[1]}/${path}.xml`;
}

function pathParse(path) {
  if (!path) {
    return (new Date()).valueOf().toString();
  }
  path = path.toString().replace(/[\s\\*/:?"<>|]/g, '');
  if (path.length > 6) {
    path = path.substring(0, 6);
  }
  return path;
}

exports.mkdirs = makeParentDir;
exports.getPath = getPath;
exports.pathParse = pathParse;
