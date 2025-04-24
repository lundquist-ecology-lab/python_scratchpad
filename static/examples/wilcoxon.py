from scipy.stats import wilcoxon

# Example data
before = [5, 7, 6, 4, 9]
after = [6, 8, 7, 5, 11]

# Perform Wilcoxon Signed-Rank test
statistic, p_value = wilcoxon(before, after)
print("Wilcoxon Signed-Rank Test Results:")
print("Test Statistic:", round(statistic, 2))
print("p-value:", round(p_value, 2))
