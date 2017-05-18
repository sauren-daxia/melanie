# -*- coding: utf8 -*-
"""
    通用工具
    ~~~~~~~

    :get_filename 读取文件名，去除文件夹路径和后缀
"""
import sys


def get_filename(full_name):
    # 读取文件名，去除文件夹路径和后缀
    return '.'.join(full_name.split('/')[-1].split('.')[:-1])


def get_fullname(full_name):
    # 读取文件名，去除文件夹路径和后缀
    return '.'.join(full_name.replace('/', '').split('.')[:-1])


if __name__ == '__main__':
    print get_filename(sys.argv[1])
