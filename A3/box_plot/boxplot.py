import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('A3/data/reviews_750-1250.csv', low_memory=False)

sns.set_theme(style="whitegrid")

plt.figure(figsize=(10, 6))

sns.boxplot(x=df['rating'], color='#FFC0CB', width=0.5)

plt.xlabel('Review Rating (1-5)')
plt.title('Distribution of Product Ratings')

plt.savefig('boxplot_rating.png')

plt.tight_layout()
plt.show()
