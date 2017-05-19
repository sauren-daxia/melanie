# -*- coding: utf-8 -*-
import os
import sys
import svm_tools
from utils import get_fullname

TEMP_DIR = 'temp'


def check(xml_file):
    file_name = TEMP_DIR + '/' + get_fullname(xml_file)
    # xml2scale
    scale_file = file_name + '.scale'
    with open(scale_file, 'w') as f:
        f.write(svm_tools.xml2libsvm(xml_file, 1))
    # predict
    result_file = file_name + 'result'
    os.system('svm-predict ' + scale_file + ' module/train.model ' + result_file)

    # clean
    os.system('rm ' + scale_file)
    os.system('rm ' + result_file)


if __name__ == '__main__':
    if not os.path.exists(TEMP_DIR):
        os.mkdir(TEMP_DIR)
    check(sys.argv[1])
