## Files

备注： * 代表不同步文件/文件夹
```
`-- melanie
  +-- crawler  // 爬虫
  | +-- *data
  | | +-- csv_0  // 测试csv
  | | +-- csv_1  // 待下载csv
  | | +-- csv_2  // 非下载csv
  | | +-- negative  // 负例
  | | `-- webs.js  // 部委级任务
  | +-- *download  // 下载数据
  | +-- lib
  | | +-- htmlParser.js
  | | +-- link.js
  | | +-- linkExt.js
  | | +-- logger.js
  | | +-- output.js
  | | `-- tools.js
  | +-- *logs
  | +-- *module  // python tools and svm train.model
  | | +-- check.py
  | | +-- feature.py
  | | +-- svm_tools.py
  | | +-- train.model
  | | `-- utils.py
  | +-- test
  | | +-- htmlParserTest.js
  | | `-- linkExtTest.js
  | +-- *.eslintrc.js
  | +-- init.js  // 爬虫主程序
  | +-- package.json
  | `-- start.sh  // 入口程序
  +-- *data
  +-- libs
  +-- *logs
  +-- .gitignore
  +-- README.md
  +-- start.sh  // 入口程序
  `-- task.py
```

## Dependencies
- libsvm
- node 7.10.0
- python 2.7.13
- mocha (test)

## Tasks

- xml2txt
  - 将xml文件转换为txt文件
  - 数据集: data/svm/positive|negative/xml
  - 函数: libs/xml_tools.py: xml2txt
  - 运行: `python task.py -x {xml path} -o {output path}`

- txt2svm
  - 将txt文件转换为libsvm scale文件
  - 数据集: data/svm/positive|negative/txt
  - 函数: lib/svm_tools.py: txt2libsvm
  - 运行: `python task.py -t {txt path} -f {output file} -g {tag}`

- predict
  - 处理预测结果
  - 数据集: data/svm/test
  - 运行: `python task.py -l {file list} -r {result file} -f {output file}`

- map
  - 统计词频
  - 数据集: data/svm/negative
  - 函数: lib/xml_tools.py: xml2map
  - 运行: `python task.py -p data/svm/positive/ -f data/map.csv`

## libsvm

- train
```
svm-train {scale} {model}
```

- predict
```
svm-predict {test} {model} {output}
```

## crawler

- 运行 `node init.js`

- TODO update pattern rules

- 设计

csvQueue (limit: 1) -- domainList
|
`--> domainQueue (limit: 20) -- linkList
       |
       `--> linkQueue (limit: 1)

- TODO
  - unittest
  - no-next-layer 怎么解决
  - job没有callback