# -*- coding: utf8 -*-
"""
    xml工具
    ~~~~~~~

    :read_xml 读取xml
    :xml2txt 转换xml为txt文件，并生产空.ann文件
"""
import os
import xml.etree.cElementTree as et
from utils import get_filename


def read_xml(xml_file):
    # 读取xml
    xml_dict = {}
    xml_tree = et.ElementTree(file=xml_file)
    for child in xml_tree.getroot():
        if child.tag == 'name':
            xml_dict['name'] = xml_file[:-4]
            if child.text is not None:
                xml_dict['name'] = child.text.encode('utf-8').replace('\n', '').strip()
        if child.tag == 'org':
            xml_dict['org'] = ''
            if child.text is not None:
                xml_dict['org'] = child.text.encode('utf-8').replace('\n', '').strip()
        if child.tag == 'resume':
            xml_dict['resume'] = ''
            xml_dict['lines'] = []
            if child.text is not None:
                xml_dict['resume'] = child.text.encode('utf-8').replace('\n', '').strip()
                xml_dict['lines'] = child.text.encode('utf-8').split('\n')
    return xml_dict


def xml2txt(xml_file, output_dir):
    if not os.path.exists(output_dir):
        os.mkdir(output_dir)
    # 转换xml为txt文件，并生产空.ann文件
    xml_dict = read_xml(xml_file)
    # 空ann文件
    ann_file = '{0}/{1}.ann'.format(output_dir, get_filename(xml_file))
    with open(ann_file, 'w') as f:
        f.write('')

    # 写txt文件
    txt_file = '{0}/{1}.txt'.format(output_dir, get_filename(xml_file))
    with open(txt_file, 'w') as f:
        f.write('')
    with open(txt_file, 'a+') as f:
        f.write(xml_dict['name'] + '\n')
        f.write(xml_dict['org'] + '\n')
        resume_length = len(xml_dict['lines'])
        for line_num in range(resume_length):
            line = xml_dict['lines'][line_num].strip()
            if len(line) == 0:
                continue
            if not line_num == resume_length - 2:
                line += '\n'
            f.write(line)
