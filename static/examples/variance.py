# Manual calculation
import math
x = [1, 4, 2, 3, 2]

mean_x = sum(x) / len(x)
var_x = sum((xi - mean_x) ** 2 for xi in x) / (len(x) - 1)
sd_x = math.sqrt(var_x)

print('The variance of x =', round(var_x, 2))
print('The standard deviation of x =', round(sd_x, 2))

# Using NumPy
import numpy as np
from palmerpenguins import load_penguins

penguins = load_penguins()
bill_length_mm = penguins['bill_length_mm'].dropna() # .dropna() is optional, but there is missing data in this dataset

std_dev = np.std(bill_length_mm, ddof=1)
print("standard deviation =", round(std_dev, 2))

# Sample size
n = len(bill_length_mm)
print("n =", n)
