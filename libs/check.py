# -*- coding: utf-8 -*-
"""
   检查文件是否符合分类
"""
import os
import sys
import svmtools
import utils


def check(file_name):
    """检查文件是否符合分类"""
    full_name = '/tmp/' + utils.get_fullname(file_name)
    # xml2scale
    scale_file = full_name + '.scale'
    with open(scale_file, 'w') as f:
        f.write(svmtools.convert2libsvm(file_name, 1))
    # predict
    result_file = full_name + '.result'
    os.system('svm-predict ' + scale_file + ' module/train.model ' + result_file)

    # clean
    os.system('rm ' + scale_file)
    os.system('rm ' + result_file)


if __name__ == '__main__':
    check(sys.argv[1])

