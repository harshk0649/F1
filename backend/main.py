from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.prediction_service import prediction_engine

app = FastAPI(title="F1 Vision API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RacePredictionRequest(BaseModel):
    driver_name: str
    qualifying_position: int
    track: str
    previous_race_performance: int

@app.get("/")
def read_root():
    return {"message": "Welcome to F1 Vision API"}

@app.post("/predict")
def predict_race(req: RacePredictionRequest):
    predictions = prediction_engine.predict_winner(
        req.driver_name, 
        req.qualifying_position, 
        req.track, 
        req.previous_race_performance
    )
    return {"top_5_probabilities": predictions}
