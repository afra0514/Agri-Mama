import config
import os
import shutil
from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from agents.supervisor import AgriSupervisor

app = FastAPI(title="Agri Mama")

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

llm = ChatGroq(
    model_name=config.LLM_MODEL,
    groq_api_key=config.GROQ_API_KEY,
    temperature=0.3
)

supervisor = AgriSupervisor(llm)

@app.post("/chat")
async def chat(
    message: str = Form(""),
    file: UploadFile = File(None),
    google_search_enabled: str = Form("false")
):
    final_input = message
    
    if file:
        file_path = os.path.join(config.UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        ext = file.filename.split(".")[-1].lower()
        
        if ext in ["mp3", "wav", "m4a"]:
            from tools.voice_tool import transcribe_voice
            voice_text = transcribe_voice.invoke(file_path) # .invoke() usage
            final_input = f"[User Voice Input: {voice_text}] {message}"
            
        elif ext in ["jpg", "jpeg", "png"]:
            from tools.vision_tool import analyze_image_with_vision
            vis_desc = analyze_image_with_vision.invoke({
                "image_path": file_path, 
                "user_query": message
            })
            final_input = f"[image analysis] Content: {vis_desc}. Question: {message}"
            
        elif ext == "pdf":
            from tools.document_tool import analyze_document_text
            doc_data = analyze_document_text.invoke(file_path) # .invoke() usage
            final_input = f"[document analysis] Data: {doc_data}. Question: {message}"
        
        if os.path.exists(file_path):
            os.remove(file_path)

    if google_search_enabled.lower() == "true":
        final_input = f"[enable_google_grounding] {final_input}"
    reply = await supervisor.run(final_input) 
    return {"reply": reply}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)