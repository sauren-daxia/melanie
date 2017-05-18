# -*- coding: utf8 -*-
"""
    通用工具
    ~~~~~~~

    :get_filename 读取文件名，去除文件夹路径和后缀
"""
import sys


def get_filename(full_name):
    # 读取文件名，去除文件夹路径和后缀
    return full_name.split('/')[-1].split('.')[0]


if __name__ == '__main__':
    print get_filename(sys.argv[1])
