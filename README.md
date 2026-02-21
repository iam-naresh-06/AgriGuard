# AgriGuard: AI Crop Disease Early Warning System


## Overview
This project is an **AI-powered Early Warning System** designed to help farmers detect crop diseases early. It uses **Deep Learning (YOLOv8)** to analyze images of crops (captured via drones or mobile phones) and identify potential diseases.

The system consists of:
- **ML Service**: A Python-based service using YOLOv8 for disease detection. It processes images/video streams and publishes alerts to Kafka.
- **Backend**: A Spring Boot application that consumes alerts, manages farm data, and serves the API.
- **Frontend**: A React-based Farm Dashboard for monitoring crop health and receiving alerts.

## Tech Stack
- **ML**: YOLOv8, OpenCV, Python
- **Backend**: Java Spring Boot, PostgreSQL (with pgvector for similarity search), Kafka
- **Frontend**: React, Vite, TailwindCSS (AgriTech Theme)
- **Infrastructure**: Docker Compose

## Setup
1.  **Clone the repository**.
2.  **Start Services**:
    ```bash
    docker-compose up -d
    ```
3.  **Run Backend**:
    ```bash
    cd backend
    mvn spring-boot:run
    ```
4.  **Run Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
5.  **Run ML Service**:
    ```bash
    cd ml-service
    python detect_disease.py
    ```

6.  **Train Custom Model** (Optional):
    *   **Download Dataset**:
        ```bash
        cd ml-service
        python download_dataset.py
        ```
    *   **Train Model**:
        ```bash
        train_ml.bat
        ```
