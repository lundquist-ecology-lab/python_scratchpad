import numpy as np
import scipy.stats as stats
from palmerpenguins import load_penguins

# Load the Palmer Penguin dataset
df = load_penguins()

ci_calc = stat.sem(df['bill_length_mm'].dropna()) * 2
print(ci_calc)
