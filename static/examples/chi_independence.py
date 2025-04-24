import numpy as np
import scipy.stats as stats

# Example data
observed = np.array([[15, 5],
                    [3, 16]])

# Perform chi-squared test for independence
chi2, p_value, dof, expected = stats.chi2_contingency(observed)
print("Chi-Squared Test Results:")
print("Chi-squared statistic:", round(chi2, 2))
print("p-value:", round(p_value, 2))
print("Degrees of Freedom:", round(dof, 2))
print("Expected Frequencies:")
print(expected)
