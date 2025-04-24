# One sample t test
from scipy.stats import ttest_1samp

# Example data
data = [4.8, 5.2, 5.1, 4.9, 5.3, 5.0, 5.2, 5.1]

# Hypothesized mean
hypothesized_mean = 5.0

# Perform one-sample t-test
t_statistic, p_value = ttest_1samp(data, hypothesized_mean)
print("One-Sample t-test Results:")
print("t-statistic:", round(t_statistic, 2))
print("P-value:", round(p_value, 2))
