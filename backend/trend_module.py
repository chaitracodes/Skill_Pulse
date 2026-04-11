import time
import random
import pandas as pd
import json

TIMEFRAME_MAP = {
    "1D":  "now 1-d",
    "1W":  "now 7-d",
    "1M":  "today 1-m",
    "3M":  "today 3-m",
    "1Y":  "today 12-m",
    "ALL": "all",
}

def fetch_skill_trends(skills: list, timeframe="today 5-y", geo="IN"):
    """
    Synthesizes interest-over-time for up to 5 skills using Groq/Llama-3.1.
    Returns a pandas DataFrame matching the classic PyTrends structure.
    """
    if not skills:
        return pd.DataFrame()
        
    skills_to_query = skills[:5]
    from ai_module import get_groq_client
    
    client = get_groq_client()
    if not client:
        print("Error: Groq client missing")
        return pd.DataFrame()
        
    prompt = f"""
    You are an economic empirical data engine. Generate realistic historical market demand tracking data representing the last 60 days for these technical skills: {skills_to_query}.
    You must output exactly 60 data points (integers between 0 and 100) for EACH skill. Reflect modern trajectory (e.g., if a skill is growing, the array should slope upwards).
    
    Respond EXACTLY in this JSON format mapping each skill name exactly as typed to its 60-element integer array:
    {{
      "{skills_to_query[0]}": [55, 56, 54, 55, 56, 57, ...]
    }}
    Do not output any markdown formatting, headers, or extra text. ONLY raw JSON.
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a pure JSON data-generation machine."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
        )
        content = chat_completion.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        data = json.loads(content)
        
        # Build pandas DataFrame with dynamic dates ending today
        if not data or not isinstance(data, dict):
            return pd.DataFrame()
            
        dates = pd.date_range(end=pd.Timestamp.today(), periods=60)
        df_dict = {}
        
        for sk in skills_to_query:
            arr = data.get(sk)
            
            # Fallback if AI hallucinates casing
            if arr is None:
                for k in data.keys():
                    if k.lower() == sk.lower():
                        arr = data[k]
                        break
            
            if arr is None or not isinstance(arr, list):
                arr = [0]*60
                
            if len(arr) < 60:
                arr += [arr[-1] if len(arr) > 0 else 0] * (60 - len(arr))
            elif len(arr) > 60:
                arr = arr[:60]
            df_dict[sk] = arr
            
        df = pd.DataFrame(df_dict, index=dates)
        return df
        
    except Exception as e:
        print(f"Error fetching synthetic trends via Groq: {e}")
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
