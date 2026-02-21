package com.agriguard.backend.controller;

import com.agriguard.backend.entity.DiseaseDetection;
import com.agriguard.backend.repository.DiseaseDetectionRepository;
import com.agriguard.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/diseases")
@CrossOrigin(origins = "*")
public class DiseaseController {

    @Autowired
    private DiseaseDetectionRepository diseaseRepository;

    @Autowired
    private com.agriguard.backend.service.FileStorageService fileStorageService;

    @Autowired
    private org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate;

    @PostMapping("/upload")
    public DiseaseDetection uploadImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String imageUrl = fileStorageService.uploadFile(file);
        
        DiseaseDetection detection = new DiseaseDetection();
        detection.setImageUrl(imageUrl);
        detection.setStatus(DiseaseDetection.DetectionStatus.PENDING);
        // detection.setCropName("Unknown"); // Set by ML later
        
        DiseaseDetection saved = diseaseRepository.save(detection);
        
        // Send to Kafka for processing
        try {
             // Simple message with ID and URL
            String message = "{\"id\":\"" + saved.getId() + "\", \"imageUrl\":\"" + imageUrl + "\"}";
            kafkaTemplate.send("disease_images", message);
        } catch (Exception e) {
            System.err.println("Error sending to Kafka: " + e.getMessage());
        }
        
        return saved;
    }


    @GetMapping
    public List<DiseaseDetection> getAllDetections(
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate
    ) {
        if (startDate != null && endDate != null) {
            return diseaseRepository.findByTimestampBetween(startDate, endDate);
        }
        return diseaseRepository.findAll();
    }

    @PostMapping
    public DiseaseDetection reportDetection(@RequestBody DiseaseDetection detection) {
        return diseaseRepository.save(detection);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DiseaseDetection> updateStatus(@PathVariable UUID id, @RequestParam DiseaseDetection.DetectionStatus status) {
        return diseaseRepository.findById(id)
                .map(detection -> {
                    detection.setStatus(status);
                    return ResponseEntity.ok(diseaseRepository.save(detection));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
