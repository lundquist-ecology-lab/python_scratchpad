# Using the Mean Equation

x = [1, 4, 2, 3, 2]
n = len(x)

print("Mean of x =", round(sum(x)/n, 2))

# Using NumPy

import numpy as np
from palmerpenguins import load_penguins

penguins = load_penguins()
bill_length_mm = penguins['bill_length_mm'].dropna() # .dropna() is optional, but there is missing data in this dataset

mean = np.mean(bill_length_mm)
print("mean =", round(mean, 2))
