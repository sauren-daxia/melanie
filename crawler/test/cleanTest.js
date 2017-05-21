const clean = require('../lib/clean');
const configs = require('../configs');

clean(configs.negative_file, (err) => {
  if (err) {
    console.log(err);
  }
});
