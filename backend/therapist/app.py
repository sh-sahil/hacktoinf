from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import whisper
import os
from groq import Groq
from dotenv import load_dotenv
import librosa
import numpy as np
import logging
import pyttsx3

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)
CORS(app)

try:
    logger.info("Loading Whisper model...")
    model = whisper.load_model("small", device="cpu")
    logger.info("Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {str(e)}")
    raise

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.error("GROQ_API_KEY not found in .env file")
    raise ValueError("GROQ_API_KEY not found in .env file")
client = Groq(api_key=GROQ_API_KEY)

# Language mapping
LANGUAGE_MAP = {
    'en': 'English',
    'hi': 'Hindi',
    'mr': 'Marathi'
}

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    language = request.form.get('language', 'en')
    if language not in LANGUAGE_MAP:
        return jsonify({'error': 'Invalid language selected'}), 400
    
    audio_path = "temp_audio.wav"
    audio_file.save(audio_path)
    logger.info(f"Saved audio to {audio_path}")

    try:
        logger.info("Starting transcription...")
        result = model.transcribe(audio_path)
        transcript = result['text']
        logger.info(f"Transcription successful: {transcript}")

        logger.info("Analyzing voice tone...")
        tone_result = analyze_tone(audio_path)
        logger.info(f"Tone analysis: {tone_result}")

        therapist_response = get_therapist_response(transcript, tone_result, language)
        logger.info(f"Raw Groq response: {therapist_response}")
        
        # Convert therapist's response to audio
        audio_response_path = convert_text_to_audio(therapist_response)
        logger.info(f"Generated audio response: {audio_response_path}")

        # Return the audio response file
        return send_file(audio_response_path, mimetype='audio/wav')

    except Exception as e:
        logger.error(f"Error during processing: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(audio_path):
            os.remove(audio_path)
            logger.info(f"Cleaned up {audio_path}")

# Convert the therapist's response to audio (using pyttsx3)
def convert_text_to_audio(text):
    engine = pyttsx3.init()
    audio_path = "response_audio.wav"
    
    # Set properties
    engine.setProperty('rate', 150)  # Speed of speech
    engine.setProperty('volume', 1)  # Volume level (0.0 to 1.0)
    
    # Select a specific voice (e.g., female soothing voice)
    voices = engine.getProperty('voices')
    if len(voices) > 1:  # Ensure there are multiple voices available
        engine.setProperty('voice', voices[0].id)  # Use the second voice in the list

    # Save the speech as a wav file
    engine.save_to_file(text, audio_path)
    engine.runAndWait()

    return audio_path

# Enhanced voice tone analysis
def analyze_tone(audio_path):
    y, sr = librosa.load(audio_path, sr=16000)
    
    # Extract features
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = [pitches[i, np.argmax(magnitudes[i])] for i in range(pitches.shape[1]) if np.max(magnitudes[i]) > 0]
    avg_pitch = np.mean(pitch_values) if pitch_values else 0
    rms = librosa.feature.rms(y=y)[0]
    avg_rms = np.mean(rms)
    mfccs = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13))
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))
    
    # Tone classification (extendable to ML)
    tone = "neutral"
    if avg_pitch > 150 and avg_rms > 0.05 and spectral_centroid > 2000:
        tone = "stressed"
    elif avg_pitch < 100 and avg_rms < 0.03 and spectral_centroid < 1500:
        tone = "calm"
    elif avg_pitch > 120 and avg_rms > 0.04 and spectral_centroid > 1800:
        tone = "happy"
    elif zcr > 0.05 and avg_rms < 0.02:
        tone = "sad"
    
    return {
        'average_pitch': float(avg_pitch),
        'average_energy': float(avg_rms),
        'spectral_centroid': float(spectral_centroid),
        'zero_crossing_rate': float(zcr),
        'mfccs': mfccs.tolist(),
        'tone': tone
    }

def get_therapist_response(transcript, tone_result, language):
    lang_name = LANGUAGE_MAP[language]
    prompt = f"""You are a warm, empathetic therapist who truly listens. The user said: "{transcript}". 
    Voice tone analysis indicates: tone={tone_result['tone']}, 
    average pitch={tone_result['average_pitch']:.2f} Hz, 
    average energy={tone_result['average_energy']:.4f}, 
    spectral centroid={tone_result['spectral_centroid']:.2f}, 
    zero crossing rate={tone_result['zero_crossing_rate']:.4f}, 
    MFCCs={tone_result['mfccs']}. 
    Reflect their emotions back to them in a caring way, using their own words and tone insights where possible. 
    Then, identify one key emotional problem they might be facing, suggest one likely cause tied to what they said and their tone, 
    and offer one simple prevention tip. Finally, provide exactly one coping strategy—choose either a breathing technique, 
    a journal prompt, or a mindfulness activity—based on what would best suit their emotional state and tone. 
    Ensure *Prevention* and *Coping Strategy* are always included. Respond entirely in {lang_name}. 
    Format your response with headings *Problem, **Cause, **Prevention, and **Coping Strategy*. Keep it concise but deeply personal.
    Give a 30-45 second response. 
    """
    
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "system", "content": f"You are a therapist providing empathetic and actionable advice in {lang_name}."},
                  {"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.8
    )
    return response.choices[0].message.content.strip()

if __name__ == '__main__':
    app.run(debug=True, port=5001)