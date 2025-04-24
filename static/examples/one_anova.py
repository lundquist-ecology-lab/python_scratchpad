import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols
from statsmodels.stats.anova import anova_lm

# Example data (replace with your own data)
    data = {'Group': ['A1', 'A2', 'A3', 'A1', 'A2', 'A3', 'A1', 'A2', 'A3'],
    'Value': [5, 7, 4, 6, 8, 10, 9, 11, 8]}

    # Fit an OLS model
    model = ols('Value ~ C(Group)', data=data).fit()

# Fit an OLS model
model = ols('value ~ C(group)', data=data).fit()

# Perform ANOVA
anova_results = anova_lm(model)
print(anova_results)
