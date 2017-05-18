# -*- coding: utf-8 -*-
"""
   task
   ~~~~

   批处理任务

   :author: xy
"""
import os
import argparse
from libs import log
from libs import xml_tools
from libs import svm_tools

#: 默认输出路径
DEFAULT_OUTPUT_DIR = 'data/svm/out'
DEFAULT_OUTPUT_FILE = 'data/svm/out/train.scale'

parser = argparse.ArgumentParser(
    description='批处理任务',
    formatter_class=lambda prog: argparse.RawTextHelpFormatter(
        prog,
        max_help_position=50
    )
)

parser.add_argument(
    '-x',
    '--xml',
    help='xml文件地址', default=''
)

parser.add_argument(
    '-a',
    '--ann',
    help='是否产生ann文件(默认: %(default)s)', default=False
)

parser.add_argument(
    '-o',
    '--out',
    help='输出文件夹地址(默认: %(default)s)', default=DEFAULT_OUTPUT_DIR
)

parser.add_argument(
    '-t',
    '--txt',
    help='txt文件地址', default=''
)

parser.add_argument(
    '-f',
    '--file',
    help='输出文件(默认: %(default)s)', default=DEFAULT_OUTPUT_FILE
)

parser.add_argument(
    '-g',
    '--tag',
    type=int,
    help='libsvm tag(默认: %(default)d)', default=1
)

parser.add_argument(
    '-l',
    '--list',
    help='file list', default=''
)

parser.add_argument(
    '-r',
    '--result',
    help='svm predict output file', default='data/svm/out/result'
)

parser.add_argument(
    '-p',
    '--map',
    help='获取词频文件地址', default=''
)

SYS_ARGS = parser.parse_args()
logger = log.get_logger('task')


def xml2txt():
    """将xml文件转换为txt文件"""
    logger.info('start: xml2txt; xml: {0}; out: {1}'.format(SYS_ARGS.xml, SYS_ARGS.out))
    total_count = 0
    sucess_count = 0
    for root, dirs, files in os.walk(SYS_ARGS.xml):
        for f in files:
            if f.find('.xml') == -1:
                continue
            total_count += 1
            xml_file = os.path.join(root, f)
            try:
                xml_tools.xml2txt(xml_file, SYS_ARGS.out, SYS_ARGS.ann)
                sucess_count += 1
            except Exception as e:
                logger.error(xml_file + ': ' + repr(e))
    logger.info('end: xml2txt; sucess: {0}/{1}'.format(sucess_count, total_count))


def txt2svm():
    """将txt文件转换为libsvm scale文件"""
    logger.info('start: txt2svm; txt: {0}; scale: {1}'.format(SYS_ARGS.txt, SYS_ARGS.file))
    total_count = 0
    sucess_count = 0
    scale_str = ''
    list_file = SYS_ARGS.file.replace('scale', 'list')
    file_str = ''
    for root, dirs, files in os.walk(SYS_ARGS.txt):
        for f in files:
            if f.find('.txt') == -1:
                continue
            total_count += 1
            txt_file = os.path.join(root, f)
            try:
                line = svm_tools.txt2libsvm(txt_file, SYS_ARGS.tag)
                if not scale_str == '':
                    scale_str += '\n'
                    file_str += '\n'
                scale_str += line
                file_str += txt_file
                sucess_count += 1
            except Exception as e:
                logger.error(txt_file + ': ' + repr(e))
    with open(SYS_ARGS.file, 'w') as f:
        f.write(scale_str)
    with open(list_file, 'w') as f:
        f.write(file_str)
    logger.info('end: txt2svm; sucess: {0}/{1}'.format(sucess_count, total_count))


def predict():
    """输出预测结果"""
    logger.info('start: predict; list: {0}; result: {1}; output: {2}'.format(SYS_ARGS.list, SYS_ARGS.result, SYS_ARGS.file))
    with open(SYS_ARGS.list, 'r') as f:
        file_list = f.readlines()
    with open(SYS_ARGS.result, 'r') as f:
        resultes = f.readlines()
    if os.path.exists(SYS_ARGS.file):
        os.system('rm ' + SYS_ARGS.file)
    total_count = len(file_list)
    sucess_count = 0
    with open(SYS_ARGS.file, 'a+') as f:
        for i in range(total_count):
            try:
                f.write('{0},{1}\n'.format(file_list[i].strip(), resultes[i].strip()))
                sucess_count += 1
            except Exception as e:
                logger.error(str(i) + ': ' + file_list[i] + ': ' + repr(e))
    logger.info('end: predict; sucess: {0}/{1}'.format(sucess_count, total_count))


def xml2map():
    """获取词频"""
    logger.info('start: xml2map; map: {0}; output: {1}'.format(SYS_ARGS.list,SYS_ARGS.file))
    total_count = 0
    sucess_count = 0
    map_list = []
    for root, dirs, files in os.walk(SYS_ARGS.map, topdown=True):
        for f in files:
            if f.find('.xml') == -1:
                continue
            total_count += 1
            xml_file = os.path.join(root, f)
            try:
                map_list = xml_tools.xml2map(xml_file, map_list)
                sucess_count += 1
            except Exception as e:
                print xml_file + repr(e)
    xml_tools.output(map_list, SYS_ARGS.file)
    logger.info('end: xml2map; sucess: {0}/{1}'.format(sucess_count, total_count))


def main():
    if not os.path.exists(SYS_ARGS.out):
        os.makedirs(SYS_ARGS.out)
    if not SYS_ARGS.xml == '':
        xml2txt()
    if not SYS_ARGS.txt == '':
        txt2svm()
    if not SYS_ARGS.list == '':
        predict()
    if not SYS_ARGS.map == '':
        xml2map()


if __name__ == '__main__':
    main()
