package com.agriguard.backend.repository;

import com.agriguard.backend.entity.DiseaseDetection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DiseaseDetectionRepository extends JpaRepository<DiseaseDetection, UUID> {
    List<DiseaseDetection> findByTimestampBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<DiseaseDetection> findByCropName(String cropName);

    @org.springframework.data.jpa.repository.Query(value = "SELECT * FROM disease_detections ORDER BY embedding <-> cast(:embedding as vector) LIMIT 5", nativeQuery = true)
    List<DiseaseDetection> findTop5ByEmbeddingOrderByEmbeddingEuclideanDistance(@org.springframework.data.repository.query.Param("embedding") List<Double> embedding);
}
