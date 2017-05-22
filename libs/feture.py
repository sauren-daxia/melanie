# -*- coding: utf-8 -*-
"""
特征集合
"""
import os
import base64


class FeatureMap(object):
    def __init__(self):
        self.set = set()
        self.dict = {}

    def __len__(self):
        return len(self.set)

    def __str__(self):
        f_str = ''
        for f in self.set:
            f_str += '{0},{1}\n'.format(base64.b64decode(f), self.dict[f])
        return f_str[:-1]

    def __repr__(self):
        return repr(self.dict)

    def add(self, word):
        word_b64 = base64.b64encode(word)
        if word_b64 in self.set:
            return self.dict[word_b64]
        else:
            code = len(self)
            self.set.add(word_b64)
            self.dict[word_b64] = code
            return code

    def load(self, map_file):
        if not os.path.exists(map_file):
            raise NameError('no such file')
        with open(map_file, 'r') as f:
            lines = f.readlines()
        for line in lines:
            try:
                word, code = line.split(',')
                word_b64 = base64.b64encode(word)
                self.set.add(word_b64)
                self.dict[word_b64] = int(code)
            except Exception as e:
                print e

    def save(self, map_file):
        with open(map_file, 'w') as f:
            f.write(str(self))
