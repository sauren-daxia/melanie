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
  - 运行: `python task.py -t {txt path} -o {output path}`
