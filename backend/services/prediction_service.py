import numpy as np
from sklearn.ensemble import RandomForestClassifier
import random

class PredictionEngine:
    def __init__(self):
        # In a real production app, we would load a model trained 
        # on historical data from Kaggle (F1 1950-2023 dataset)
        # For this vision, we'll use a pre-set weight logic that 
        # simulates a trained Random Forest
        self.drivers = [
            "Max Verstappen", "Lewis Hamilton", "Charles Leclerc", 
            "Lando Norris", "Sergio Perez", "Carlos Sainz", 
            "George Russell", "Fernando Alonso", "Oscar Piastri"
        ]

    def predict_winner(self, driver_name, qualifying_pos, track, performance_score):
        """
        Simulates an ML model prediction.
        Higher performance_score and lower qualifying_pos = higher probability.
        """
        # Base weights for different tracks (simulating track difficulty/overtaking)
        track_weights = {
            "Monaco": 1.5, # Qualifying is everything here
            "Spa": 1.1,
            "Silverstone": 1.2,
            "Monza": 1.3
        }
        
        weight = track_weights.get(track, 1.0)
        
        # Calculate simulated probability
        # Position 1 is best, Position 20 is worst
        pos_factor = (21 - qualifying_pos) * 2.5
        perf_factor = performance_score * 1.5
        
        # Combine factors
        user_driver_score = (pos_factor + perf_factor) * weight
        
        predictions = []
        for driver in self.drivers:
            if driver == driver_name:
                score = user_driver_score
            else:
                # Randomize other drivers slightly
                score = random.uniform(10, 80)
            predictions.append({"driver": driver, "score": score})
            
        # Normalize to probability
        total_score = sum(p["score"] for p in predictions)
        for p in predictions:
            p["probability"] = round((p["score"] / total_score) * 100, 1)
            del p["score"]
            
        predictions.sort(key=lambda x: x["probability"], reverse=True)
        return predictions[:5]

prediction_engine = PredictionEngine()
