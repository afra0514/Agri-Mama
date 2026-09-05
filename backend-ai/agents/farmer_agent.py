from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools.rag_tool import agri_knowledge_tool
from tools.search_tool import grounded_search_tool as internet_search_tool 
from constants.prompts.farmer_prompt import FARMER_PROMPT

def get_farmer_agent(llm):
    prompt = ChatPromptTemplate.from_messages([
        ("system", FARMER_PROMPT),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])
    tools = [agri_knowledge_tool, internet_search_tool]    
    agent = create_tool_calling_agent(llm, tools, prompt)
    return AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)