import pandas as pd


def read_excel(filepath):

    if filepath.endswith(".xlsx"):
        df = pd.read_excel(filepath, engine="openpyxl")

    elif filepath.endswith(".xls"):
        df = pd.read_excel(filepath, engine="xlrd")

    elif filepath.endswith(".csv"):
        df = pd.read_csv(filepath)

    else:
        raise Exception("Unsupported spreadsheet format.")

    return df.to_string(index=False)
