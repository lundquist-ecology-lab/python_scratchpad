import pandas as pd
from palmerpenguins import load_penguins

penguins = load_penguins()
bill_length_mm = penguins['bill_length_mm'].dropna() # .dropna() is optional, but there is missing data in this dataset

# Summary stats using pandas
print("Summary:", round(bill_length_mm.describe(), 2))
