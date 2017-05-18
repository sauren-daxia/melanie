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