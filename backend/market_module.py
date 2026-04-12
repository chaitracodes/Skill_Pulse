"""
Market Module for SkillPulse

This module processes processed skill trend data and assigns market
indicators (BUY/SELL/HOLD) based on growth thresholds to simulate a 
financial market environment for technical skills.
"""

import numpy as np

def generate_signals(trend_info: dict, threshold: float = 0.1) -> list:
    """
    Computes market metrics for each skill in the trend matrix and assigns BUY/SELL/HOLD.
    
    This function analyzes the latest data points from Google Trends interest-over-time 
    data to simulate stock market-like momentum for a specific tech skill. 
    A skill is deemed bullish ('BUY') if its growth rate over the period exceeds 
    the given threshold.

    Args:
        trend_info (dict): The processed trend matrix payload.
            Expected structure: {"matrix": [[...], ...], "skills": ["skill1", ...], "dates": [...]}
        threshold (float): The minimum percentage growth rate required to trigger 
            a BUY or SELL signal. Default is 0.1 (10%).

    Returns:
        list: A list of dicts, each documenting the market signals for a skill:
            [{"skill": "str", "action": "BUY|SELL|HOLD", "growth_rate": float, ...}]
    """
    matrix = trend_info.get("matrix", [])
    skills = trend_info.get("skills", [])
    
    if not matrix or not skills:
        return []
        
    np_matrix = np.array(matrix)
    signals = []
    
    for i, skill in enumerate(skills):
        skill_data = np_matrix[:, i]
        
        if len(skill_data) == 0:
            continue
            
        first_val = skill_data[0]
        last_val = skill_data[-1]
        avg_score = float(np.mean(skill_data))
        volatility = float(np.std(skill_data))
        
        # Calculate growth rate (prevent division by zero)
        if first_val > 0:
            growth_rate = (last_val - first_val) / first_val
        else:
            growth_rate = last_val - first_val
            
        # Signal Generation
        if growth_rate > threshold:
            action = "BUY"
        elif growth_rate < -threshold:
            action = "SELL"
        else:
            action = "HOLD"
            
        signals.append({
            "skill": skill,
            "action": action,
            "growth_rate": round(float(growth_rate), 4),
            "volatility": round(float(volatility), 4),
            "average_demand": round(float(avg_score), 2),
            "current_demand": int(last_val)
        })
        
    return signals
