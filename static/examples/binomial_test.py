from scipy.stats import binomtest

observed_successes = 7
total_trials = 10
expected_successes = 5

results = binomtest(observed_successes, total_trials, expected_successes/total_trials)
print("p-value:", round(results.pvalue, 3))
