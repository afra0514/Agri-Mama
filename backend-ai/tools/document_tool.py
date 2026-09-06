import pymupdf as fitz
from langchain.tools import tool

@tool
def analyze_document_text(file_path: str):
    """
    Extracts and analyzes text from user-uploaded PDF documents. 
    Use this for research papers, govt policies, or manuals.
    """

    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc[:5]:
            text += page.get_text()   
        doc.close()
        
        if not text.strip():
            return "The PDF seems to be empty or contains only images. Try using the Vision Tool."
        return text[:4000] 
        
    except Exception as e:
        return f"Error reading PDF: {str(e)}"