const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const async = require('async');
const configs = require('./configs');
const logger = require('./lib/logger')('master');
const clean = require('./lib/clean');

const childQueue = async.queue((task, callback) => {
  const child = {
    task,
    worker: {},
    isFork: false,
    isExit: false,
  };

  cluster.setupMaster({
    exec: 'worker.js',
    args: [child.task],
  });

  cluster.fork();

  cluster.on('fork', (worker) => {
    if (!child.isFork) {
      child.worker = worker;
      child.id = worker.id;
      child.isFork = true;
      logger.info(`${child.task} fork， id: ${child.id}`);
    }
  }).setMaxListeners(0);

  cluster.on('exit', (worker) => {
    if (worker.id === child.id) {
      logger.info(`${child.task} exit, id: ${child.id}`);
      child.isExit = true;
      /* 清理非简历文件 */
      clean(path.join(configs.tmp_dir, child.task.replace('.csv', '.negative')), (err) => {
        if (err) {
          logger.error(err);
        }
      });
      callback();
    }
  });

  /* 当子程序长时间未退出，强制退出 */
  setTimeout(() => {
    if (!child.isExit) {
      child.worker.kill();
      logger.error(`${child.task} TIMEOUT, kill it， id: ${child.id}`);
    }
  }, configs.child_timeout);
}, configs.csv_queue_limit);

/* 遍历文件夹，将csv文件压入队列中*/
fs.readdirSync(configs.csv_dir).forEach((file) => {
  if (file.indexOf('.csv') !== -1) {
    logger.debug(`find csv file: ${file}`);
    childQueue.push(path.join(configs.csv_dir, file));
  }
});

// ctrl c
process.on('SIGINT', () => {
  process.exit();
});

// exit
process.on('exit', () => {
  logger.info('bye');
});
