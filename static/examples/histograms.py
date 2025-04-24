# Histograms in Python
import matplotlib.pyplot as plt
from palmerpenguins import load_penguins


penguins = load_penguins()
x = penguins['flipper_length_mm']

plt.hist(x, color = "#69b3a2", bins = 5) # You can change the "bins" value smooth out the pattern
plt.xlabel('')
plt.ylabel('Frequency')
plt.title('Penguin flipper lengths (mm)')
plt.show()
