from scipy.stats import kruskal

# Example data
group1 = [5, 6, 7, 8, 9]
group2 = [3, 5, 6, 7, 9]
group3 = [2, 4, 6, 5, 7]

# Perform Kruskal-Wallis H test
statistic, p_value = kruskal(group1, group2, group3)
print("Kruskal-Wallis H Test Results:")
print("Test Statistic:", round(statistic, 2))
print("p-value:", round(p_value, 2))
