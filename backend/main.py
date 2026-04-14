from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import os
import io
import csv
import time
from datetime import datetime
from google import genai 
from typing import Optional
from dotenv import load_dotenv

# --- Step 1: Environment Security ---
# Load variables from .env file
load_dotenv()
# Get API Key from environment or fallback to your hardcoded one for now
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

app = FastAPI(title="Anvil AI Text Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Step 2: Backend Rate Limiting logic ---
# Simple in-memory storage for rate limiting (Requests per IP)
user_requests = {}

def check_rate_limit(client_ip: str):
    current_time = time.time()
    # Limit: 10 requests per minute
    if client_ip not in user_requests:
        user_requests[client_ip] = []
    
    # Filter out requests older than 60 seconds
    user_requests[client_ip] = [t for t in user_requests[client_ip] if current_time - t < 60]
    
    if len(user_requests[client_ip]) >= 10:
        return False
    
    user_requests[client_ip].append(current_time)
    return True

# --- Step 3: Updated Data Models ---
class TextInput(BaseModel):
    text: str
    tone: Optional[str] = "Balanced" # NEW: Tone Support
    length: Optional[str] = "Normal" # NEW: Length Support

class FeedbackInput(BaseModel):
    original_input: str
    generated_output: str
    user_edited_output: str  
    rating: int              
    task_type: str           

DATA_FILE = "data/training_data.json"
os.makedirs("data", exist_ok=True)
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

# --- Endpoints ---

@app.get("/api/health")
async def health_check():
    return {"status": "online", "timestamp": datetime.now().isoformat()}

@app.get("/api/export")
async def export_training_data():
    try:
        if not os.path.exists(DATA_FILE):
            raise HTTPException(status_code=404, detail="No data found to export.")
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
        if not data:
            raise HTTPException(status_code=404, detail="Dataset is empty.")
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=["timestamp", "task_type", "original_input", "generated_output", "user_edited_output", "rating"])
        writer.writeheader()
        writer.writerows(data)
        output.seek(0)
        return StreamingResponse(io.BytesIO(output.getvalue().encode()), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=anvil_ai_training_data.csv"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@app.post("/api/enhance")
async def enhance_prompt(data: TextInput, request: Request):
    # Apply Rate Limit
    if not check_rate_limit(request.client.host):
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a minute.")
        
    if not data.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        # Integrated Tone Logic into System Prompt
        system_prompt = f"""
        You are Anvil AI, a master prompt engineer. 
        TASK: Transform the user input into a professional, highly detailed prompt.
        TONE/STYLE: {data.tone}
        
        Structure the output with clear instructions, context, and desired formatting. Do not converse with the user, just output the final optimized prompt.
        
        User Input: {data.text}
        """
        response = client.models.generate_content(model='gemini-flash-latest', contents=system_prompt)
        return {"result": response.text}
    except Exception as e:
        print(f"Enhance Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Anvil AI Error: {str(e)}")

@app.post("/api/humanize")
async def humanize_text(data: TextInput, request: Request):
    # Apply Rate Limit
    if not check_rate_limit(request.client.host):
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a minute.")

    if not data.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    try:
        # Integrated Tone and Length Logic into System Prompt
        system_prompt = f"""
        You are Anvil AI. Your task is to take the following AI-generated text and rewrite it to sound completely natural, human, and conversational. 
        TONE: {data.tone}
        TARGET LENGTH: {data.length}
        
        Remove any robotic phrasing, predictable structures, or typical AI buzzwords. Add varied sentence lengths and a relatable, grounded tone.
        
        AI Text: {data.text}
        """
        response = client.models.generate_content(model='gemini-flash-latest', contents=system_prompt)
        return {"result": response.text}
    except Exception as e:
        print(f"Humanize Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Anvil AI Error: {str(e)}")

@app.post("/api/feedback")
async def collect_feedback(data: FeedbackInput):
    """
    THE ANVIL AI SELF-TRAINING ENGINE.
    Saves user feedback to build a dataset for future fine-tuning.
    """
    # FIXED: Changed .dict() to .model_dump() to satisfy Pydantic V2
    feedback_entry = data.model_dump() 
    feedback_entry["timestamp"] = datetime.now().isoformat()

    with open(DATA_FILE, "r+") as f:
        dataset = json.load(f)
        dataset.append(feedback_entry)
        f.seek(0)
        json.dump(dataset, f, indent=4)
        f.truncate()

    return {"status": "success", "message": "Feedback saved for Anvil AI training loop."}
@app.get("/api/data")
async def get_training_data():
    try:
        if not os.path.exists(DATA_FILE):
            return []
        with open(DATA_FILE, "r") as f:
            dataset = json.load(f)
            return dataset
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)