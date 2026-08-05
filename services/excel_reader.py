import pandas as pd

def read_excel(filepath):

    try:
        if filepath.lower().endswith(".xlsx"):
            df = pd.read_excel(filepath, engine="openpyxl")

        elif filepath.lower().endswith(".xls"):
            df = pd.read_excel(filepath, engine="xlrd")

        elif filepath.lower().endswith(".csv"):
            df = pd.read_csv(filepath)

        else:
            raise Exception("Unsupported spreadsheet format.")

        return df.to_string(index=False)

    except Exception as e:
        raise Exception(f"Unable to read spreadsheet: {e}")
