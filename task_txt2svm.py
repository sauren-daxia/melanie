# -*- coding: utf8 -*-
"""
    txt转libsvm
"""
import os
import sys
from libs.svm_tools import txt2libsvm


def main(root_dir, output_file='resume_scale'):
    scale_str = ''
    for root, dirs, files in os.walk(root_dir):
        for f in files:
            if f.find('.txt') == -1:
                continue
            txt_file = os.path.join(root, f)
            line = txt2libsvm(txt_file, -1)
            if not scale_str == '':
                scale_str += '\n'
            scale_str += line
    with open(output_file, 'w') as f:
        f.write(scale_str)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
