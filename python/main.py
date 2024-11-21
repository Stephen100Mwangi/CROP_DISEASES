from src.data.download import download_dataset
from src.data.preprocess import DataPreprocessor
from src.models.train import ModelTrainer
from src.models.predict import ModelPredictor
from src.visualization.visualize import DataVisualizer

def main():
    # Download dataset
    download_dataset('abhisheksinghh/plant-village-disease-classification')
    
    # Preprocess data
    preprocessor = DataPreprocessor(data_path='data/raw/train.csv')
    X, y = preprocessor.preprocess_data('data/raw/train.csv')
    
    # Train model
    trainer = ModelTrainer()
    X_train, X_test, y_train, y_test = trainer.load_data()
    trainer.train(X_train, y_train)
    trainer.evaluate(X_test, y_test)
    trainer.save_model()
    
    # Make predictions
    predictor = ModelPredictor()
    predictions = predictor.predict(X_test)
    
    # Visualize results
    visualizer = DataVisualizer()
    visualizer.plot_feature_importance(trainer.model, X.columns)

if __name__ == "__main__":
    main()