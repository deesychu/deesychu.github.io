import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Low memory adds less data to the seaborn graph so that's why the seaborn and p5.js graphs look different
df = pd.read_csv('A3/data/reviews_750-1250.csv')

pink_palette = ["#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493"]

sns.set_theme(style="whitegrid")

plt.figure(figsize=(10, 6))

sns.histplot(data=df, x='price_usd', bins=30, kde=True, color='#FFC0CB', edgecolor='none')

plt.xlim(0, 400)
plt.ylim(0, 30000)

plt.xlabel('Price (USD)')
plt.ylabel('Frequency')
plt.title('Distribution of Product Prices')

plt.savefig('histogram_price.png')

plt.tight_layout()
plt.show()