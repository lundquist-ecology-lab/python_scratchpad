import pandas as pd
import matplotlib.pyplot as plt

values = [60, 20, 30, 20]
condition = ["Treatment", "Control", "Treatment", "Control"]
group = ["Group 1", "Group 1", "Group 2", "Group 2"]

data = pd.DataFrame({'Values': values, 'Condition': condition, 'Group': group})

# Create a stacked bar plot
group1 = data[data['Group'] == 'Group 1']['Values']
group2 = data[data['Group'] == 'Group 2']['Values']

# Create a bar plot for 'Group 1'
plt.bar(data['Condition'].unique(), group1, color = "#69b3a2")
# Stack 'Group 2' on top of 'Group 1'
plt.bar(data['Condition'].unique(), group2, bottom=group1, color = "#b37d69")
plt.xlabel('Condition')
plt.ylabel('Value')
plt.show()
