/**
 * 清理非简历文件
 */
const fs = require('fs');
const readline = require('readline');

function clean(path, callback) {
  if (!fs.existsSync(path)) {
    return callback();
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(path),
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', (line) => {
    fs.unlink(line, (err) => {
      if (err) {
        return callback(err);
      }
    });
  });
}

module.exports = clean;
