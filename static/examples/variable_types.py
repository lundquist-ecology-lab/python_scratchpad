import pandas as pd
from palmerpenguins import load_penguins

#Make sure to download the library:
#pip install palmerpenguins

# Load the Palmer Penguins dataset
df = load_penguins()

# Determine the numeric and categorical variables
numeric_vars = df.select_dtypes(include=['number']).columns.tolist()
categorical_vars = df.select_dtypes(include=['object', 'category']).columns.tolist()

# Display numeric and categorical variables
print("Numeric Variables:", numeric_vars)
print("Categorical Variables:", categorical_vars)

# Get the levels (unique values) of each categorical variable
print("Levels of Categorical Variables:")
for var in categorical_vars:
    levels = df[var].dropna().unique()  # Get unique values and exclude NaN
    print(f"- {var}: {levels}")
