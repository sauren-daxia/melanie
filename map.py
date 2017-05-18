# -*- coding: utf8 -*-
"""
 将文章分词 统计词频
"""

import os
import sys
import jieba
import xml.etree.cElementTree as et


def list2map(word_list, map_list=[]):
    """
     词汇列表 => 词频映射
    """
    # 去重
    word_list = [word for word in set(word_list)]
    for word in word_list:
        word = word.encode('utf-8')
        if word.strip() == '' or word == ',':
            continue
        is_exist = False
        for map in map_list:
            if map['key'] == word:
                map['value'] += 1
                is_exist = True
                break
        if not is_exist:
            map_list.append({'key': word, 'value': 1})
    return sorted(map_list, key=lambda d:d['value'], reverse=True)


def output(map_list, output_path):
    with open(output_path, 'w') as fout:
        fout.write('')
    with open(output_path, 'a+') as fout:
        for word in map_list:
            fout.write('{0},{1}\n'.format(word['key'], word['value']))


def xml2map(xml_file, map_list):
    xml_tree = et.ElementTree(file=xml_file)
    for child in xml_tree.getroot():
        if child.tag == 'resume':
            text = child.text.encode('utf-8').replace('\n','')
    # word_list = jieba.cut(text)
    # word_list = jieba.cut(text, cut_all=True)
    word_list = jieba.cut_for_search(text)
    return list2map(word_list, map_list)


def walk(root_dir):
    map_list = []
    for root, dirs, files in os.walk(root_dir, topdown=True):
        for f in files:
            if f.find('.xml') == -1:
                continue
            xml_file = os.path.join(root, f)
            try:
                map_list = xml2map(xml_file, map_list)
            except Exception as e:
                print xml_file
    output(map_list, '2.csv')


if __name__ == '__main__':
    walk(sys.argv[1])
