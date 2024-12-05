from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from sklearn.model_selection import train_test_split
from src.preprocess import load_dataset



def train_model(dataset_path, model_save_path):
    # Load data
    images, labels, class_names = load_dataset(dataset_path)
    X_train, X_test, y_train, y_test = train_test_split(images, labels, test_size=0.2, random_state=42)
    y_train = to_categorical(y_train, num_classes=len(class_names))
    y_test = to_categorical(y_test, num_classes=len(class_names))


    # Build model
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(len(class_names), activation='softmax')
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Train model
    model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=10, batch_size=32)

    # Save model
    model.save(model_save_path)
    print(f'Model saved to {model_save_path}')