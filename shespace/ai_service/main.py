import os
import json
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load API key from environment variable
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-pro-latest")

# models = genai.list_models()
# for m in models:
#     print(f"Name: {m.name}, Description: {m.description}, Supported Methods: {m.supported_generation_methods}")

class InsightRequest(BaseModel):
    place_name: str
    ratings_summary: str
    recent_comments: List[str]


@app.post("/place-insight")
def place_insight(req: InsightRequest):
    prompt = f"""
Return STRICT JSON only with keys:
summary (2–3 supportive sentences),
tags (array of 3–6 short strings),
recommendation (1 sentence).

Context: Women-friendly STEM campus study zones app.
Tone: supportive, not alarmist.
Rule: Do NOT claim absolute safety.

Place: {req.place_name}
Ratings summary: {req.ratings_summary}
Recent comments: {req.recent_comments}

Return ONLY valid JSON. No markdown.
""".strip()

    resp = model.generate_content(prompt)
    text = (resp.text or "").strip()

    # Remove Markdown formatting if it exists
    if text.startswith("```") and text.endswith("```"):
        text = "\n".join(text.split("\n")[1:-1])

    try:
        return json.loads(text)
    except Exception as e:
        return {"raw": text, "error": str(e)}
