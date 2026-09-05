import os
import config
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

def create_vector_db():
    embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)
    
    print("Creating new Vector Database from PDFs...")
    loader = PyPDFDirectoryLoader(config.KNOWLEDGE_DIR)
    docs = loader.load()
    
    if not docs:
        print("Warning: No PDF files found in knowledge_base!")
        return None

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = splitter.split_documents(docs)
    
    db = Chroma.from_documents(
        documents=splits, 
        embedding=embeddings, 
        persist_directory=config.CHROMA_DB_DIR
    )
    print(f"Vector Database created with {len(splits)} chunks!")
    return db