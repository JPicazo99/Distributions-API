# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from utils import generate_distribution

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class DistributionRequest(BaseModel):
    type: str
    params: dict
    size: int

@app.post("/generate")
def generate(data: DistributionRequest):
    try:
        values = generate_distribution(data.type, data.params, data.size)
        return {"values": values}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
