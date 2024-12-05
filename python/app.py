from flask_cors import CORS
from flask import Flask, jsonify, request, send_from_directory
import cv2
import tensorflow as tf
import numpy as np
import os
from utils import validate_image

# Create a flask app
app = Flask(__name__)
# Set up app to use CORS
CORS(app, origins=["http://localhost:5173"])  # Add React frontend URL


# Load Models
models = {
    'apple': tf.keras.models.load_model('D:/CROP_DISEASES/python/models/apple_disease_model.h5'),
    'rice': tf.keras.models.load_model('D:/CROP_DISEASES/python/models/rice_disease_model.h5')
}

# Set up class labels
labels = {
    'apple': ['Apple Rot', 'Healthy', 'Leaf Blotch', 'Scab Leaves'],
    'rice': ['Rice Blast', 'Healthy', 'Brown Spot', 'Sheath Blight']
}

# Route for the root URL
@app.route('/')
def home():
    return "Welcome to the Crop Disease Prediction API!"

# Route for favicon (optional)
@app.route('/favicon.ico')
def favicon():
    return '', 404  # Return a 404 if you don't have a favicon

# Create a prediction route
@app.route('/predict/<crop>', methods=["POST"])
def predict_crop(crop):
    if crop not in models:
        return jsonify({"error": "Invalid crop type"}), 400
    
    model = models[crop]
    file = request.files.get('image')
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    # Preprocess the image
    try:
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        if not validate_image(image):
            return jsonify({'error': 'Invalid image format'}), 400
        image = cv2.resize(image, (224, 224)) / 255.0
        image = np.expand_dims(image, axis=0)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Make predictions
    predictions = model.predict(image)
    class_idx = np.argmax(predictions)
    confidence = float(np.max(predictions))

    return jsonify({
        'class': labels[crop][class_idx],
        'confidence': confidence
    })


if __name__ == '__main__':
    app.run(debug=True)
