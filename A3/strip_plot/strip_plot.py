import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('A3/data/reviews_750-1250.csv', low_memory=False)

sns.set_theme(style="whitegrid")
plt.figure(figsize=(8, 6))

sns.stripplot(y=df['total_feedback_count'], color='#FF69B4', jitter=0.25, alpha=0.5)

plt.ylabel('Total Feedback Count')
plt.title('Distribution of Review Feedback')

plt.savefig('stripplot_feedback.png')

plt.tight_layout()
plt.show()