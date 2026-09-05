import os
import config
from constants.prompts.engine_prompt import ENGINE_PROMPT
from langchain_community.utilities import GoogleSerperAPIWrapper
from langchain_community.tools.tavily_search import TavilySearchResults

def get_search_results(query: str):
    """Searches via Google (Serper) and falls back to Tavily if unsuccessful."""
    try:
        search_query = f"{query} current status news forecast"
        search = GoogleSerperAPIWrapper(serper_api_key=config.SERPER_API_KEY)
        search_data = search.results(search_query)
        
        if search_data.get("organic"):
            context = ""
            for item in search_data["organic"][:4]: 
                context += f"Title: {item.get('title')}\n"
                context += f"Snippet: {item.get('snippet')}\n"
                context += f"Link: {item.get('link')}\n\n"
            return context, "Google Search (Serper)"
    except Exception as e:
        print(f"Serper failed: {e}")

    try:
        tavily = TavilySearchResults(k=3)
        results = tavily.run(query)
        return str(results), "Tavily AI"
    except Exception as e:
        return None, None

def google_grounded_response(llm, query: str):
    """Provides a grounded answer based on search results with mandatory citations."""
    search_context, provider = get_search_results(query)
    
    if not search_context:
        return "I'm sorry Mama, I couldn't find any live information from the internet at the moment."

    final_prompt = ENGINE_PROMPT.format(
        provider=provider,
        search_context=search_context,
        query=query
    )
    
    response = llm.invoke(final_prompt)
    return f"{response.content}\n\n*[Verified via {provider}]*"