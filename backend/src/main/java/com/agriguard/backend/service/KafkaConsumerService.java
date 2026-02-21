package com.agriguard.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.agriguard.backend.entity.DiseaseDetection;
import com.agriguard.backend.repository.DiseaseDetectionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {

    @Autowired
    private DiseaseDetectionRepository diseaseRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final ObjectMapper objectMapper;

    public KafkaConsumerService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @KafkaListener(topics = "disease_alerts", groupId = "agriguard-group")
    public void listenDiseaseAlert(String message) {
        log.info("Received Disease Alert: " + message);
        try {
            DiseaseDetection incoming = objectMapper.readValue(message, DiseaseDetection.class);
            
            DiseaseDetection saved;
            if (incoming.getId() != null && diseaseRepository.existsById(incoming.getId())) {
                // Update existing record
                saved = diseaseRepository.findById(incoming.getId()).map(existing -> {
                    if (incoming.getDiseaseName() != null) existing.setDiseaseName(incoming.getDiseaseName());
                    if (incoming.getCropName() != null) existing.setCropName(incoming.getCropName());
                    if (incoming.getConfidenceScore() > 0) existing.setConfidenceScore(incoming.getConfidenceScore());
                    if (incoming.getStatus() != null) existing.setStatus(incoming.getStatus());
                    if (incoming.getEmbedding() != null) existing.setEmbedding(incoming.getEmbedding());
                    return diseaseRepository.save(existing);
                }).orElseGet(() -> diseaseRepository.save(incoming));
            } else {
                // Create new
                saved = diseaseRepository.save(incoming);
            }
            
            log.info("Saved/Updated Disease Detection in DB: {}", saved.getId());
            
            // Push to Frontend via WebSocket
            messagingTemplate.convertAndSend("/topic/diseases", saved);
            
        } catch (Exception e) {
            log.error("Error processing message: {}", message, e);
        }
    }
}
