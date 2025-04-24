from scipy.stats import ttest_rel

# Example data
before = [18, 19, 20, 17, 16]
after = [15, 17, 19, 16, 16]

# Perform paired t-test
t_statistic, p_value = ttest_rel(before, after)
print("Paired t-test Results:")
print("t-statistic:", round(t_statistic,2 ))
print("p-value:", round(p_value, 2))
