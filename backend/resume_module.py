import fitz  # PyMuPDF
import re

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extracts all text from a given PDF byte stream.
    """
    text = ""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_projects(text: str) -> str:
    """
    Extract text under "Projects" section
    Stop extraction at "Education", "Skills", "Experience", etc.
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
