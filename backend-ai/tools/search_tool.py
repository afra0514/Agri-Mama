from langchain.tools import tool 
from ground_search.search_engine import get_search_results 
import config 

@tool
def grounded_search_tool(query: str):
    """
    Search the internet for real-time market prices, weather updates, and general farming news. 
    It provides verified data and source links (URLs) for Google Search Grounding. 
    Always use this tool when the user asks for 'today', 'live', 'price', or 'weather'.
    """

    # Fetch results
    context, provider = get_search_results(query)
    
    # Null check
    if not context:
        return "No real-time information was found on the internet for this query."
    
    # Return results
    return f"Information retrieved from {provider}:\n\n{context}"

@tool
def academic_search_tool(query: str):
    """
    Search for academic journals, scientific research papers, and studies for students or researchers.
    Use this specifically when the user asks for academic, formal, or scientific research-related information.
    """

    # Local import
    from langchain_community.tools.tavily_search import TavilySearchResults
    
    # Setup search
    search = TavilySearchResults(k=3, search_depth="advanced") # Limit (3)
    
    # Run search
    return search.run(f"academic journal and research paper on: {query}")