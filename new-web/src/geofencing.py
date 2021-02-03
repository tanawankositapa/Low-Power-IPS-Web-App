from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import matplotlib.pyplot as plt
import sys
from shapely.ctypes_declarations import prototype
import ast

test = sys.argv
x = float(test[1])
y = float(test[2])
coorString = test[3]

# ast.literal_eval คือ convert string that represent list into list 
# สุดยอดมากกก !
coor = ast.literal_eval(coorString)

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
# polygon = Polygon([[1, 1], [1, 4], [2, 4], [2, 5], [4, 5], [4, 1]])
# # polygon = Polygon([[1, 1], [1, 2], [3, 2], [2, 5], [4, 5], [4, 1]])
# # polygon = Polygon([[5, 1], [3, 2], [2, 5], [4, 5], [5, 3]])

# print(polygon.contains(point))

# x, y = polygon.exterior.xy
# plt.plot(x, y)
# plt.scatter(2, 3)
# plt.show()
# ##############################################################################