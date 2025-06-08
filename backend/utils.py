# backend/utils.py
import numpy as np

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
