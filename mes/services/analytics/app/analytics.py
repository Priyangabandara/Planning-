from pydantic import BaseModel

class TargetRequest(BaseModel):
    smv: float
    qty: float

class OeeRequest(BaseModel):
    availability: float
    performance: float
    quality: float

class LineEfficiencyRequest(BaseModel):
    target: float
    actual: float

def compute_target_units(smv: float, qty: float) -> float:
    # Simplistic: target units = qty (for the order), or you could do time-based target
    # Here we do: targetUnits = qty, but allow smv to influence via rate
    return max(qty, 0)

def compute_oee(a: float, p: float, q: float) -> float:
    return max(min(a,1.0),0.0) * max(min(p,1.0),0.0) * max(min(q,1.0),0.0)

def compute_line_efficiency(target: float, actual: float) -> float:
    if target <= 0:
        return 0.0
    return actual / target