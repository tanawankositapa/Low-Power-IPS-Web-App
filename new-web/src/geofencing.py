from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import matplotlib.pyplot as plt
import sys
from shapely.ctypes_declarations import prototype


test = sys.argv
# print(len(test))
# print(type(test))
# print(test[1])
# print(test[2])
x = float(test[1])
y = float(test[2])
# inputXY = input().split(',')
# list = []
# for i in inputXY:
#     list.append(float(i))

# print(list[0])
# print(type(list[0]))
point = Point(x, y)
polygon = Polygon([(1, 1), (1, 4), (2, 4), (2, 5), (4, 5), (4, 1)])
print(polygon.contains(point))
sys.stdout.flush()

# polygon1 = Polygon([(1, 1), (2, 4), (1, 4),  (2, 5), (4, 5), (4, 1)])

# x, y = polygon.exterior.xy
# plt.plot(x, y)
# plt.scatter(2, 3)
# plt.show()
