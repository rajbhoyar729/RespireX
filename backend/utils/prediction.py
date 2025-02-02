import numpy as np
from tensorflow.keras.models import load_model
import pandas as pd

# Load the disease classes
DISEASE_CLASSES = pd.read_csv('balanced_patient_data.csv')['disease'].tolist()

def predict_disease(model_path, mfcc, chroma, mel_spec):
    """
    Load the model and make predictions for the given features.
    """
    # Load the model
    model = load_model(model_path)

    # Make predictions
    prediction = model.predict({
        "mfcc": mfcc,
        "chroma": chroma,
        "mel_spec": mel_spec
    })

    # Get predicted class and confidence
    predicted_class = DISEASE_CLASSES[np.argmax(prediction[0])]
    confidence = np.max(prediction[0]) * 100

    return predicted_class, confidence