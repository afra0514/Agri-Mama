from constants.keywords.routing_keywords import SCHOLAR_KEYWORDS, POLICY_KEYWORDS, VISION_MARKET_KEYWORDS, TAGS # Keyword imports

class AgriSupervisor: # Supervisor class
    def __init__(self, llm):
        # Load agents
        from agents.farmer_agent import get_farmer_agent
        from agents.scholar_agent import get_scholar_agent
        from agents.vision_market_agent import get_vision_market_agent
        from agents.policy_agent import get_policy_agent 
        from agents.evaluator_agent import get_evaluator_agent 
        
        # Init components
        self.llm = llm
        self.farmer = get_farmer_agent(llm)
        self.scholar = get_scholar_agent(llm)
        self.vision = get_vision_market_agent(llm)
        self.policy = get_policy_agent(llm) 
        self.evaluator = get_evaluator_agent(llm)

    async def run(self, user_input): # Main logic
        query = user_input.lower() # Normalize input
        raw_output = ""

        # Grounding check
        if TAGS["GROUNDING"] in query:
            from ground_search.search_engine import google_grounded_response
            clean_query = user_input.replace(TAGS["GROUNDING"], "").strip()
            raw_output = google_grounded_response(self.llm, clean_query) # Web search
        
        else:
            # Tag routing
            if TAGS["IMAGE"] in query:
                agent = self.vision
            elif TAGS["DOCUMENT"] in query:
                agent = self.scholar
            
            # Keyword routing
            elif any(w in query for w in SCHOLAR_KEYWORDS):
                agent = self.scholar
            elif any(w in query for w in POLICY_KEYWORDS):
                agent = self.policy
            elif any(w in query for w in VISION_MARKET_KEYWORDS):
                agent = self.vision
            
            else:
                agent = self.farmer # Default agent
            
            # Invoke agent
            response = agent.invoke({"input": user_input})
            raw_output = response.get("output")

        # Polish response
        final_polished_response = self.evaluator.invoke({"original_response": raw_output})
        
        return final_polished_response # Final output