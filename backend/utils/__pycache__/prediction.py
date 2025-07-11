o
    �N�g�  �                   @   s:   d dl Zd dlmZ d dlZe�d�d �� Zdd� Z	dS )�    N)�
load_modelzbalanced_patient_data.csvZdiseasec                 C   sF   t | �}|�|||d��}tt�|d � }t�|d �d }||fS )zE
    Load the model and make predictions for the given features.
    )�mfcc�chroma�mel_specr   �d   )r   �predict�DISEASE_CLASSES�np�argmax�max)Z
model_pathr   r   r   �modelZ
prediction�predicted_class�
confidence� r   �^C:\Users\bhoya\Documents\repo\RespiratoryDiseaseDetection\RespireX\backend\utils\prediction.py�predict_disease   s   �r   )
�numpyr	   Ztensorflow.keras.modelsr   Zpandas�pdZread_csv�tolistr   r   r   r   r   r   �<module>   s
    