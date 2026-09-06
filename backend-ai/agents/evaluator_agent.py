from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from constants.prompts.evaluator_prompt import EVALUATOR_PROMPT

def get_evaluator_agent(llm):
    prompt = ChatPromptTemplate.from_messages([
        ("system", EVALUATOR_PROMPT),
        ("human", "Original Response: {original_response}")
    ])
    
    return prompt | llm | StrOutputParser()