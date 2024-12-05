from src.train_model import train_model

# Train the apple model
train_model('datasets/apple_diseases', 'models/apple_disease_model.h5')

# Train the rice model
train_model('datasets/rice_diseases', 'models/rice_disease_model.h5')
