import easyocr
from langchain.tools import tool
reader = easyocr.Reader(['bn', 'en']) 

@tool
def extract_text_from_image(file_path: str):
    """
    Extracts Bengali and English text from images using EasyOCR. 
    Use this for reading seed packets, pesticide labels, or handwritten notes.
    """

    try:
        result = reader.readtext(file_path, detail=0)
        return " ".join(result)
    
    except Exception as e:
        return f"OCR Error: {str(e)}"