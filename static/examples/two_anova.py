import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols

# Example data (replace with your own data)
dataTW = {'A': ['A1', 'A2', 'A1', 'A2', 'A1', 'A2', 'A1', 'A2'],
        'B': ['B1', 'B1', 'B2', 'B2', 'B1', 'B1', 'B2', 'B2'],
        'Value': [5, 7, 4, 6, 8, 10, 9, 11]}

# Create DataFrame
df = pd.DataFrame(dataTW)

# Perform Two-way ANOVA
model = ols('Value ~ A + B + A:B', data=df).fit()

anova_table = round(sm.stats.anova_lm(model), 3)
print("Two-Way ANOVA Results:")
print(anova_table)
