import os
import config
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from vector_db.process import create_vector_db
os.environ["ANONYMIZED_TELEMETRY"] = "False"

embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)

def initialize_smart_db():
    db_exists = os.path.exists(config.CHROMA_DB_DIR) and len(os.listdir(config.CHROMA_DB_DIR)) > 0
    
    if db_exists:
        print("Loading existing Vector Database...")
        return Chroma(persist_directory=config.CHROMA_DB_DIR, embedding_function=embeddings)
    else:
        print("No database found. Starting automatic processing...")
        return create_vector_db()

vector_db = initialize_smart_db()

def search_knowledge(query: str, k=2):
    if vector_db:
        docs = vector_db.similarity_search(query, k=k)
        return "\n\n".join([doc.page_content for doc in docs])
    return "No knowledge base available."