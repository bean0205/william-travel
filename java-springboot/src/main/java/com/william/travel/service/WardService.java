package com.william.travel.service;

import com.william.travel.entity.Ward;
import com.william.travel.entity.District;
import com.william.travel.repository.WardRepository;
import com.william.travel.repository.DistrictRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WardService {

    private final WardRepository wardRepository;
    private final DistrictRepository districtRepository;

    /**
     * Create a new ward
     */
    public Ward createWard(Ward ward) {
        log.info("Creating new ward: {} in district: {}", ward.getName(), ward.getDistrict().getName());
        
        // Validate district exists
        if (ward.getDistrict() == null || ward.getDistrict().getId() == null) {
            throw new IllegalArgumentException("District is required for ward");
        }
        
        District district = districtRepository.findById(ward.getDistrict().getId())
                .orElseThrow(() -> new IllegalArgumentException("District not found with ID: " + ward.getDistrict().getId()));
        
        // Validate unique constraints within district
        if (existsByNameAndDistrict(ward.getName(), ward.getDistrict().getId())) {
            throw new IllegalArgumentException("Ward with name '" + ward.getName() + 
                    "' already exists in district '" + district.getName() + "'");
        }
        
        if (existsByCodeAndDistrict(ward.getCode(), ward.getDistrict().getId())) {
            throw new IllegalArgumentException("Ward with code '" + ward.getCode() + 
                    "' already exists in district '" + district.getName() + "'");
        }
        
        ward.setDistrict(district);
        ward.setStatus(1); // Active
        ward.setCreatedDate(LocalDate.now());
        
        return wardRepository.save(ward);
    }

    /**
     * Get ward by ID
     */
    @Transactional(readOnly = true)
    public Optional<Ward> getWardById(Long id) {
        return wardRepository.findById(id);
    }

    /**
     * Get ward by name
     */
    @Transactional(readOnly = true)
    public Optional<Ward> getWardByName(String name) {
        return wardRepository.findByName(name);
    }

    /**
     * Get ward by code
     */
    @Transactional(readOnly = true)
    public Optional<Ward> getWardByCode(String code) {
        return wardRepository.findByCode(code);
    }

    /**
     * Get all active wards
     */
    @Transactional(readOnly = true)
    public List<Ward> getAllActiveWards() {
        return wardRepository.findActiveWards();
    }

    /**
     * Get active wards by district ID
     */
    @Transactional(readOnly = true)
    public List<Ward> getActiveWardsByDistrictId(Long districtId) {
        return wardRepository.findActiveByDistrictId(districtId);
    }

    /**
     * Get active wards by district code
     */
    @Transactional(readOnly = true)
    public List<Ward> getActiveWardsByDistrictCode(String districtCode) {
        return wardRepository.findActiveByDistrictCode(districtCode);
    }

    /**
     * Get all wards
     */
    @Transactional(readOnly = true)
    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }

    /**
     * Update ward
     */
    public Ward updateWard(Long id, Ward wardDetails) {
        log.info("Updating ward with ID: {}", id);
        
        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ward not found with ID: " + id));

        // Validate district if being changed
        if (wardDetails.getDistrict() != null && wardDetails.getDistrict().getId() != null &&
            !wardDetails.getDistrict().getId().equals(ward.getDistrict().getId())) {
            
            District newDistrict = districtRepository.findById(wardDetails.getDistrict().getId())
                    .orElseThrow(() -> new IllegalArgumentException("District not found with ID: " + wardDetails.getDistrict().getId()));
            
            ward.setDistrict(newDistrict);
        }

        // Check for unique constraints if name or code is being changed
        if (!ward.getName().equals(wardDetails.getName()) &&
            existsByNameAndDistrict(wardDetails.getName(), ward.getDistrict().getId())) {
            throw new IllegalArgumentException("Ward with name '" + wardDetails.getName() + 
                    "' already exists in this district");
        }
        
        if (!ward.getCode().equals(wardDetails.getCode()) &&
            existsByCodeAndDistrict(wardDetails.getCode(), ward.getDistrict().getId())) {
            throw new IllegalArgumentException("Ward with code '" + wardDetails.getCode() + 
                    "' already exists in this district");
        }

        // Update fields
        ward.setName(wardDetails.getName());
        ward.setCode(wardDetails.getCode());
        ward.setNameCode(wardDetails.getNameCode());
        ward.setDescription(wardDetails.getDescription());
        ward.setDescriptionCode(wardDetails.getDescriptionCode());
        ward.setBackgroundImage(wardDetails.getBackgroundImage());
        ward.setLogo(wardDetails.getLogo());
        ward.setUpdatedDate(LocalDate.now());

        return wardRepository.save(ward);
    }

    /**
     * Activate ward
     */
    public Ward activateWard(Long id) {
        log.info("Activating ward with ID: {}", id);
        
        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ward not found with ID: " + id));
        
        ward.setStatus(1);
        ward.setUpdatedDate(LocalDate.now());
        
        return wardRepository.save(ward);
    }

    /**
     * Deactivate ward
     */
    public Ward deactivateWard(Long id) {
        log.info("Deactivating ward with ID: {}", id);
        
        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ward not found with ID: " + id));
        
        ward.setStatus(0);
        ward.setUpdatedDate(LocalDate.now());
        
        return wardRepository.save(ward);
    }

    /**
     * Delete ward (soft delete)
     */
    public void deleteWard(Long id) {
        log.info("Deleting ward with ID: {}", id);
        
        Ward ward = wardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ward not found with ID: " + id));
        
        // Ward is the smallest administrative unit, so just set status to deleted
        ward.setStatus(-1); // Deleted
        ward.setUpdatedDate(LocalDate.now());
        wardRepository.save(ward);
    }

    /**
     * Check if ward exists by name within district
     */
    @Transactional(readOnly = true)
    public boolean existsByNameAndDistrict(String name, Long districtId) {
        return wardRepository.findAll().stream()
                .anyMatch(ward -> ward.getName().equals(name) && 
                         ward.getDistrict().getId().equals(districtId));
    }

    /**
     * Check if ward exists by code within district
     */
    @Transactional(readOnly = true)
    public boolean existsByCodeAndDistrict(String code, Long districtId) {
        return wardRepository.findAll().stream()
                .anyMatch(ward -> ward.getCode().equals(code) && 
                         ward.getDistrict().getId().equals(districtId));
    }

    /**
     * Check if ward exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return wardRepository.existsByName(name);
    }

    /**
     * Check if ward exists by code
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return wardRepository.existsByCode(code);
    }
}
