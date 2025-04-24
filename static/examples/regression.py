import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

# Example data (replace with your own data)
x = [1, 2, 3, 4, 5]
y = [5, 7, 8, 9, 11]

# Perform simple linear regression
slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)

# Plot the regression line
plt.scatter(x, y)
plt.plot(x, slope * np.array(x) + intercept, color='red')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Simple Linear Regression')
plt.show()

print("Slope:", round(slope, 3))
print("Intercept:", round(intercept, 3))
print("R-value (Correlation Coefficient):", round(r_value, 3))
print("P-value:", round(p_value, 3))
print("Standard Error:", round(std_err, 3))
