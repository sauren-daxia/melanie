# -*- coding: utf-8 -*-
"""
   task
   ~~~~

   批处理任务

   :author: xy
"""
import os
import argparse
from libs import xml_tools
from libs import log

#: 默认输出路径
DEFAULT_OUTPUT_DIR = 'data/out'

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
    help='xml文件地址(默认文件夹: %(default)s)', default='.'
)

parser.add_argument(
    '-o',
    '--out',
    help='输出文件地址(默认文件夹: %(default)s)', default=DEFAULT_OUTPUT_DIR
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
                xml_tools.xml2txt(xml_file, SYS_ARGS.out)
                sucess_count += 1
            except Exception as e:
                logger.error(xml_file + ': ' + repr(e))
    logger.info('end: xml2txt; sucess: {0}/{1}'.format(sucess_count, total_count))


def main():
    if not os.path.exists(SYS_ARGS.out):
        os.makedirs(SYS_ARGS.out)
    if 'xml' in SYS_ARGS:
        xml2txt()


if __name__ == '__main__':
    main()
