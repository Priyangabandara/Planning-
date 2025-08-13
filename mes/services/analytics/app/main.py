from fastapi import FastAPI
from .analytics import TargetRequest, OeeRequest, LineEfficiencyRequest, compute_target_units, compute_oee, compute_line_efficiency

app = FastAPI(title="MES Analytics Service")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "analytics"}

@app.post("/compute/targets")
async def compute_targets(req: TargetRequest):
    target = compute_target_units(req.smv, req.qty)
    return {"targetUnits": target}

@app.post("/compute/oee")
async def compute_oee_endpoint(req: OeeRequest):
    return {"oee": compute_oee(req.availability, req.performance, req.quality)}

@app.post("/compute/line_efficiency")
async def compute_line_efficiency_endpoint(req: LineEfficiencyRequest):
    return {"efficiency": compute_line_efficiency(req.target, req.actual)}