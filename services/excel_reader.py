import pandas as pd

def read_excel(filepath):
    df = pd.read_excel(filepath)
    return df.to_string(index=False)
