from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from engine import WordlistEngine
from fastapi.middleware.cors import CORSMiddleware
import math
import zxcvbn

app = FastAPI(title="Smart Wordlist API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInfo(BaseModel):
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    nickname: Optional[str] = ""
    birthdate: Optional[str] = ""
    favorite_numbers: List[str] = []
    pet_name: Optional[str] = ""
    email_username: Optional[str] = ""
    common_words: List[str] = []

engine = WordlistEngine()

def calculate_entropy(password: str) -> float:
    if not password:
        return 0
    charset_size = 0
    if any(c.islower() for c in password): charset_size += 26
    if any(c.isupper() for c in password): charset_size += 26
    if any(c.isdigit() for c in password): charset_size += 10
    if any(not c.isalnum() for c in password): charset_size += 32
    
    return len(password) * math.log2(charset_size) if charset_size > 0 else 0

@app.post("/generate")
async def generate_wordlist(info: UserInfo):
    words = engine.get_wordlist(info.dict())
    return {"count": len(words), "wordlist": words}

@app.post("/audit")
async def audit_password(password: str):
    results = zxcvbn.zxcvbn(password)
    entropy = calculate_entropy(password)
    
    return {
        "password": password,
        "score": results['score'], # 0 to 4
        "entropy": round(entropy, 2),
        "crack_times": results['crack_times_display'],
        "suggestions": results['feedback']['suggestions'],
        "warning": results['feedback']['warning']
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
