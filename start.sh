python task.py -x data/svm/positive/xml/ -o data/svm/positive/txt
python task.py -x data/svm/negative/xml/ -o data/svm/negative/txt
python task.py -t data/svm/positive/txt/ -s data/svm/positive.scale
python task.py -t data/svm/negative/txt/ -s data/svm/negative.scale -g -1
cat data/svm/positive.scale data/svm/negative.scale >data/svm/train.scale
rm data/svm/positive.scale data/svm/negative.scale