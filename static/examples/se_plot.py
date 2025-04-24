import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats
from palmerpenguins import load_penguins

# Load the Palmer Penguin dataset
df = load_penguins()

# Subsetting for means and SE of biomass length 
mean_adelie = np.mean(df[df['species'] == 'Adelie']['body_mass_g'].dropna()) 
se_adelie = stats.sem(df[df['species'] == 'Adelie']['body_mass_g'].dropna())

mean_chinstrap = np.mean(df[df['species'] == 'Chinstrap']['body_mass_g'].dropna()) 
se_chinstrap = stats.sem(df[df['species'] == 'Chinstrap']['body_mass_g'].dropna())

mean_gentoo = np.mean(df[df['species'] == 'Gentoo']['body_mass_g'].dropna()) 
se_gentoo = stats.sem(df[df['species'] == 'Gentoo']['body_mass_g'].dropna())

# Example data of mean weights and corresponding standard errors for each penguin species
species = ['Adelie', 'Chinstrap', 'Gentoo']
mean_weights = [mean_adelie, mean_chinstrap, mean_gentoo]  # Mean weights in grams
std_errors = [se_adelie, se_chinstrap, se_gentoo]  # Standard errors of the mean weights

# Calculate the positions of the bars on the x-axis
x = np.arange(len(species))

# Plotting the bar graph
plt.bar(x, mean_weights, yerr=std_errors, color="#69b3a2", alpha=0.7)

# Customize the plot
plt.xlabel('Penguin Species')
plt.ylabel('Mean Weight (grams)')
plt.title('Mean Weight of Palmer Penguin Species')
plt.xticks(x, species)
plt.ylim([0, max(mean_weights) + max(std_errors) + 200])

# Display the plot
plt.show()
