import base64 
import os 
from langchain.tools import tool 
from groq import Groq 
import config 

# Initialize client
client = Groq(api_key=config.GROQ_API_KEY)

@tool
def analyze_image_with_vision(image_path: str, user_query: str = "Describe this agriculture image."):
    """
    Role: Agricultural Vision Expert.
    Extracts visual information from an image to help the doctor agent diagnose.
    """

    # Image encoder
    def encode_image(path):
        with open(path, "rb") as image_file: # Read binary
            return base64.b64encode(image_file.read()).decode('utf-8')

    try:
        # Convert image
        base64_image = encode_image(image_path)
        
        # API request
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", # Text query
                            "text": f"Analyze this crop/field image. Detail the symptoms, pests, or seed labels. User Query: {user_query}"
                        },
                        {
                            "type": "image_url", # Image data
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                }
            ],

            model=config.VISION_MODEL, # Vision model
            temperature=0.1, # Accuracy focus
            max_tokens=300 # Word limit
        )

        # Return content
        return chat_completion.choices[0].message.content
    
    except Exception as e:
        # Handle error
        return f"Vision processing failed: {str(e)}"