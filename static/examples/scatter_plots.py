# Scatter plots in Python
import matplotlib.pyplot as plt
from palmerpenguins import load_penguins

penguins = load_penguins()

# Choose numerical data
y = penguins['body_mass_g']
x = penguins['flipper_length_mm']

plt.scatter(x, y, color = "#69b3a2")
plt.xlabel('Flipper length (mm)')
plt.ylabel('Body mass (g)')
plt.title('Penguin body mass vs flipper length')
plt.show()
