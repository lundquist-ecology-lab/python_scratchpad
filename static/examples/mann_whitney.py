from scipy.stats import mannwhitneyu

# Example data
group1 = [6, 7, 8, 9, 10]
group2 = [3, 5, 6, 7, 9]

# Perform Mann-Whitney U test
statistic, p_value = mannwhitneyu(group1, group2)
print("Mann-Whitney U Test Results:")
print("Test Statistic:", round(statistic, 2))
print("p-value:", round(p_value, 2))
