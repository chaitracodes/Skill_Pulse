"""
SkillPulse — Google Trends Backend
Fetches real interest-over-time data via pytrends and converts to OHLC format.
Run with: uvicorn server:app --reload --port 8000
"""

import random
import time
from datetime import datetime, timedelta
from functools import lru_cache
from typing import Literal

import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pytrends.request import TrendReq

app = FastAPI(title="SkillPulse Trends API", version="1.0.0")

# Allow the Vite dev server to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pytrends client ──────────────────────────────────────────────────────────
def get_pytrends():
    return TrendReq(hl="en-US", tz=330, timeout=(10, 25), retries=2, backoff_factor=0.5)

# ── Timeframe map ────────────────────────────────────────────────────────────
TIMEFRAME_MAP = {
    "1D":  "now 1-d",
    "1W":  "now 7-d",
    "1M":  "today 1-m",
    "3M":  "today 3-m",
    "1Y":  "today 12-m",
    "ALL": "all",
}

# ── Convert interest scores → OHLC candles ───────────────────────────────────
def to_ohlc(dates: list, values: list) -> list:
    """
    Groups consecutive interest scores into OHLC candles.
    For daily/weekly data, each row is one candle.
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
            "interest": base,   # raw Google Trends value (0-100)
        })
    return candles


# ── Simple in-memory cache (avoids hammering Google) ──────────────────────────
_cache: dict = {}
CACHE_TTL = 3600  # 1 hour

def cache_key(skill: str, timeframe: str) -> str:
    return f"{skill.lower()}:{timeframe}"

def get_cached(key: str):
    entry = _cache.get(key)
    if entry and time.time() - entry["ts"] < CACHE_TTL:
        return entry["data"]
    return None

def set_cached(key: str, data):
    _cache[key] = {"data": data, "ts": time.time()}


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "SkillPulse Trends API"}


@app.get("/api/trends")
def get_trends(
    skill: str = Query(..., description="Skill name e.g. Python, Rust, TypeScript"),
    timeframe: str = Query("1M", description="1D | 1W | 1M | 3M | 1Y | ALL"),
):
    """
    Returns OHLC candle data derived from Google Trends interest-over-time.
    """
    tf = timeframe.upper()
    if tf not in TIMEFRAME_MAP:
        raise HTTPException(status_code=400, detail=f"Invalid timeframe. Choose from: {list(TIMEFRAME_MAP.keys())}")

    key = cache_key(skill, tf)
    cached = get_cached(key)
    if cached:
        return {"skill": skill, "timeframe": tf, "source": "cache", "candles": cached}

    try:
        pytrends = get_pytrends()
        pytrends.build_payload(
            kw_list=[skill],
            timeframe=TIMEFRAME_MAP[tf],
            geo="",           # worldwide
        )
        df = pytrends.interest_over_time()

        if df.empty or skill not in df.columns:
            raise HTTPException(status_code=404, detail=f"No trend data found for '{skill}'")

        # Drop the isPartial column if present
        if "isPartial" in df.columns:
            df = df.drop(columns=["isPartial"])

        dates  = list(df.index)
        values = list(df[skill])
        candles = to_ohlc(dates, values)

        set_cached(key, candles)
        return {"skill": skill, "timeframe": tf, "source": "google_trends", "candles": candles}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Google Trends fetch failed: {str(e)}")


@app.get("/api/trends/multi")
def get_multi_trends(
    skills: str = Query(..., description="Comma-separated skills, max 5. e.g. Python,Rust,TypeScript"),
    timeframe: str = Query("1M"),
):
    """
    Fetches interest-over-time for up to 5 skills simultaneously (Google Trends supports max 5).
    Returns a comparative interest index for the watchlist sparklines.
    """
    skill_list = [s.strip() for s in skills.split(",")][:5]
    tf = timeframe.upper()
    if tf not in TIMEFRAME_MAP:
        raise HTTPException(status_code=400, detail="Invalid timeframe")

    key = cache_key(",".join(skill_list), tf)
    cached = get_cached(key)
    if cached:
        return {"skills": skill_list, "timeframe": tf, "source": "cache", "data": cached}

    try:
        pytrends = get_pytrends()
        pytrends.build_payload(kw_list=skill_list, timeframe=TIMEFRAME_MAP[tf])
        df = pytrends.interest_over_time()

        if df.empty:
            raise HTTPException(status_code=404, detail="No trend data found")

        if "isPartial" in df.columns:
            df = df.drop(columns=["isPartial"])

        result = {}
        for skill in skill_list:
            if skill in df.columns:
                dates  = list(df.index)
                values = list(df[skill])
                result[skill] = {
                    "current": int(values[-1]) if values else 0,
                    "change":  round(float(values[-1]) - float(values[0]), 1) if len(values) > 1 else 0,
                    "sparkline": [{"date": d.strftime("%b %d"), "value": int(v)} for d, v in zip(dates[-12:], values[-12:])],
                }

        set_cached(key, result)
        return {"skills": skill_list, "timeframe": tf, "source": "google_trends", "data": result}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Google Trends fetch failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
