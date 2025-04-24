from scipy.stats import chisquare

observed = [10, 15, 25, 20]  # Observed values
expected = [12, 15, 20, 23]  # Expected values based on hypothesized distribution

chi2, p_value = chisquare(f_obs=observed, f_exp=expected)
print("Chi-Squared Statistic:", round(chi2, 2))
print("p-value:", round(p_value, 2))
