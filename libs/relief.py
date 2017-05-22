# -*- coding: utf-8 -*-
import numpy as np
from random import randrange
from sklearn.datasets import make_classification
from sklearn.preprocessing import normalize

"""
TODO
1. 分词 ----> 提取特征
feature
[f1,f2,f3,f4,...,fn] [label_1]
[f1,f2,f3,f4,...,fn] [label_2]

txt ===> 分词 ===> add to dict ===> get feature number ===> set feature map ===> add line to feature/label
2. 特征选择
"""


def distanceNorm(Norm, D_value):
    if Norm == '1':
        counter = np.absolute(D_value)
        counter = np.sum(counter)
    elif Norm == '2':
        counter = np.power(D_value, 2)
        counter = np.sum(counter)
        counter = np.sqrt(counter)
    else:
        counter = np.absolute(D_value)
        counter = np.max(counter)

    return counter


def fit(features, labels, iter_ratio):
    (n_samples, n_features) = np.shape(features)
    distance = np.zeros((n_samples, n_samples))
    weight = np.zeros(n_features)

    if iter_ratio >= 0.5:
        # compute distance
        for index_i in xrange(n_samples):
            for index_j in xrange(index_i + 1, n_samples):
                D_value = features[index_i] - features[index_j]
                distance[index_i, index_j] = distanceNorm('2', D_value)
        distance += distance.T
    else:
        pass

    # start iteration
    for iter_num in xrange(int(iter_ratio * n_samples)):
        nearHit = list()
        nearMiss = list()
        distance_sort = list()

        # random extract a sample
        index_i = randrange(0, n_samples, 1)
        self_features = features[index_i]

        # search for nearHit and nearMiss
        if iter_ratio >= 0.5:
            distance[index_i, index_i] = np.max(
                distance[index_i])      # filter self-distance
            for index in xrange(n_samples):
                distance_sort.append(
                    [distance[index_i, index], index, labels[index]])
        else:
            # compute distance respectively
            distance = np.zeros(n_samples)
            for index_j in xrange(n_samples):
                D_value = features[index_i] - features[index_j]
                distance[index_j] = distanceNorm('2', D_value)
            distance[index_i] = np.max(distance)       # filter self-distance
            for index in xrange(n_samples):
                distance_sort.append([distance[index], index, labels[index]])
        distance_sort.sort(key=lambda x: x[0])
        for index in xrange(n_samples):
            if nearHit == [] and distance_sort[index][2] == labels[index_i]:
                # nearHit = distance_sort[index][1];
                nearHit = features[distance_sort[index][1]]
            elif nearMiss == [] and distance_sort[index][2] != labels[index_i]:
                # nearMiss = distance_sort[index][1]
                nearMiss = features[distance_sort[index][1]]
            elif nearHit != [] and nearMiss != []:
                break
            else:
                continue

        # update weight
        weight = weight - \
            np.power(self_features - nearHit, 2) + \
            np.power(self_features - nearMiss, 2)
    # print weight / (iter_ratio * n_samples)
    return weight / (iter_ratio * n_samples)
    # return weight


def test():
    (features, labels) = make_classification(n_samples=500)
    features = normalize(X=features, norm='l2', axis=0)
    for x in xrange(1, 10):
        weight = fit(features, labels, 1)
        feature = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        feature_sort(weight, feature)


def feature_sort(weight, feature):
    fw = [(f, w) for f, w in zip(feature, weight)]
    fws = sorted(fw, key=lambda d: d[1], reverse=True)
    fs = ','.join([d[0] for d in fws])
    print fs


if __name__ == '__main__':
    test()
