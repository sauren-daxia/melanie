# -*- coding: utf8 -*-
import os
import sys
import re
import jieba
import xml.etree.cElementTree as et


CSV_FILE = 'csv5.csv'


class Resume(object):
    """ 简历类 """

    def __init__(self, xml_file):
        self.positions = []
        self.times = []
        self.bachelor = ''
        self.master = ''
        self.doctor = ''
        self.education = ''
        self.current = ''
        self.gender = ''
        self.ethnicity = ''
        xml_tree = et.ElementTree(file=xml_file)

        for child in xml_tree.getroot():
            if child.tag == 'name':
                self.name = child.text.encode('utf-8')
            if child.tag == 'org':
                self.org = child.text.encode('utf-8')
            if child.tag == 'resume':
                for line in child:
                    self.cut(line.text.encode('utf-8'), line.attrib['type'])
                    # self.cut(line.text.encode('utf-8'), 'year')

    def __str__(self):
        self.current = self.positions[-1].encode('utf-8')
        ext_str = ''
        for i in range(len(self.times)):
            ext_str += self.times[i].encode('utf-8') + \
                ',' + self.positions[i].encode('utf-8') + ','
        # return '{0.name!s}, {0.org!s}\nedu: {0.education!s}\nbachelor:
        # {0.bachelor}\nmaster: {0.master}\ndoctor:
        # {0.doctor}\n{1!s}'.format(self, ext_str)
        return '{0.name!s},{0.org!s},{0.gender},{0.ethnicity},{0.current},{0.bachelor},{0.master},{0.doctor},{0.education!s},{1!s}'.format(self, ext_str)

    def cut(self, line, type):
        """ 分词 """
        res = jieba.cut(line.replace('，', ';'))
        word_list = "$".join(res).split('$')
        for word in word_list:
            word = word.encode('utf-8')
        if type == 'year' or type == 'years':
            after_time = self.time_join(word_list)
            self.position_join(after_time)
            self.info_geter(after_time)
        elif type == 'others':
            self.info_geter(word_list)

    def time_join(self, word_list):
        """ time """
        year_pattern = re.compile('[\d]{4}|[\d\-年月至]+'.decode('utf-8'))
        time_str = ''
        after_wl = []

        for i in range(len(word_list)):
            word = word_list[i]
            if re.match(year_pattern, word) is None:
                break
            time_str += word

        self.times.append(time_str)

        for j in range(i, len(word_list)):
            after_wl.append(word_list[j])

        return after_wl

    def position_join(self, word_list):
        """ position """
        position_str = ''

        for i in range(len(word_list)):
            word = word_list[i]
            position_str += word

        self.positions.append(position_str)

    def info_geter(self, word_list):
        """ info """
        year_pattern = re.compile('[\d]{4}|[\d\-年月至]+'.decode('utf-8'))
        cursor = 0
        for i in range(len(word_list)):
            word = word_list[i]
            if not re.match('男'.decode('utf-8'), word) is None:
                self.gender = '男'
                cursor = i
            elif not re.match('女'.decode('utf-8'), word) is None:
                self.gender = '女'
                cursor = i
            elif not re.search('族'.decode('utf-8'), word) is None:
                self.ethnicity = word.encode('utf-8')
                cursor = i
            elif not re.search('博士'.decode('utf-8'), word) is None:
                doctor_str = ''
                for j in range(cursor + 1, i + 1):
                    doctor_str += word_list[j].encode('utf-8')
                if doctor_str != '':
                    if self.doctor != '':
                        self.doctor += '-'
                    self.doctor += doctor_str
                    cursor = i
            elif not re.search('硕士|研究生'.decode('utf-8'), word) is None:
                master_str = ''
                for j in range(cursor + 1, i + 1):
                    master_str += word_list[j].encode('utf-8')
                if master_str != '':
                    if self.master != '':
                        self.master += '-'
                    self.master += master_str
                    cursor = i
            elif not re.search('本科'.decode('utf-8'), word) is None:
                bachelor_str = ''
                for j in range(cursor + 1, i + 1):
                    bachelor_str += word_list[j].encode('utf-8')
                if bachelor_str != '':
                    if self.bachelor != '':
                        self.bachelor += '-'
                    self.bachelor += bachelor_str
                    cursor = i
            elif not re.search('学习'.decode('utf-8'), word) is None:
                education_str = ''
                for j in range(cursor + 1, i + 1):
                    education_str += word_list[j].encode('utf-8')
                if education_str != '':
                    if self.education != '':
                        self.education += '-'
                    self.education += education_str
                    cursor = i
            elif not re.search(';'.decode('utf-8'), word) is None:
                cursor = i

    def write_csv(self, csv_file):
        """ """
        with open(csv_file, 'a+') as cf:
            cf.write(str(self) + '\n')


if __name__ == '__main__':
    with open(CSV_FILE, 'w') as cf:
        cf.write('姓名,部门,性别,民族,现任职位,本科,研究生,博士,其他教育经历,时间,职位')
    for root, dirs, files in os.walk(sys.argv[1]):
        for file in files:
            if file.find('.xml') != -1:
                try:
                    xml_path = os.path.join(root, file)
                    resume = Resume(xml_path)
                    resume.write_csv(CSV_FILE)
                except Exception as e:
                    print e
                    print '[Error] ' + e.message + ': ' + xml_path
