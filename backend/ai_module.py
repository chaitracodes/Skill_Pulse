"""
AI Module for SkillPulse

This module acts as the core interface to the Groq API (using the LLaMA 3.1 model).
It handles prompt generation, API calls, and JSON parsing for:
- Skill extraction from unstructured text.
- Job role recommendations.
- What-if scenario evaluations.
- Missing skills and roadmap generation.
"""

import os
import json
from groq import Groq

def get_groq_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)

def extract_skills_from_resume(text: str) -> list:
    """
    Extracts a list of skills from the provided resume text using Groq.
    """
    client = get_groq_client()
    if not client:
        return []
    
    prompt = f"""
    Extract all professional skills from the following resume text. 
    Return ONLY a JSON array of strings containing the skills. 
    Do not include any other text, markdown formatting, or explanation.
    
    Resume Text:
    {text[:4000]}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a specialized AI that only outputs valid JSON arrays."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
        )
        content = chat_completion.choices[0].message.content.strip()
        # Clean up in case of markdown block
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        skills = json.loads(content)
        if isinstance(skills, list):
            return skills
        return []
    except Exception as e:
        print(f"Error extracting skills: {e}")
        return []

def recommend_roles(skills: list, projects: str) -> list:
    """
    Recommends 8-10 job roles based on skills and projects.
    Returns: [{"role": "...", "reason": "..."}]
    """
    client = get_groq_client()
    if not client:
        return []
        
    prompt = f"""
    Based on the following skills and project experience, recommend 8 to 10 suitable job roles.
    
    Skills: {', '.join(skills)}
    
    Projects: {projects}
    
    Respond STRICTLY in the following JSON format, without any other text or explanation. DO NOT include any additional properties such as 'trend':
    [
      {{
        "role": "Job Role Title",
        "reason": "Brief reason based on specific skills or projects"
      }}
    ]
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a specialized AI that only outputs valid JSON arrays of objects."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
        )
        content = chat_completion.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        roles = json.loads(content)
        if isinstance(roles, list):
            return roles
        return []
    except Exception as e:
        print(f"Error recommending roles: {e}")
        return []

def map_job_to_skills(job: str) -> dict:
    """
    Converts a job into exactly 3 core skills.
    Rules: 1-2 words mostly, no sentences.
    Output: {"skills": ["Skill1", "Skill2", "Skill3"]}
    """
    client = get_groq_client()
    if not client:
        return {"skills": []}
        
    prompt = f"""
    What are the 3 most crucial, core TECHNICAL skills or tools required for the role of '{job}'?
    Provide exactly 3 specific, recognized technical skills (e.g., 'React', 'Python', 'Docker', 'AWS'). 
    Do NOT output generic/soft skills like 'Programming', 'ProblemSolving', or 'Communication'.
    Each skill must be 1 to 2 words max. No sentences.
    
    Respond EXACTLY with this JSON format, no other text:
    {{
      "skills": ["Skill1", "Skill2", "Skill3"]
    }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a specialized AI that only outputs valid JSON objects."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
        )
        content = chat_completion.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        result = json.loads(content)
        if isinstance(result, dict) and "skills" in result:
            return result
        return {"skills": []}
    except Exception as e:
        print(f"Error mapping job to skills: {e}")
        return {"skills": []}

def simulate_scenario(scenario: str, role: str) -> dict:
    """
    Evaluates the 24-month impact of a hypothetical scenario on a specific job role.
    """
    client = get_groq_client()
    if not client:
        return {"impact_percent": 0, "reason": "API Key missing"}
        
    prompt = f"""
    A user is simulating a hypothetical event: "{scenario}".
    Evaluate the 24-month economic market impact of this exact scenario on the job role: "{role}".
    Determine if demand for this role will BOOM or FALL.
    Provide a realistic percentage of impact ranging from -100 to +500 (use negative numbers for fall).
    Provide a strict 1-sentence reason for this shift.
    
    Respond EXACTLY with this JSON format, no other text:
    {{
      "impact_percent": 45,
      "reason": "Brief reason here..."
    }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a specialized AI that only outputs valid JSON objects."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
        )
        content = chat_completion.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        result = json.loads(content)
        if isinstance(result, dict) and "impact_percent" in result:
            return result
        return {"impact_percent": 0, "reason": "Failed to parse impact"}
    except Exception as e:
        print(f"Error simulating scenario: {e}")
        return {"impact_percent": 0, "reason": "AI computation failed"}

def generate_learning_roadmap(target_role: str, known_skills: list) -> dict:
    """
    Compares known skills against the target role and generates missing skills and a weekly roadmap.
    """
    client = get_groq_client()
    if not client:
        return {"matched": [], "missing": [], "recommendation": "API key missing.", "roadmap": []}
        
    prompt = f"""
    The user wants to become a '{target_role}'. They currently know: {', '.join(known_skills)}.
    Identify what key skills they already MATCH, and highly specific structural/technical skills they are MISSING to be job-ready.
    Then, create a 6-week learning roadmap heavily focused on integrating the MISSING skills.
    
    Respond EXACTLY with this JSON format:
    {{
      "matched": ["Skill1", "Skill2"],
      "missing": ["MissingSkill1", "MissingSkill2", "MissingSkill3"],
      "recommendation": "A 3-sentence concise technical recommendation on what to focus on.",
      "roadmap": [
         {{ "week": 1, "topic": "Name of Topic", "task": "What to do" }},
         {{ "week": 2, "topic": "Name of Topic", "task": "What to do" }},
         {{ "week": 3, "topic": "Name of Topic", "task": "What to do" }},
         {{ "week": 4, "topic": "Name of Topic", "task": "What to do" }},
         {{ "week": 5, "topic": "Name of Topic", "task": "What to do" }},
         {{ "week": 6, "topic": "Name of Topic", "task": "What to do" }}
      ]
    }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a specialized AI that only outputs valid JSON objects."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
        )
        content = chat_completion.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        result = json.loads(content)
        return result
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        return {"matched": [], "missing": [], "recommendation": "Failed to analyze roadmap.", "roadmap": []}

