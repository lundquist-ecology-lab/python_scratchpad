import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

values = [60, 20, 30, 20]
condition = ["Treatment", "Control", "Treatment", "Control"]
group = ["Group 1", "Group 1", "Group 2", "Group 2"]

data = pd.DataFrame({'Values': values, 'Condition': condition, 'Group': group})

# Create the figure and axes manually
fig, ax = plt.subplots()

# Bars side by side
sns.barplot(x='Condition', y='Values', hue='Group', data=data, ax=ax, palette=["#69b3a2", "#b37d69"])

# Show the plot
plt.show()
