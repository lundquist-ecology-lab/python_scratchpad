import numpy as np

# Create a hypothetical population of 1000 individuals with a normal distribution
population_size = 1000
population = np.random.normal(loc=50, scale=10, size=population_size)  # Mean = 50, Std = 10

# Important: You could also import data from a csv or some other data source

# Define sample size
sample_size = 100  # Adjust as needed

# Take a random sample from the population
sample = np.random.choice(population, size=sample_size, replace=False)  # 'replace=False' ensures no duplicate sampling

# Display sample statistics
print(f"Sample Mean: {np.mean(sample):.2f}")
print(f"Sample Standard Deviation: {np.std(sample):.2f}")
