import base64
import os
from langchain.tools import tool
from groq import Groq
import config

client = Groq(api_key=config.GROQ_API_KEY)

@tool
def analyze_image_with_vision(image_path: str, user_query: str = "Describe this agriculture image."):
    """
    Role: Agricultural Vision Expert.
    Extracts visual information from an image to help the doctor agent diagnose.
    """
    def encode_image(path):
        with open(path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    try:
        base64_image = encode_image(image_path)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": f"Analyze this crop/field image. Detail the symptoms, pests, or seed labels. User Query: {user_query}"
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                }
            ],
            model=config.VISION_MODEL,
            temperature=0.1,
            max_tokens=300 
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Vision processing failed: {str(e)}"