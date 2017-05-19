# -*- coding: utf8 -*-
"""
    提取特征，组织成libsvm数据格式
"""
import get_feature


def parse_libsvm(feature_list, tag=1):
    # 将特征数组组织成libsvm数据格式
    libsvm_str = ''
    if tag > 0:
        libsvm_str += '+'
    libsvm_str += str(tag) + ' '
    for i in range(len(feature_list)):
        libsvm_str += '{0}:{1} '.format(i+1, feature_list[i])
    return libsvm_str


def txt2libsvm(txt_file, tag=1):
    return parse_libsvm(get_feature.get_feature_from_txt(txt_file), tag)


def xml2libsvm(xml_file, tag=1):
    return parse_libsvm(get_feature.get_feature_from_xml(xml_file), tag)
