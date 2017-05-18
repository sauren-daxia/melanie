# -*- coding: utf8 -*-
"""
   xml转txt格式
"""
import os
import sys
from libs import xml_tools


def main(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for f in files:
            xml_file = os.path.join(root, f)
            xml_tools.xml2txt(xml_file)


if __name__ == '__main__':
    main(sys.argv[1])
