from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from constants.prompts.evaluator_prompt import EVALUATOR_PROMPT

# Create evaluator
def get_evaluator_agent(llm):
    # Define prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", EVALUATOR_PROMPT),
        ("human", "Original Response: {original_response}")
    ])
    
    # Return chain
    return prompt | llm | StrOutputParser()