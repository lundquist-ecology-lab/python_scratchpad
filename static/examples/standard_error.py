import numpy as np
import scipy.stats as stats
from palmerpenguins import load_penguins

# Load the Palmer Penguin dataset
df = load_penguins()

sterr = stats.sem(df['bill_length_mm'].dropna()) # .dropna() only needed if there are NA values in your string
print(sterr)

#
