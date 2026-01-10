import os
import json
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

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

    try:
        return json.loads(text)
    except Exception:
        return {"raw": text}
