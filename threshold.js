const fs = require('fs');
const check = require('./check');

resume = fs.readFile(process.argv[2], (err, res) => {
  if (err) {
    return console.log(err);
  }

  const num = check(res);
  console.log(num);
})
