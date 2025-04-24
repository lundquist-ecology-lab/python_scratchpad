import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Sample data for a single group
values = [60, 20, 30, 20]
condition = ["Treatment", "Control", "Placebo", "Control"]

data = pd.DataFrame({'Values': values, 'Condition': condition})

# Create the figure and axes manually
fig, ax = plt.subplots()

# Single group bar graph
sns.barplot(x='Condition', y='Values', data=data, ax=ax, palette='viridis')

# Show the plot
plt.show()
