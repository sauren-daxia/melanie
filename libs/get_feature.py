# -*- coding: utf8 -*-
"""
    获取特征向量
"""
import xml.etree.cElementTree as et

FEATURES = [
    '年',
    '月',
    '工作',
    '副',
    '男',
    '参加',
    '汉族',
    '研究',
    '主任',
    '中国',
    '大学',
    '书记',
    '党组',
    '专业',
    '委员',
    '学历',
    '成员',
    '学院',
    '学习',
    '加入',
    '管理',
    '中央',
    '共产党',
    '政府',
    '常委',
    '经济',
    '现任',
    '部长',
    '毕业',
    '党委',
    '硕士',
    '人民',
    '干部',
    '其间',
    '党校',
    '在职',
    '学位',
    '办公室',
    '博士',
    '助理',
    '兼',
    '秘书',
    '国家',
    '工程',
    '负责',
    '出生',
    '至',
    '科学',
    '高级',
    '十八',
    '第十',
    '技术',
    '公司',
    '分管',
    '联系',
    '主席',
    '民政',
    '人大',
    '常务',
    '培训',
    '发展',
    '中心',
    '全国',
    '工业',
]

YEARS = []
for y in range(1950, 2018):
    YEARS.append(str(y))


def get_feature(text):
    # 获取特征向量
    feature_list = []
    for i in range(len(FEATURES)):
        if not text.find(FEATURES[i]) == -1:
            feature_list.append(1)
        else:
            feature_list.append(0)
    level = 0
    for y in YEARS:
        if not text.find(y) == -1:
            level += 1
    if level < 5:
        feature_list.append(0.2 * level)
    else:
        feature_list.append(1)
    return feature_list


def get_feature_from_xml(xml_file):
    # 读取xml文件
    xml_tree = et.ElementTree(file=xml_file)
    for child in xml_tree.getroot():
        if child.tag == 'resume':
            text = child.text.encode('utf-8').replace('\n', '')
    return get_feature(text)


def get_feature_from_txt(txt_file):
    # 读取txt文件
    text = ''
    with open(txt_file, 'r') as f:
        text = f.read().replace('\n', '')
    return get_feature(text)
