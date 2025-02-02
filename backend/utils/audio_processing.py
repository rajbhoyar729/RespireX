import numpy as np
import librosa

def extract_features(audio_path):
    """
    Extract MFCC, Chroma, and Mel-spectrogram features from an audio file.
    """
    # Load the audio file
    audio_data, sample_rate = librosa.load(audio_path, sr=None)

    # Extract MFCC features
    mfcc = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=20)
    if mfcc.shape[1] < 259:
        mfcc = np.pad(mfcc, ((0, 0), (0, 259 - mfcc.shape[1])))
    else:
        mfcc = mfcc[:, :259]

    # Extract Chroma features
    chroma = librosa.feature.chroma_stft(y=audio_data, sr=sample_rate, n_chroma=12)
    if chroma.shape[1] < 259:
        chroma = np.pad(chroma, ((0, 0), (0, 259 - chroma.shape[1])))
    else:
        chroma = chroma[:, :259]

    # Extract Mel-spectrogram features
    mel_spec = librosa.feature.melspectrogram(y=audio_data, sr=sample_rate, n_mels=128)
    if mel_spec.shape[1] < 259:
        mel_spec = np.pad(mel_spec, ((0, 0), (0, 259 - mel_spec.shape[1])))
    else:
        mel_spec = mel_spec[:, :259]

    # Add batch and channel dimensions
    mfcc = np.expand_dims(np.expand_dims(mfcc, 0), -1)
    chroma = np.expand_dims(np.expand_dims(chroma, 0), -1)
    mel_spec = np.expand_dims(np.expand_dims(mel_spec, 0), -1)

    return mfcc, chroma, mel_spec