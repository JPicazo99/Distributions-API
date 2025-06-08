from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI()

class DistributionRequest(BaseModel):
    type: str
    params: dict
    size: int

@app.post("/generate")
def generate(data: DistributionRequest):
    try:
        return {"values": generate_distribution(data.type, data.params, data.size)}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

def generate_distribution(name: str, params: dict, size: int):
    if name == "binomial":
        return np.random.binomial(params["n"], params["p"], size).tolist()
    elif name == "exponential":
        return np.random.exponential(params["scale"], size).tolist()
    elif name == "poisson":
        return np.random.poisson(params["lam"], size).tolist()
    elif name == "bernoulli":
        return np.random.binomial(1, params["p"], size).tolist()
    elif name == "multinomial":
        return np.random.multinomial(params["n"], params["pvals"], size).tolist()
    elif name == "geometric":
        return np.random.geometric(params["p"], size).tolist()
    elif name == "hypergeometric":
        return np.random.hypergeometric(params["ngood"], params["nbad"], params["nsample"], size).tolist()
    elif name == "uniform":
        return np.random.uniform(params["low"], params["high"], size).tolist()
    else:
        raise ValueError("Distribución no soportada.")
