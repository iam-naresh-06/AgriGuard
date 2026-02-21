from kafka import KafkaProducer
import json
import datetime
import uuid

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

data = {
    "type": "OVERSPEEDING",
    "vehicleNumber": "TEST-001",
    "confidenceScore": 0.99,
    "latitude": 12.0,
    "longitude": 77.0,
    "imageUrl": "http://localhost:9000/violations/test.jpg",
    "timestamp": datetime.datetime.now().isoformat()
}

producer.send('traffic-violations', data)
producer.flush()
print("Sent test message")
