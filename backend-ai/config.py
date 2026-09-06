import os 
from dotenv import load_dotenv
os.environ["ANONYMIZED_TELEMETRY"] = "False" 
load_dotenv() # Load variables

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
SERPER_API_KEY = os.getenv("SERPER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# LangSmith tracing
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["LANGCHAIN_PROJECT"] = "AgriMama"

# Model names
LLM_MODEL = "openai/gpt-oss-120b"
VISION_MODEL = "qwen/qwen3.6-27b" 
VOICE_MODEL = "whisper-large-v3" 
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_DB_DIR = os.path.join(BASE_DIR, "chroma_db")
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge_base")
UPLOAD_DIR = os.path.join(BASE_DIR, "temp_uploads")

# Create directories
for folder in [CHROMA_DB_DIR, KNOWLEDGE_DIR, UPLOAD_DIR]:
    os.makedirs(folder, exist_ok=True)

# Status message
print("AgriMama Configuration Loaded Successfully.")