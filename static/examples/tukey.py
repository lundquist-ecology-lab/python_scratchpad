from statsmodels.stats.multicomp import MultiComparison

# Same data from one-way ANOVA
data = {'Group': ['A1', 'A2', 'A3', 'A1', 'A2', 'A3', 'A1', 'A2', 'A3'],
    'Value': [5, 7, 4, 6, 8, 10, 9, 11, 8]}

multicomp = MultiComparison(data['Value'], data['Group'])
tukey_results = multicomp.tukeyhsd()
print(tukey_results)
