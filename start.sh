workspace=data/svm/
# setUp
echo '---- Start ----'
rm -rf ${workspace}positive/txt
rm -rf ${workspace}negative/txt
rm -rf ${workspace}test/txt
rm -rf ${workspace}out
# train
echo '---- Training ----'
python task.py -x ${workspace}positive/xml/ -o ${workspace}positive/txt
python task.py -x ${workspace}negative/xml/ -o ${workspace}negative/txt
python task.py -t ${workspace}positive/txt/ -f ${workspace}out/positive.scale
python task.py -t ${workspace}negative/txt/ -f ${workspace}out/negative.scale -g -1
cat ${workspace}out/positive.scale>${workspace}out/train.scale
echo '\n' >>${workspace}out/train.scale
cat ${workspace}out/negative.scale>>${workspace}out/train.scale
svm-train ${workspace}out/train.scale ${workspace}out/train.model
# predict
echo '---- Predict ----'
python task.py -x ${workspace}test/xml/ -o ${workspace}test/txt
python task.py -t ${workspace}test/txt/ -f ${workspace}out/test.scale
svm-predict ${workspace}out/test.scale ${workspace}out/train.model ${workspace}out/result
python task.py -l ${workspace}out/test.list -r ${workspace}out/result -f ${workspace}out/test_result
# tearDown
rm ${workspace}out/positive.scale
rm ${workspace}out/positive.list
rm ${workspace}out/negative.scale
rm ${workspace}out/negative.list
rm ${workspace}out/test.scale
rm ${workspace}out/test.list
rm ${workspace}out/result
echo '---- End ----'