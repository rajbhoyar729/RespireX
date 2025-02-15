from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
from utils.audio_processing import extract_features
from utils.prediction import predict_disease

app = FastAPI()

# Path to the trained model
MODEL_PATH = os.path.join(os.getcwd(), "model", "rd.h5")

@app.post("/predict/")
async def predict(audio_file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        file_location = f"temp_{audio_file.filename}"
        print(file_location)    
        with open(file_location, "wb+") as file_object:
            print("stage 2")
            file_object.write(audio_file.file.read())

        # Extract features
        print("stage 3")
        mfcc, chroma, mel_spec = extract_features(file_location)

        # Predict disease
        predicted_class, confidence = predict_disease(MODEL_PATH, mfcc, chroma, mel_spec)

        # Clean up temporary file
        os.remove(file_location)

        return JSONResponse(content={
            "predictedClass": predicted_class,
            "confidence": confidence
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})