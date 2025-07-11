o
    D�g  �                   @   s   d dl Zd dlZdd� ZdS )�    Nc                 C   sT  t j| dd�\}}t jj||dd�}|jd dk r)t�|ddd|jd  ff�}n
|dd�dd�f }t jj||d	d
�}|jd dk rSt�|ddd|jd  ff�}n
|dd�dd�f }t jj||dd�}|jd dk r}t�|ddd|jd  ff�}n
|dd�dd�f }t�	t�	|d�d�}t�	t�	|d�d�}t�	t�	|d�d�}|||fS )zP
    Extract MFCC, Chroma, and Mel-spectrogram features from an audio file.
    N)�sr�   )�yr   Zn_mfcc�   i  )r   r   r   �   )r   r   Zn_chroma�   )r   r   Zn_mels�����)
�librosa�loadZfeature�mfcc�shape�np�padZchroma_stftZmelspectrogramZexpand_dims)Z
audio_pathZ
audio_dataZsample_rater   �chroma�mel_spec� r   �dC:\Users\bhoya\Documents\repo\RespiratoryDiseaseDetection\RespireX\backend\utils\audio_processing.py�extract_features   s"      
r   )Znumpyr   r	   r   r   r   r   r   �<module>   s    