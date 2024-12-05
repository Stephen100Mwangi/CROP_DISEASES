import numpy as np
from tensorflow.keras.models import load_model
import cv2

def predict_image(model_path, image_path, img_size=(224, 224)):
    model = load_model(model_path)
    img = cv2.imread(image_path)
    img = cv2.resize(img, img_size) / 255.0
    img = np.expand_dims(img, axis=0)

    predictions = model.predict(img)
    class_index = np.argmax(predictions)
    confidence = predictions[0][class_index]
    return class_index, confidence
