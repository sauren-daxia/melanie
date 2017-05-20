/**
 * @author: xiaoyu.bai
 * @email: xiaoyu.bai@yitu-inc.com
 * @date: 2017-05-20
 * @purpose 日志模块
 */
const path = require('path');
const log4js = require('log4js');

const logLevelFilter = {
  type: 'logLevelFilter',
  appender: {
    type: 'console',
  },
  level: 'INFO',
};

const dateFile = {
  type: 'dateFile',
  filename: path.join('logs', '/log'),
  pattern: '.yyyy-MM-dd',
  alwaysIncludePattern: false,
};

log4js.configure({
  appenders: [
    logLevelFilter,
    dateFile,
  ],
});

module.exports = (name) => {
  const logger = log4js.getLogger(name || 'logger');
  logger.setLevel('DEBUG');
  return logger;
};
