import sys
import numpy as np
from sklearn.linear_model import LinearRegression

# Example input: "5,6,7,6,8,9,10"
data = sys.argv[1].split(",")
units = np.array(data, dtype=float)

# Prepare training data
X = np.arange(len(units)).reshape(-1, 1)
y = units

# Train model
model = LinearRegression()
model.fit(X, y)

# Predict next day
next_day = np.array([[len(units)]])
prediction = model.predict(next_day)

print(round(prediction[0], 2))