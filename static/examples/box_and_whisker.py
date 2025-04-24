# Scatter plots in Python
import matplotlib.pyplot as plt
import seaborn as sns
from palmerpenguins import load_penguins

penguins = load_penguins()

# Create a box plot for flipper length by species
plt.figure(figsize=(15,10))
sns.boxplot(data=penguins, x="species", y="flipper_length_mm", palette="Set2")

plt.xlabel('Species')  # Corrected
plt.ylabel('Flipper Length (mm)')  # Corrected
plt.title('Box plot of the flipper lengths per species')
plt.show()

