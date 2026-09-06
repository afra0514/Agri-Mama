from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools.search_tool import grounded_search_tool as internet_search_tool 
from constants.prompts.vision_prompt import VISION_PROMPT

def get_vision_market_agent(llm):
    prompt = ChatPromptTemplate.from_messages([
        ("system", VISION_PROMPT),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])

    tools = [internet_search_tool]
    agent = create_tool_calling_agent(llm, tools, prompt)
    
    return AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)