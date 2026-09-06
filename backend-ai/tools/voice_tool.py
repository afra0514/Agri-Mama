import os
from langchain.tools import tool
from groq import Groq
import config

@tool
def transcribe_voice(file_path: str):
    """
    Transcribes audio files (wav, mp3, m4a) into text using Groq's Whisper model.
    Use this tool whenever the user uploads a voice message or provides an audio file.
    It returns the spoken text in string format.
    """

    try:
        client = Groq(api_key=config.GROQ_API_KEY)
        
        with open(file_path, "rb") as file:
             transcription = client.audio.transcriptions.create(
                file=(os.path.basename(file_path), file.read()),
                model=config.VOICE_MODEL, 
                response_format="text",
            )
             
        return transcription
        
    except Exception as e:
        print(f"Voice Transcription Error: {e}")
        return f"Could not process voice message. Error: {str(e)}"