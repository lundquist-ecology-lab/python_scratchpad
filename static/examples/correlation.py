import numpy as np
import scipy.stats as stats

# Example data (replace with your own data)
x = [1, 2, 3, 4, 5]
y = [5, 7, 8, 9, 11]

# Calculate Pearson correlation coefficient
pearson_corr, _ = stats.pearsonr(x, y)
print("Pearson correlation coefficient:", round(pearson_corr, 2))

# Calculate Spearman correlation coefficient
spearman_corr, _ = stats.spearmanr(x, y)
print("Spearman correlation coefficient:", round(spearman_corr, 2))
