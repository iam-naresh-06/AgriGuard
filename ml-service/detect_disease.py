import cv2
from ultralytics import YOLO
from kafka import KafkaProducer
import json
import time
import os
from dotenv import load_dotenv
import threading

# Load environment variables
load_dotenv()

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_TOPIC = 'disease_alerts'

# ML Configuration
# For production, replace 'yolov8n.pt' with a custom trained model path like 'runs/classify/train/weights/best.pt'
MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8n-cls.pt') 

def get_producer():
    try:
        return KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
    except Exception as e:
        print(f"Error connecting to Kafka: {e}")
        return None

def process_video_source(source, model, producer):
    """
    Process video stream (or file) to detect crop diseases.
    """
    cap = cv2.VideoCapture(source)
    
    if not cap.isOpened():
        print(f"Error opening video source: {source}")
        return

    print(f"Processing source: {source}")
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        # Run inference
        results = model(frame, verbose=False)
        
        # Parse results (Classification)
        detections = []
        for result in results:
            if result.probs is not None:
                # Get top 1 prediction
                top1_index = result.probs.top1
                conf = result.probs.top1conf.item()
                class_name = result.names[top1_index]
                
                # Threshold
                if conf > 0.5:
                    detections.append({
                        "disease": class_name,
                        "confidence": conf,
                        "bbox": [0, 0, frame.shape[1], frame.shape[0]] # Full frame for classification
                    })

                # Parse Class Name (e.g., Apple___Apple_scab)
                parts = class_name.split("___")
                if len(parts) == 2:
                    crop = parts[0]
                    disease = parts[1].replace("_", " ")
                else:
                    crop = "Unknown"
                    disease = class_name

                # Send alert for THIS detection (matching Java Entity structure)
                if producer:
                    alert = {
                        "cropName": crop,
                        "diseaseName": disease,
                        "confidenceScore": conf,
                        "status": "CONFIRMED",
                        "detectionTime": time.strftime('%Y-%m-%dT%H:%M:%S'),
                        "imagePath": "live_stream" # Placeholder
                    }
                    producer.send(KAFKA_TOPIC, alert)
                    print(f"Alert sent: {alert}")
            
        # Display (Optional for debugging)
        annotated_frame = results[0].plot()
        cv2.imshow("Crop Disease Monitoring", annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    # Initialize Model
    print("Loading YOLOv8 model...")
    model = YOLO(MODEL_PATH)
    
    # Initialize Kafka
    producer = get_producer()
    
    # Example source: 0 for webcam, or path to video file
    video_source = 0 
    
    try:
        process_video_source(video_source, model, producer)
    except KeyboardInterrupt:
        print("Stopping detection...")
