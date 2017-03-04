from sklearn import datasets
from sklearn import svm

input_urls = [ [1, 1], [1, 2], [1, 3], [1, 6], [1, 5], [1, 7]]
output_next_urls = [ 101, 101, 101, 104, 101, 104 ]

clf = svm.SVC(gamma=0.001, C=100.)
clf.fit(input_urls, output_next_urls)

print clf.predict([ [1, 6] ])