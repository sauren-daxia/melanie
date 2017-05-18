# -*- coding: utf8 -*-

import os
import sys
from threshold import check_xml


OUTPUT_FILE = 'result2.csv'


def main(root_dir):
    with open(OUTPUT_FILE, 'w') as fout:
        fout.write('')
    fout = open(OUTPUT_FILE, 'a+')
    for root, dirs, files in os.walk(root_dir, topdown=True):
        for d in dirs:
            parent_dir = os.path.join(root, d)
            for _root, _dirs, _files in os.walk(parent_dir, topdown=True):
                for _d in _dirs:
                    child_dir = os.path.join(_root, _d)
                    for __root, __dirs, __files in os.walk(child_dir, topdown=True):
                        threshold = 0
                        history = []
                        low = ''
                        for __f in __files:
                            if __f.find('.xml') == -1:
                                continue
                            xml_file = os.path.join(__root, __f)
                            try:
                                num = check_xml(xml_file)
                                if threshold < num:
                                    history.append(threshold)
                                    threshold = num
                                    low = xml_file
                            except Exception as e:
                                print xml_file
                                print e
                        line = '{0},{1},{2},{3}\n'.format(child_dir,threshold,low,history)
                        fout.write(line)
    fout.close()


if __name__  == '__main__':
    main(sys.argv[1])
