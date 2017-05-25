# -*- coding: utf-8 -*-
"""
测试读取文章，生成特征地图
"""
import sys
import jieba
import xmltools
from feature import FeatureMap


def get_word_list(file_name):
    """获得词汇列表"""
    # TODO xml/txt
    resume = xmltools.read_xml(file_name)['resume']
    word_list = jieba.cut(resume, cut_all=True)
    # 预处理
    word_set = set()
    for word in set(word_list):
        word = word.encode('utf-8').strip()
        if len(word.decode('utf-8')) < 2:
            continue
        word_set.add(word)
    return [w for w in word_set]


def update_feature_map(fm, file_name):
    """"""
    features = set()
    word_list = get_word_list(file_name)
    for word in word_list:
        code = fm.add(word)
        features.add(code)
    print features


def walk(root_dir, label, map_file):
    fm = FeatureMap()
    fm.load(map_file)
    



if __name__ == '__main__':
    fm = FeatureMap()
    update_feature_map(fm, sys.argv[1])
    fm.save('data/features.map')
