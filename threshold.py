# -*- coding: utf8 -*-

import os
import sys
import xml.etree.cElementTree as et

FEATURES = [
    '年',
    '月',
    '工作',
    '副',
    '男',
    '生',
    '参加',
    '汉族',
    '研究',
    '主任',
    '大学',
    '书记',
    '党组',
    '专业',
    '委员',
    '学历',
    '成员',
    '学院',
    '学习',
    '组成',
    '加入',
    '管理',
    '共产',
    '中央',
    '中国共产党',
    '政府',
    '办公',
    '常委',
    '经济',
    '现任',
    '毕业',
    '党委',
    '硕士',
    '人民',
    '干部',
    '市委',
    '党组书记',
    '其间',
    '党校',
    '学位',
    '在职',
]

YEARS = []
for y in range(1950, 2018):
    YEARS.append(str(y))


def check(text):
    num = 0
    for f in FEATURES:
        if not text.find(f) == -1:
            num += 1
    level = 0
    for y in YEARS:
        if not text.find(y) == -1:
            level += 1
    if level > 0:
        num += 1
    if level > 3:
        num += 2
    if level > 7:
        num += 2
    return num


def check_xml(xml_file):
    xml_tree = et.ElementTree(file=xml_file)
    for child in xml_tree.getroot():
        if child.tag == 'resume':
            text = child.text.encode('utf-8').replace('\n', '')
    return check(text)


def main(root_dir):
    threshold = 45
    low = ''
    history = []
    for root, dirs, files in os.walk(root_dir, topdown=True):
        for f in files:
            if f.find('.xml') == -1:
                continue
            xml_file = os.path.join(root, f)
            try:
                num = check_xml(xml_file)
                if num < threshold:
                    history.append(threshold)                    
                    threshold = num
                    low = xml_file
            except Exception as e:
                print xml_path
    print low
    print history
    return threshold


if __name__ == '__main__':
    print main(sys.argv[1])
    # print check_xml(sys.argv[1])
