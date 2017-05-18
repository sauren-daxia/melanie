# -*- coding: utf-8 -*-
"""
    logger
    ~~~~~~

    日志模块

    :author: xy
"""
import os
import sys
import logging


def get_logger(name):
    if not os.path.exists('log'):
        os.mkdir('log')
    logger_file = 'log/{0}.log'.format(name)
    logging.basicConfig(level=logging.INFO)
    formatter = logging.Formatter(
        '%(levelname)-2s %(asctime)s %(module)s:%(lineno)s [%(funcName)s] %(message)s'
    )
    console = logging.StreamHandler(sys.stderr)
    console.setFormatter(formatter)
    console.setLevel(level=logging.INFO)
    filehandler = logging.FileHandler(logger_file)
    filehandler.setFormatter(formatter)
    logger = logging.getLogger(logger_file)
    logger.addHandler(filehandler)
    return logger
