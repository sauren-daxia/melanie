# -*- coding: utf-8 -*-
import os


class Labels(object):
    def __init__(self):
        self.labels = []

    def __len__(self):
        return len(self.labels)

    def __str__(self):
        return ','.join(self.labels)

    def add(self, label):
        self.labels.append(label)

    def load(self, file_name):
        if not os.path.exists(file_name):
            raise NameError('no such file')
        with open(file_name, 'r') as f:
            lines = f.readlines()
        for line in lines:
            try:
                self.labels.append(line)
            except Exception as e:
                print e

    def save(self, file_name):
        save_str = ''
        for i in range(len(self.labels)):
            save_str += str(self.labels[i]) + '\n'
        with open(file_name, 'w') as f:
            f.write(save_str[:-1])
