from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
import pdfplumber
import os, io, json

load_dotenv(override=True)

app = FastAPI(title="AI PDF Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    return text.strip()

def analyze_with_groq(text: str) -> dict:
    prompt = f"""You are an expert AI tutor. Analyze this PDF and respond ONLY with valid JSON, no extra text.

PDF CONTENT:
{text[:4000]}

Return this exact JSON:
{{
  "summary": "2-3 sentence overview",
  "questions": [
    {{"id": 1, "question": "...", "type": "conceptual", "answer_hint": "..."}},
    {{"id": 2, "question": "...", "type": "factual", "answer_hint": "..."}},
    {{"id": 3, "question": "...", "type": "application", "answer_hint": "..."}},
    {{"id": 4, "question": "...", "type": "conceptual", "answer_hint": "..."}},
    {{"id": 5, "question": "...", "type": "factual", "answer_hint": "..."}},
    {{"id": 6, "question": "...", "type": "application", "answer_hint": "..."}},
    {{"id": 7, "question": "...", "type": "conceptual", "answer_hint": "..."}},
    {{"id": 8, "question": "...", "type": "factual", "answer_hint": "..."}}
  ],
  "notes": [
    {{"topic": "Topic Title", "points": ["point 1", "point 2", "point 3"]}},
    {{"topic": "Topic Title", "points": ["point 1", "point 2", "point 3"]}},
    {{"topic": "Topic Title", "points": ["point 1", "point 2", "point 3"]}}
  ],
  "key_terms": [
    {{"term": "Term", "definition": "definition"}},
    {{"term": "Term", "definition": "definition"}},
    {{"term": "Term", "definition": "definition"}},
    {{"term": "Term", "definition": "definition"}},
    {{"term": "Term", "definition": "definition"}}
  ]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
    )
    raw = response.choices[0].message.content.strip()
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip().rstrip("```")
    return json.loads(raw)

@app.get("/")
def root():
    return {"message": "AI PDF Tutor API is running! 🎓"}

@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")
    try:
        pdf_text = extract_text(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {str(e)}")
    if len(pdf_text) < 100:
        raise HTTPException(status_code=400, detail="PDF has too little text.")
    try:
        result = analyze_with_groq(pdf_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")
    return {"status": "success", "filename": file.filename, "data": result}