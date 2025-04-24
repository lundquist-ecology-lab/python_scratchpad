from scipy.stats import binom
import matplotlib.pyplot as plt

n = 10
p = 0.5

x = range(n+1)
y = [binom.pmf(k, n, p) for k in x]

plt.bar(x, y, color = 'maroon')
plt.xlabel("Number of Successes")
plt.ylabel("Probability")
plt.title("Binomial Distribution (n=10, p=0.5)")
plt.show()
