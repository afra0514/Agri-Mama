from langchain.tools import tool
from vector_db.retrieval import search_knowledge

@tool
def agri_knowledge_tool(query: str):
    """Consult this tool for farming advice, crop diseases, and agri-policies from documents."""
    
    return search_knowledge(query, k=2)