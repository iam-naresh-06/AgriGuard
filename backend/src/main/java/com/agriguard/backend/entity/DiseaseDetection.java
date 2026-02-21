package com.agriguard.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "disease_detections")
public class DiseaseDetection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String cropName; // e.g., "Corn", "Tomato"

    private String diseaseName; // e.g., "Leaf Blight", "Healthy"

    private String imageUrl; // Evidence
    private String videoUrl;

    private double latitude;
    private double longitude;

    private double confidenceScore; // ML Confidence

    @Column(columnDefinition = "vector(384)")
    private List<Double> embedding;

    @Enumerated(EnumType.STRING)
    private DetectionStatus status = DetectionStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime timestamp;

    public enum DetectionStatus {
        PENDING,
        CONFIRMED,
        FALSE_POSITIVE,
        TREATED
    }
}
