package com.agriguard.backend.controller;

import com.agriguard.backend.entity.Crop;
import com.agriguard.backend.repository.CropRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow React frontend
public class CropController {

    private final CropRepository cropRepository;

    @GetMapping
    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    @PostMapping
    public Crop createCrop(@RequestBody Crop crop) {
        return cropRepository.save(crop);
    }

    @GetMapping("/{id}")
    public Crop getCrop(@PathVariable UUID id) {
        return cropRepository.findById(id).orElseThrow(() -> new RuntimeException("Crop not found"));
    }

    @PutMapping("/{id}")
    public Crop updateCrop(@PathVariable UUID id, @RequestBody Crop cropDetails) {
        Crop crop = cropRepository.findById(id).orElseThrow(() -> new RuntimeException("Crop not found"));
        
        crop.setName(cropDetails.getName());
        crop.setCropType(cropDetails.getCropType());
        crop.setVariety(cropDetails.getVariety());
        crop.setPlantingDate(cropDetails.getPlantingDate());
        crop.setExpectedHarvestDate(cropDetails.getExpectedHarvestDate());
        crop.setAreaSize(cropDetails.getAreaSize());
        crop.setLocation(cropDetails.getLocation());
        crop.setNotes(cropDetails.getNotes());
        crop.setStatus(cropDetails.getStatus());
        
        return cropRepository.save(crop);
    }

    @DeleteMapping("/{id}")
    public void deleteCrop(@PathVariable UUID id) {
        cropRepository.deleteById(id);
    }
}
