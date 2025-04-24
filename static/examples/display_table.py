# Producing and displaying tables
import pandas as pd
from IPython.display import display, Markdown

# Import data from the internet
subway_data = pd.read_csv('https://raw.githubusercontent.com/lundquist-ecology-lab/subway_map_analysis/main/data/subway_data.csv')

# Remove "id" and "units" column
subway_data = subway_data.drop(['id', 'units'], axis=1)

# Convert m2 to k2 and round
subway_data['b_area'] = round(subway_data['b_area'] / 1000000, 2)
subway_data['g_area'] = round(subway_data['g_area'] / 1000000, 2)

# Produce new table with more readable heading names
subway_data.columns = ["Borough", "Subway Stations", "Stations near green spaces", "Total borough area (km<sup>2</sup>)", "Total green area (km<sup>2</sup>)"]

# Export table as .csv to work with in other programs or share
subway_data.to_csv("outputs/subway_table.csv", index = False)

# Assuming 'data' is your DataFrame
markdown_table = subway_data.to_markdown()

# To display the markdown table in the Jupyter notebook
display(Markdown(markdown_table))
