"""
Resume Parser Module for SkillPulse

This module provides utility functions to extract text from byte streams
of PDF or TXT files. It relies on PyMuPDF (fitz) for reliable PDF parsing,
and standard regex for extracting specific standard sections like "Projects".
"""

import fitz  # PyMuPDF
import re

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts complete raw text from a given PDF byte stream.

    Args:
        pdf_bytes (bytes): The raw byte content of the uploaded PDF file.

    Returns:
        str: The full extracted text string. Returns empty string if parsing fails.
    """
    text = ""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_text_from_txt(txt_bytes: bytes) -> str:
    """
    Extracts text from a plain text byte stream, attempting UTF-8 and Latin-1 encodings.

    Args:
        txt_bytes (bytes): The raw byte content of the uploaded TXT file.

    Returns:
        str: Decoded text string. Returns empty string if decoding fails.
    """
    try:
        return txt_bytes.decode('utf-8')
    except UnicodeDecodeError:
        try:
            return txt_bytes.decode('latin-1')
        except Exception as e:
            print(f"Error reading TXT: {e}")
            return ""
    except Exception as e:
        print(f"Error reading TXT: {e}")
        return ""

def extract_projects(text: str) -> str:
    """
    Extracts the block of text specifically located under a "Projects" heading.
    
    Uses common regex heuristics to find the start of the Projects section and
    halts extraction when it encounters a different common section header 
    like "Education", "Skills", or "Experience".

    Args:
        text (str): The full parsed text from a resume.

    Returns:
        str: Extracted substring containing the projects description.
    """
    # Simple heuristic to find the start of the Projects section
    match = re.search(r'(?i)\n\s*(projects?)\s*\n', text)
    if not match:
        match = re.search(r'(?i)^(projects?)[\s:-]*\n', text)
        
    if not match:
        return "No explicit projects section found in text."
        
    start_idx = match.end()
    
    # Search for the start of the next common section
    next_section_pattern = re.compile(r'(?i)\n\s*(education|skills|experience|certifications|languages?|awards?)[\s:-]*\n')
    
    end_match = next_section_pattern.search(text, start_idx)
    if end_match:
        end_idx = end_match.start()
        return text[start_idx:end_idx].strip()
    else:
        return text[start_idx:].strip()
