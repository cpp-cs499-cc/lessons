from sklearn import linear_model

from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

input_age = [ [20, 1], [30, 1], [40, 1], [50, 1], [60, 1], [70, 1],
              [20, 2], [30, 2], [40, 2], [50, 2], [60, 2], [70, 2]]
output_sa = [ 90000, 150000, 180000, 250000, 140000, 80000,
              30000, 60000, 70000, 90000, 100000, 120000]

reg = linear_model.LinearRegression()
reg.fit(input_age, output_sa)

print reg.predict([ [25, 1] ])
print reg.predict([ [65, 1] ])
print ''

model = make_pipeline(PolynomialFeatures(2), Ridge())
model.fit(input_age, output_sa)
print model.predict([ [25, 1] ])
print model.predict([ [65, 1] ])


model = make_pipeline(PolynomialFeatures(2), Ridge())
model.fit(input_age, output_sa)
print model.predict([ [25, 2] ])
print model.predict([ [65, 2] ])
