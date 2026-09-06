import os 
import config 
from langchain_community.document_loaders import PyPDFDirectoryLoader 
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_huggingface import HuggingFaceEmbeddings 
from langchain_chroma import Chroma 

# Database logic
def create_vector_db():
    # Load embeddings
    embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)
    
    print("Creating new Vector Database from PDFs...")
    loader = PyPDFDirectoryLoader(config.KNOWLEDGE_DIR)
    # Load docs
    docs = loader.load()
    
    # Check documents
    if not docs:
        print("Warning: No PDF files found in knowledge_base!")
        return None

    # Text splitter
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200) # Size & Overlap
    # Split text
    splits = splitter.split_documents(docs)
    
    # Save to Chroma
    db = Chroma.from_documents(
        documents=splits, 
        embedding=embeddings, 
        persist_directory=config.CHROMA_DB_DIR
    )
    
    # Success message
    print(f"Vector Database created with {len(splits)} chunks!")
    return db