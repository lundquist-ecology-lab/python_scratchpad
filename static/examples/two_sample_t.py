from scipy.stats import ttest_ind

# Example data
group1 = [15, 18, 20, 22, 17]
group2 = [12, 14, 16, 15, 18]

# Perform two-sample t-test
t_statistic, p_value = ttest_ind(group1, group2)
print("Two-Sample t-test Results:")
print("t-statistic:", round(t_statistic, 2))
print("P-value:", round(p_value, 2))
