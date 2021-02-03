from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import matplotlib.pyplot as plt
import sys
from shapely.ctypes_declarations import prototype
import ast

test = sys.argv
# print(len(test))
# print(type(test))
# print(test[1])
# print(test[2])
x = float(test[1])
y = float(test[2])
coorString = test[3]
# print(test[3])
# print(type(test[3]))
# ast.literal_eval คือ convert string that represent list into list 
# สุดยอดมากกก !
coor = ast.literal_eval(coorString)
# print(coor)
# print(type(coor))
# print(coor)
# print(type(coor))
# inputXY = input().split(',')
# list = []
# for i in inputXY:
#     list.append(float(i))

# print(list[0])
# print(type(list[0]))
point = Point(x, y)
# polygon = Polygon([[1, 1], [1, 4], [2, 4], [2, 5], [4, 5], [4, 1]])
polygon = Polygon(coor)
print(polygon.contains(point))
sys.stdout.flush()

# polygon1 = Polygon([(1, 1), (2, 4), (1, 4),  (2, 5), (4, 5), (4, 1)])

# x, y = polygon.exterior.xy
# plt.plot(x, y)
# plt.scatter(2, 3)
# plt.show()

# ################################################### for test another polygon
# from shapely.geometry import Point
# from shapely.geometry.polygon import Polygon
# import matplotlib.pyplot as plt
# import sys
# from shapely.ctypes_declarations import prototype
# import ast

# #

# # print(list[0])
# # print(type(list[0]))
# point = Point(2, 3)
# polygon = Polygon([[1, 1], [1, 2], [3, 2], [2, 5], [4, 5], [4, 1]])

# print(polygon.contains(point))

# x, y = polygon.exterior.xy
# plt.plot(x, y)
# plt.scatter(2, 3)
# plt.show()
###############################################################################