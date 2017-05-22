# -*- coding: utf8 -*-
"""
    libsvm 工具模块
"""
import utils


def parse_libsvm(feature_list, tag=1):
    """将特征数组组织成libsvm数据格式"""
    libsvm_str = ''
    if tag > 0:
        libsvm_str += '+'
    libsvm_str += str(tag) + ' '
    for i in range(len(feature_list)):
        libsvm_str += '{0}:{1} '.format(i+1, feature_list[i])
    return libsvm_str


def convert2libsvm(file_name, tag=1):
    """获取文件的特征向量并转换为libsvm数据格式"""
    if utils.get_ext(file_name) == 'xml':
        return parse_libsvm(utils.get_feature_from_xml(file_name), tag)
    else:
        return parse_libsvm(utils.get_feature_from_txt(file_name), tag)
