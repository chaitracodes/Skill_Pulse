"""
SkillPulse Main API Router

This module is the entry point for the FastAPI application. It defines endpoints
for resume analysis, market trend synthesis, live tech news fetching, and
AI what-if career simulations.
"""

import time
import urllib.request
import xml.etree.ElementTree as ET
import random
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

from resume_module import extract_text_from_pdf, extract_text_from_txt, extract_projects
from ai_module import extract_skills_from_resume, recommend_roles, map_job_to_skills, simulate_scenario
from trend_module import fetch_skill_trends, process_trends_matrix, to_ohlc, TIMEFRAME_MAP
from market_module import generate_signals

class WhatIfRequest(BaseModel):
    scenario: str
    role: str

# Load environment variables
load_dotenv()

app = FastAPI(title="SkillPulse Analytics API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for production flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Simple in-memory cache ──────────────────────────────────────────────────
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

# ── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "SkillPulse Analytics API (Full-Stack Pipeline)"}


@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Parses resume (PDF or TXT), extracts skills, recommends roles via Groq, 
    and returns a stock-market-like skill demand analysis.
    """
    filename = (file.filename or "").lower()
    content_type = (file.content_type or "").lower()

    # Detect file type from name OR content-type header
    is_pdf = filename.endswith(".pdf") or "pdf" in content_type
    is_txt = filename.endswith(".txt") or "text/plain" in content_type

    if not (is_pdf or is_txt):
        raise HTTPException(
            status_code=400,
            detail="Only PDF (.pdf) and plain text (.txt) files are supported. Please upload one of these formats."
        )
        
    try:
        content_bytes = await file.read()
        
        # 1. Resume Parsing Pipeline based on type
        if is_pdf:
            text = extract_text_from_pdf(content_bytes)
        else:
            text = extract_text_from_txt(content_bytes)

        if not text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract text from your file. If it's a PDF, it may be image-based (scanned). Please try a text-based PDF or a .txt file."
            )

        projects_text = extract_projects(text)
        
        # Extract Skills via AI
        skills = extract_skills_from_resume(text)
        if not skills:
            # Fallback: parse obvious keywords from text manually
            skills = []
        
        # Recommend Roles — always get at least a fallback
        recommended_roles = recommend_roles(skills, projects_text)
        if not recommended_roles:
            recommended_roles = [{"role": "Software Engineer", "reason": "General software development background detected."}]
        
        # Default to the top recommended role for market analysis
        target_role = recommended_roles[0]["role"]
            
        # 2. Map Job to Core Skills (max 3) — with fallback
        try:
            job_skills_data = map_job_to_skills(target_role)
            target_skills = job_skills_data.get("skills", [])[:3]
        except Exception:
            target_skills = []
        if not target_skills:
            target_skills = ["Python", "SQL", "Machine Learning"]
        
        # 3. Trend Synthesis — with fallback (non-fatal)
        try:
            df_trends = fetch_skill_trends(target_skills)
            trend_info = process_trends_matrix(df_trends, target_skills)
        except Exception as e:
            print(f"Trend fetch failed (non-fatal): {e}")
            trend_info = {"shape": [0, 0], "matrix": [], "dates": [], "skills": target_skills}
        
        # 4. Market Signals — with fallback
        try:
            signals = generate_signals(trend_info)
        except Exception:
            signals = []
        
        # 5. Final Output Structure
        return {
            "resume_data": {
                "skills": skills,
                "projects": projects_text,
                "recommended_roles": recommended_roles
            },
            "market_analysis": {
                "job": target_role,
                "skills": target_skills,
                "trend_matrix": {
                    "shape": trend_info.get("shape", []),
                    "matrix": trend_info.get("matrix", [])
                },
                "signals": signals
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Server Error in analyze_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Resume processing failed: {str(e)}")


@app.get("/api/trends")
def get_trends(
    skill: str = Query(..., description="Skill name e.g. Python, Rust, TypeScript"),
    timeframe: str = Query("1M", description="1D | 1W | 1M | 3M | 1Y | ALL"),
):
    """
    Returns OHLC candle data derived from Google Trends interest-over-time.
    (Backwards compatibility for previous endpoints)
    """
    tf = timeframe.upper()
    # Supported timeframes: 1W, 1M, 6M, 1Y, ALL
    VALID_TF = ["1W", "1M", "6M", "1Y", "ALL"]
    if tf not in VALID_TF:
        raise HTTPException(status_code=400, detail=f"Invalid timeframe. Choose from: {VALID_TF}")

    key = cache_key(skill, tf)
    cached = get_cached(key)
    if cached:
        return {"skill": skill, "timeframe": tf, "source": "cache", "candles": cached}

    try:
        df = fetch_skill_trends([skill], timeframe=tf, geo="")
        if df.empty or skill not in df.columns:
            raise HTTPException(status_code=404, detail=f"No trend data found for '{skill}'")

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
    Fetches interest-over-time for up to 5 skills simultaneously.
    (Backwards compatibility for previous endpoints)
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
        df = fetch_skill_trends(skill_list, timeframe=TIMEFRAME_MAP[tf], geo="")
        if df.empty:
            raise HTTPException(status_code=404, detail="No trend data found")

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

@app.get("/api/job-trends")
def get_job_trends(job: str = Query(..., description="Job role to analyze e.g., Data Scientist")):
    """
    Standalone endpoint to fetch skill trends for a given job role using the AI pipeline.
    """
    # 1. Map Job to Core Skills
    try:
        job_skills_data = map_job_to_skills(job)
        skills = job_skills_data.get("skills", [])
    except Exception as e:
        print(f"AI failed: {e}")
        skills = []
        
    if not skills:
        skills = [job] # Fallback
        
    # 2. Google Trends Integration
    try:
        df_trends = fetch_skill_trends(skills, timeframe="today 5-y", geo="IN")
        trend_info = process_trends_matrix(df_trends, skills)
    except Exception as e:
        print(f"Trends failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch trend data.")
        
    # 3. Output
    return {
        "job": job,
        "skills": skills,
        "trend_matrix": {
            "columns": trend_info.get("skills", []),
            "shape": trend_info.get("shape", [0, 0]),
            "matrix": trend_info.get("matrix", [])
        }
    }

@app.get("/api/news")
def get_tech_news():
    url = "https://news.google.com/rss/search?q=technology+software+development+market&hl=en-US&gl=US&ceid=US:en"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')[:6] # Get top 6 news
        
        news_list = []
        for item in items:
            title_elem = item.find('title')
            pubDate_elem = item.find('pubDate')
            source_elem = item.find('source')
            
            title = title_elem.text if title_elem is not None else "UNKNOWN TRANSMISSION"
            pubDate = pubDate_elem.text if pubDate_elem is not None else ""
            source = source_elem.text if source_elem is not None else "GLOBAL_NET"
            
            # Format title (remove source string typically appended by Google News like " - Reuters")
            display_title = title.split(" - ")[0].upper()
            
            # Format time
            try:
                # "Tue, 11 Apr 2026 14:02:55 GMT"
                dt = datetime.strptime(pubDate, "%a, %d %b %Y %H:%M:%S %Z")
                time_str = dt.strftime("%H:%M:%S UTC")
            except:
                time_str = "CURRENT_CYCLE"
                
            # Naive sentiment tracking based on words for visual purposes
            lower_title = title.lower()
            if any(w in lower_title for w in ["soar", "surge", "growth", "high", "new", "release", "launch", "bull", "rally", "moon"]):
                tag = "BULLISH"
            elif any(w in lower_title for w in ["drop", "fall", "crash", "low", "record", "void", "bear", "layoff", "fail", "slowdown"]):
                tag = "BEARISH"
            else:
                tag = "NEUTRAL"
                
            # Random stylistic labels
            possible_labels = ["TECH", "AI", "SOFTWARE", "MARKET", "SECURITY", "DATA", "MOBILE", "WEB", "INFRASTRUCTURE", "SILVER", "ROBOTICS"]
            labels = random.sample(possible_labels, 3)
            
            news_list.append({
                "source": ("SYS_" + source.upper().replace(" ", "_"))[:15],
                "time": time_str,
                "tag": tag,
                "title": display_title,
                "labels": labels
            })
            
        return {"news": news_list}
    except Exception as e:
        print(f"Error fetching news: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch tech news")

@app.post("/api/what-if")
def what_if_simulation(data: WhatIfRequest):
    """
    Evaluates a hypothetical scenario against a specific job role.
    """
    try:
        result = simulate_scenario(data.scenario, data.role)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class LearningRoadmapRequest(BaseModel):
    target_role: str
    known_skills: list[str]

@app.post("/api/learning-roadmap")
def get_learning_roadmap(data: LearningRoadmapRequest):
    """
    Evaluates known skills against a target job role and generates a missing skills roadmap.
    """
    from ai_module import generate_learning_roadmap
    try:
        result = generate_learning_roadmap(data.target_role, data.known_skills)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ProjectPlanRequest(BaseModel):
    target_role: str
    skills: list[str]

@app.post("/api/project-plan")
def get_project_plan(data: ProjectPlanRequest):
    """
    Generates a 7-day capstone project plan.
    """
    from ai_module import generate_project_plan
    try:
        result = generate_project_plan(data.target_role, data.skills)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
