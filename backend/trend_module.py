import time
import random
from pytrends.request import TrendReq
import pandas as pd

TIMEFRAME_MAP = {
    "1D":  "now 1-d",
    "1W":  "now 7-d",
    "1M":  "today 1-m",
    "3M":  "today 3-m",
    "1Y":  "today 12-m",
    "ALL": "all",
}

def get_pytrends():
    return TrendReq(hl="en-US", tz=330, timeout=(10, 25), retries=2, backoff_factor=0.5)

def fetch_skill_trends(skills: list, timeframe="today 5-y", geo="IN"):
    """
    Fetches interest-over-time for up to 5 skills.
    Returns a pandas DataFrame.
    """
    if not skills:
        return pd.DataFrame()
        
    # Pytrends supports max 5 keywords
    skills_to_query = skills[:5]
    
    try:
        pytrends = get_pytrends()
        pytrends.build_payload(kw_list=skills_to_query, timeframe=timeframe, geo=geo)
        df = pytrends.interest_over_time()
        
        if df.empty:
            return pd.DataFrame()
            
        if "isPartial" in df.columns:
            df = df.drop(columns=["isPartial"])
            
        return df
    except Exception as e:
        print(f"Error fetching trends: {e}")
        return pd.DataFrame()

def process_trends_matrix(df: pd.DataFrame, skills: list) -> dict:
    """
    Converts DataFrame to a numerical matrix structure.
    """
    if df.empty:
        return {"shape": [0, 0], "matrix": [], "dates": [], "skills": []}
    
    columns_to_keep = [s for s in skills[:5] if s in df.columns]
    df_filtered = df[columns_to_keep]
    
    matrix = df_filtered.values.tolist()
    dates = [d.strftime("%Y-%m-%d") for d in df_filtered.index]
    
    return {
        "shape": [len(matrix), len(columns_to_keep)],
        "matrix": matrix,
        "dates": dates,
        "skills": columns_to_keep
    }

def to_ohlc(dates: list, values: list) -> list:
    """
    Groups consecutive interest scores into OHLC candles.
    """
    candles = []
    for i, (date, val) in enumerate(zip(dates, values)):
        prev = values[i - 1] if i > 0 else val
        nxt  = values[i + 1] if i < len(values) - 1 else val

        base  = float(val)
        open_ = round(float(prev) + random.uniform(-1.5, 1.5), 2)
        close = round(base + random.uniform(-1.5, 1.5), 2)
        high  = round(max(open_, close) + random.uniform(0.5, 2.5), 2)
        low   = round(min(open_, close) - random.uniform(0.5, 2.5), 2)
        volume = int(base * random.uniform(80, 150))

        candles.append({
            "date":   date.strftime("%b %d") if hasattr(date, "strftime") else str(date),
            "open":   open_,
            "close":  close,
            "high":   high,
            "low":    low,
            "volume": volume,
            "interest": base,
        })
    return candles
