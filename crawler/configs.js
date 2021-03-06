const configs = {
  csv_dir: 'data/csv_1', // csv文件所在文件夹
  max_depth: 2, // 最大下载深度
  max_retry_times: 2, // 最大下载次数
  csv_queue_limit: 1, // csv queue concurrency
  domain_queue_limit: 5, // doman queue concurrency
  link_queue_limit: 1, // link queue concurrency
  log_file: 'crawler.log', // 日志文件名
  default_logger: 'crawler', // 默认logger
  default_charset: 'utf-8', // Link 默认charset
  output_dir: 'download', // 默认下载路径
  tmp_dir: '/tmp', // 非简历文件记录文件路径
  child_timeout: 30 * 60 * 1000, // 子进程timeout, 单位毫秒
};

module.exports = configs;
