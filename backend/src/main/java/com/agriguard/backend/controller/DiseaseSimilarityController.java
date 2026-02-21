package com.agriguard.backend.controller;

import com.agriguard.backend.entity.DiseaseDetection;
import com.agriguard.backend.repository.DiseaseDetectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/diseases/search")
@CrossOrigin(origins = "*")
public class DiseaseSimilarityController {

    @Autowired
    private DiseaseDetectionRepository diseaseRepository;

    @PostMapping("/similar")
    public List<DiseaseDetection> findSimilarDiseases(@RequestBody List<Double> embedding) {
        return diseaseRepository.findTop5ByEmbeddingOrderByEmbeddingEuclideanDistance(embedding);
    }
    
    @GetMapping("/{id}/similar")
    public List<DiseaseDetection> findSimilarById(@PathVariable UUID id) {
        DiseaseDetection d = diseaseRepository.findById(id).orElseThrow(() -> new RuntimeException("Disease detection not found"));
        if (d.getEmbedding() == null) {
            throw new RuntimeException("No embedding found for this detection");
        }
        return diseaseRepository.findTop5ByEmbeddingOrderByEmbeddingEuclideanDistance(d.getEmbedding());
    }
}
