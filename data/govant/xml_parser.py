# -*- coding: utf8 -*-
"""
 读取 resume 获得相关信息
"""

import os
import re
import sys
import collections
import xml.etree.cElementTree as et
import xml.dom.minidom as dom


# warning file， 记录姓名可能出错的文件
WARNING_FILE = 'warnning_file.csv'
# 输出文件夹
OUTPUT_DIR = './test_resumes'


def get_filename(file_path):
    """ 文件名去除文件夹路径和后缀名 """
    filename = file_path.split('/')[-1].split('.')[0]
    return filename


def parse_name(filename, name):
    """ 标准化 name 属性 """
    # 如果 name 为空， 使用filename
    # 否则， 返回filename 和 name 中 较短的一个
    output_name = ''
    if name is None:
        output_name = filename
    else:
        name = name.encode('utf-8')
        if len(name) > len(filename):
            output_name = filename
        else:
            output_name = name

    # 格式化
    output_name = output_name.replace('同志', '')
    output_name = output_name.replace('简历', '')
    output_name = output_name.replace('部长', '')
    output_name = output_name.replace('：', '')
    output_name = output_name.replace('省长', '')
    output_name = output_name.replace('兼政治部主任', '')
    output_name = output_name.replace('党组', '')
    output_name = output_name.replace('常务', '')
    output_name = output_name.replace('副', '')
    output_name = output_name.replace('秘书长', '')
    output_name = output_name.replace('主席', '')
    output_name = output_name.replace('成员', '')
    output_name = output_name.replace('江苏省人民政府', '')
    output_name = output_name.replace('省委常委', '')
    output_name = output_name.replace('书记', '')

    # 将标准化结果中长度大于3或小于2的计入warning file, encoding=utf-8, length*3
    if len(output_name) > 9 or len(output_name) < 3:
        with open(WARNING_FILE, 'a+') as wf:
            wf.write(filename + ',' + output_name + '\n')

    return output_name


def resume2lines(resume):
    """ 将 resume 分行标记 """
    attr_lines = []
    lines = resume.split('\n')
    pattern = re.compile(r'[\d]{4}')
    for line in lines:
        if line == '':
            continue
        num_year = len(re.findall(pattern, line))
        if num_year == 1:
            attr_lines.append({'text': line, 'attr': 'year'})
        elif num_year == 2:
            attr_lines.append({'text': line, 'attr': 'years'})
        elif num_year > 3:
            attr_lines.append({'text': line, 'attr': 'warning'})
        elif num_year == 0:
            attr_lines.append({'text': line, 'attr': 'others'})
    return attr_lines


def write_xml(output_dict, output_path):
    """ 输出 xml 文件 """
    impl = dom.getDOMImplementation()
    idom = impl.createDocument(None, 'root', None)
    root = idom.documentElement

    # name
    name = idom.createElement('name')
    name_text = idom.createTextNode(output_dict['name'])
    name.appendChild(name_text)
    root.appendChild(name)

    # org
    org = idom.createElement('org')
    org_text = idom.createTextNode(output_dict['org'])
    org.appendChild(org_text)
    root.appendChild(org)

    # resume
    resume = idom.createElement('resume')
    for line in output_dict['attr_lines']:
        line_em = idom.createElement('line')
        line_text = idom.createTextNode(line['text'])
        line_em.appendChild(line_text)
        line_em.setAttribute('type', line['attr'])
        resume.appendChild(line_em)
    root.appendChild(resume)

    with open(output_path, 'w') as xf:
        idom.writexml(xf, addindent=' ', newl='\n', encoding='utf-8')


def parse_xml(file_path):
    """ 标准化 xml 文件 """
    filename = get_filename(file_path)
    xml_tree = et.ElementTree(file=file_path)
    output_dict = collections.OrderedDict()

    for child in xml_tree.getroot():
        if child.tag == 'name':
            # output_dict['name'] = parse_name(filename, child.text)
            output_dict['name'] = child.text.encode('utf-8').replace(' ','');
        if child.tag == 'resume':
            output_dict['attr_lines'] = resume2lines(child.text.encode('utf-8'))
        if child.tag == 'org':
            output_dict['org'] = child.text.encode('utf-8')

    output_path = os.path.join(
        OUTPUT_DIR, output_dict['name'] + '_' + output_dict['org'] + '.xml')
    write_xml(output_dict, output_path)


if __name__ == '__main__':
    start_path = sys.argv[1]
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    for root, dirs, files in os.walk(start_path):
        for file in files:
            if file.find('.xml') != -1:
                xml_path = os.path.join(root, file)
                try:
                    # format text
                    # os.system('node formatText.js ' + xml_path)
                    parse_xml(xml_path)
                except Exception as e:
                    print e
                    print '[Error] ' + e.message + ': ' + xml_path
