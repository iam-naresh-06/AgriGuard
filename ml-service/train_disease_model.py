from ultralytics import YOLO

def train_model():
    # Load a model (yolov8n-cls.pt for classification)
    model = YOLO("yolov8n-cls.pt") 

    # Train the model
    # Point directly to the dataset directory for classification
    # The dataset updates 'train' and 'val' folders automatically
    data_path = "C:/Users/maste/OneDrive/Documents/Skcet/Projects/AgriGuard/ml-service/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)"
    
    results = model.train(data=data_path, epochs=20, imgsz=224)
    
    # Validate
    metrics = model.val()
    print(metrics.top1)   # top1 accuracy

    # Export
    success = model.export(format="onnx")

if __name__ == '__main__':
    train_model()
