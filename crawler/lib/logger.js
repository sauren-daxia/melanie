const log4js = require('log4js');
const path = require('path');

const logLevelFilter = {
  type: 'logLevelFilter',
  appender: {
    type: 'console',
  },
  level: 'INFO',
  //level: 'DEBUG',
};

const dateFile = {
  type: 'dateFile',
  filename: 'log/imagesync.log',
  layout: { type: 'basic' },
  pattern: '.yyyy-MM-dd',
  alwaysIncludePattern: false,
};

log4js.configure({
  appenders: [
    logLevelFilter,
    dateFile,
  ],
});

const logger = log4js.getLogger(path.basename(__filename));
logger.setLevel('DEBUG');

module.exports = logger;
