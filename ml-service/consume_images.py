from kafka import KafkaConsumer, KafkaProducer
import json
import os
import requests
import cv2
import numpy as np
from ultralytics import YOLO
from dotenv import load_dotenv

load_dotenv()

KAFKA_BOOTSTRAP_SERVER = os.getenv('KAFKA_BOOTSTRAP_SERVER', 'localhost:9092')
INPUT_TOPIC = 'disease_images'
OUTPUT_TOPIC = 'disease_alerts'

# Model Init
MODEL_PATH = os.getenv('MODEL_PATH', 'yolov8n-cls.pt')
print(f"Loading model: {MODEL_PATH}")
model = YOLO(MODEL_PATH)

def process_image(url):
    try:
        # Download image
        resp = requests.get(url)
        if resp.status_code != 200:
            print(f"Failed to download image: {url}")
            return None
        
        # Convert to numpy array
        arr = np.frombuffer(resp.content, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error processing image: {e}")
        return None

def run():
    consumer = KafkaConsumer(
        INPUT_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVER,
        value_deserializer=lambda m: json.loads(m.decode('utf-8')),
        group_id='ml-image-processor'
    )
    
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVER,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    print(f"Listening on {INPUT_TOPIC}...")
    
    for message in consumer:
        data = message.value
        detection_id = data.get('id')
        image_url = data.get('imageUrl')
        
        print(f"Processing detection ID: {detection_id}")
        
        img = process_image(image_url)
        if img is None:
            continue
            
        # Inference
        results = model(img)
        
        # Parse result (Classification)
        if not results or results[0].probs is None:
            print("No classification results.")
            continue

        probs = results[0].probs
        top1_index = probs.top1
        conf = probs.top1conf.item()
        class_name = model.names[top1_index]

        # Parse Class Name (e.g., Apple___Apple_scab)
        parts = class_name.split("___")
        if len(parts) == 2:
            crop_name = parts[0]
            disease_name = parts[1].replace("_", " ")
        else:
            crop_name = "Unknown"
            disease_name = class_name

        result_data = {
            "id": detection_id,
            "diseaseName": disease_name,
            "cropName": crop_name,
            "confidenceScore": conf,
            "status": "CONFIRMED" if conf > 0.5 else "UNCERTAIN"
        }
        
        producer.send(OUTPUT_TOPIC, result_data)
        print(f"Sent result: {result_data}")

if __name__ == '__main__':
    run()
