import pandas as pd

def read_excel(filepath):

    with open(filepath, "rb") as f:
        header = f.read(16)

    print("=" * 60)
    print("HEADER:", header)
    print("=" * 60)

    if filepath.lower().endswith(".xlsx"):
        df = pd.read_excel(filepath, engine="openpyxl")

    elif filepath.lower().endswith(".xls"):
        df = pd.read_excel(filepath, engine="xlrd")

    elif filepath.lower().endswith(".csv"):
        df = pd.read_csv(filepath)

    else:
        raise Exception("Unsupported spreadsheet.")

    return df.to_string(index=False)
