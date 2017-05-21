# -*- coding: utf8 -*-

import os
import sys
import collections
import xml.etree.cElementTree as et
import xml.dom.minidom as dom


# warning file， 记录姓名可能出错的文件
WARNING_FILE = 'warnning_file.csv'
# 输出文件夹
OUTPUT_DIR = './resumes'


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


def parse_resume(resume):
    """ 标准化 resume 属性 """
    if resume is None:
        return ''
    output_resume = resume.encode('utf-8')
    lines = text2lines(output_resume)
    if len(lines) < 5:
        with open('logs', 'a+') as log:
            log.write('\n--------- ' + str(len(lines)) + ' --------\n')
            log.write(output_resume)
    return output_resume


def get_filename(file_path):
    """ 文件名去除文件夹路径和后缀名 """
    filename = file_path.split('/')[-1].split('.')[0]
    return filename


def split_resume(text):
    """ 分割 resume """
    # 规范化
    # 简历 -> 文本行/时间行
    lines = text.split('\n')
    
    # 时间行
    # xxxx(年)(xx月) -> xxxx(.xx)
    # 至 -> -
    # 'xxxx-xxxx内容'/'xxxx-xxxx  内容' -> 'xxxx-xxxx 内容'

    # 文本行
    # 性别
    # 民族
    # 出生地
    # 其他



def parse_xml(file_path):
    """ 标准化 xml 文件 """
    filename = get_filename(file_path)
    xml_tree = et.ElementTree(file=file_path)
    output_dict = collections.OrderedDict()

    for child in xml_tree.getroot():
        if child.tag == 'name':
            output_dict['name'] = parse_name(filename, child.text)
        if child.tag == 'resume':
            output_dict['resume'] = parse_resume(child.text)
        if child.tag == 'org':
            output_dict['org'] = child.text.encode('utf-8')

    if output_dict['resume'] == '':
        print '[Warnning] No resume: ' + filename

    output_path = os.path.join(
        OUTPUT_DIR, output_dict['name'] + '_' + output_dict['org'] + '.xml')
    output_xml(output_dict, output_path)


def output_xml(output_dict, output_path):
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
    resume_text = idom.createTextNode(output_dict['resume'])
    resume.appendChild(resume_text)
    root.appendChild(resume)

    with open(output_path, 'w') as xf:
        idom.writexml(xf, addindent=' ', newl='\n', encoding='utf-8')


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
                    os.system('node formatText.js ' + xml_path)
                    parse_xml(xml_path)
                except Exception as e:
                    print '[Error] ' + e.message + ': ' + xml_path
