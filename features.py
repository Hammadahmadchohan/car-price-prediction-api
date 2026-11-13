
import pandas as pd

def convert_features(data):
    data = data.copy()

    for col in ['mileage', 'engine', 'max_power']:
        data[col] = pd.to_numeric(
            data[col].astype('string').str.extract(
                r'(\d+\.?\d*)', expand=False
            ),
            errors='coerce'
        )

    data['name'] = data['name'].str.split().str[0]

    data = data.drop(columns=['torque'])

    return data
