import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from PIL import Image, UnidentifiedImageError
from tensorflow.keras.models import load_model # type: ignore
from flask_cors import CORS

# Create Flask app
app = Flask(__name__)
CORS(app)
MODEL_PATH = '../saved_models/rice_disease_model.h5'

try:
    model = load_model(MODEL_PATH)
except Exception as e:
    print(f"Error loading model {e}")
    model = None

# Set up the image dimensions
IMG_HEIGHT = 224
IMG_WIDTH = 224

# Set up the classes for the model
# For our model, we have 4 classes thus 4 diseases that is Bacterial Blight Disease, Blast Disease, Brown Spot Disease and False Smut Disease
class_names = ['Bacterial Blight Disease', 'Blast Disease', 'Brown Spot Disease', 'False Smut Disease']


@app.route('/predict',methods=["POST"])
def predict():
    if model is None:
        return jsonify({'error':'Model could not be loaded'}),500


    try:    
    # Get the image file from the request
        image_file = request.files.get('image')
        if not image_file:
            return jsonify({'error':'No image file provided'}),400
        
        # Process the image
        try:
            image = Image.open(image_file).resize((IMG_HEIGHT, IMG_WIDTH))
        except UnidentifiedImageError:
            return jsonify({'error':'Invalid image format'})
        

        # Normalize and expand dimensions
        image = np.array(image) / 255.0
        image = np.expand_dims(image, axis=0)

        # Make predictions
        # Predict disease based on image 
        predictions = model.predict(image)
        class_index = np.argmax(predictions[0])
        confidence = np.max(predictions[0])
        predicted_class = class_names[class_index]

        return jsonify({
            'disease': predicted_class,
            'class_index':int(class_index),
            'confidence':float(confidence)  
        })
    except Exception as e:
        # Log the exception on the console and return the error response
        print(f"Error during prediction: {e}")
        return jsonify({"error":'An error occurred during prediction'}),500



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)