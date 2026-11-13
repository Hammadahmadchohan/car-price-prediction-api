
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import mean_absolute_error, r2_score


# STEP 1: Load Dataset
df = pd.read_csv('./Car details v3.csv')

# Remove duplicate records before train-test split
print("Original rows:", len(df))

df = df.drop_duplicates().reset_index(drop=True)

print("Rows after cleaning:", len(df))
print("Remaining duplicates:", df.duplicated().sum())


print("First 5 Rows:")
print(df.head())

print("\nDataset Shape:", df.shape)
print("\nDataset Information:")
df.info()

print("\nStatistical Summary:")
print(df.describe())


# STEP 2: Separate Features and Target
X = df.drop("selling_price", axis=1)
Y = df["selling_price"]


# STEP 3: Train-Test Split
X_train, X_test, Y_train, Y_test = train_test_split(
    X,
    Y,
    test_size=0.2,
    random_state=42
)


# STEP 4: Feature Engineering
def convert_features(data):
    data = data.copy()

    # Convert text columns into numeric values
    for col in ['mileage', 'engine', 'max_power']:
        data[col] = pd.to_numeric(
            data[col].astype('string').str.extract(
                r'(\d+\.?\d*)', expand=False
            ),
            errors='coerce'
        )

    # Extract car brand
    data['name'] = data['name'].str.split().str[0]

    # Remove torque temporarily
    data = data.drop(columns=['torque'])

    return data


X_train = convert_features(X_train)
X_test = convert_features(X_test)


# STEP 5: Identify Column Types
numerical_cols = X_train.select_dtypes(
    include=['number']
).columns.tolist()

categorical_cols = X_train.select_dtypes(
    include=['object', 'str', 'category']
).columns.tolist()


# STEP 6: Numerical Preprocessing
numerical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean'))
])


# STEP 7: Categorical Preprocessing
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])


# STEP 8: Combine Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_cols),
        ('cat', categorical_transformer, categorical_cols)
    ]
)


# STEP 9: Linear Regression Model
lr_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])

lr_model.fit(X_train, Y_train)

lr_predictions = lr_model.predict(X_test)

lr_mae = mean_absolute_error(Y_test, lr_predictions)
lr_r2 = r2_score(Y_test, lr_predictions)

print("\n========== LINEAR REGRESSION ==========")
print("MAE:", lr_mae)
print("R2 Score:", lr_r2)


# STEP 10: Random Forest Model
rf_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    ))
])

rf_model.fit(X_train, Y_train)

rf_predictions = rf_model.predict(X_test)

rf_mae = mean_absolute_error(Y_test, rf_predictions)
rf_r2 = r2_score(Y_test, rf_predictions)

print("\n========== RANDOM FOREST ==========")
print("MAE:", rf_mae)
print("R2 Score:", rf_r2)


# STEP 11: Compare Models
comparison = pd.DataFrame({
    'Model': ['Linear Regression', 'Random Forest'],
    'MAE': [lr_mae, rf_mae],
    'R2 Score': [lr_r2, rf_r2]
})

print("\n========== MODEL COMPARISON ==========")
print(comparison.to_string(index=False))


# STEP 12: Select Best Model
if rf_mae < lr_mae:
    best_model = rf_model
    best_name = "Random Forest"
    best_predictions = rf_predictions
else:
    best_model = lr_model
    best_name = "Linear Regression"
    best_predictions = lr_predictions

print("\nBest Model:", best_name)


# STEP 13: Actual vs Predicted Prices
results = pd.DataFrame({
    'Actual Price': Y_test.values,
    'Predicted Price': best_predictions
})

print("\n========== PREDICTION RESULTS ==========")
print(results.head(10))


# STEP 14: Save Best Model
joblib.dump(best_model, 'car_price_model.pkl')

print("\nModel saved successfully!")
print("File: car_price_model.pkl")


# Check training performance
train_predictions = rf_model.predict(X_train)

print("Training R2:",r2_score(Y_train, train_predictions))

print("Testing R2:",r2_score(Y_test, rf_predictions))

# Check duplicate rows in original dataset
print("Duplicate Rows:", df.duplicated().sum())
print("Final Test MAE:", mean_absolute_error(Y_test, rf_predictions))
