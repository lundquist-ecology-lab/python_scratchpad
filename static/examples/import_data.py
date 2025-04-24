import pandas as pd

# Read a CSV file into a DataFrame from URL
url = 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv'
df = pd.read_csv(url)

# Read a CSV file into a DataFrame from local file
df = pd.read_csv('penguin.csv')
