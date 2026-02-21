package com.agriguard.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name; // e.g., "Corn Field 1"
    
    private String cropType; // e.g., "Corn", "Tomato"
    
    private String variety; // e.g., "Sweet Corn"

    private LocalDate plantingDate;
    
    private LocalDate expectedHarvestDate;
    
    private double areaSize; // in acres/hectares
    
    private String location; // Description or coordinates
    
    @Column(length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    private CropStatus status = CropStatus.HEALTHY;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum CropStatus {
        HEALTHY,
        AT_RISK,
        INFECTED,
        HARVESTED
    }
}
