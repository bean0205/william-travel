package com.william.travel.service;

import com.william.travel.entity.District;
import com.william.travel.entity.Region;
import com.william.travel.entity.Ward;
import com.william.travel.repository.DistrictRepository;
import com.william.travel.repository.RegionRepository;
import com.william.travel.repository.WardRepository;
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
public class DistrictService {

    private final DistrictRepository districtRepository;
    private final RegionRepository regionRepository;
    private final WardRepository wardRepository;

    /**
     * Create a new district
     */
    public District createDistrict(District district) {
        log.info("Creating new district: {} in region: {}", district.getName(), district.getRegion().getName());
        
        // Validate region exists
        if (district.getRegion() == null || district.getRegion().getId() == null) {
            throw new IllegalArgumentException("Region is required for district");
        }
        
        Region region = regionRepository.findById(district.getRegion().getId())
                .orElseThrow(() -> new IllegalArgumentException("Region not found with ID: " + district.getRegion().getId()));
        
        // Validate unique constraints within region
        if (existsByNameAndRegion(district.getName(), district.getRegion().getId())) {
            throw new IllegalArgumentException("District with name '" + district.getName() + 
                    "' already exists in region '" + region.getName() + "'");
        }
        
        if (existsByCodeAndRegion(district.getCode(), district.getRegion().getId())) {
            throw new IllegalArgumentException("District with code '" + district.getCode() + 
                    "' already exists in region '" + region.getName() + "'");
        }
        
        district.setRegion(region);
        district.setStatus(1); // Active
        district.setCreatedDate(LocalDate.now());
        
        return districtRepository.save(district);
    }

    /**
     * Get district by ID
     */
    @Transactional(readOnly = true)
    public Optional<District> getDistrictById(Long id) {
        return districtRepository.findById(id);
    }

    /**
     * Get district by name
     */
    @Transactional(readOnly = true)
    public Optional<District> getDistrictByName(String name) {
        return districtRepository.findByName(name);
    }

    /**
     * Get district by code
     */
    @Transactional(readOnly = true)
    public Optional<District> getDistrictByCode(String code) {
        return districtRepository.findByCode(code);
    }

    /**
     * Get all active districts
     */
    @Transactional(readOnly = true)
    public List<District> getAllActiveDistricts() {
        return districtRepository.findActiveDistricts();
    }

    /**
     * Get active districts by region ID
     */
    @Transactional(readOnly = true)
    public List<District> getActiveDistrictsByRegionId(Long regionId) {
        return districtRepository.findActiveByRegionId(regionId);
    }

    /**
     * Get active districts by region code
     */
    @Transactional(readOnly = true)
    public List<District> getActiveDistrictsByRegionCode(String regionCode) {
        return districtRepository.findActiveByRegionCode(regionCode);
    }

    /**
     * Get all districts
     */
    @Transactional(readOnly = true)
    public List<District> getAllDistricts() {
        return districtRepository.findAll();
    }

    /**
     * Update district
     */
    public District updateDistrict(Long id, District districtDetails) {
        log.info("Updating district with ID: {}", id);
        
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("District not found with ID: " + id));

        // Validate region if being changed
        if (districtDetails.getRegion() != null && districtDetails.getRegion().getId() != null &&
            !districtDetails.getRegion().getId().equals(district.getRegion().getId())) {
            
            Region newRegion = regionRepository.findById(districtDetails.getRegion().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Region not found with ID: " + districtDetails.getRegion().getId()));
            
            district.setRegion(newRegion);
        }

        // Check for unique constraints if name or code is being changed
        if (!district.getName().equals(districtDetails.getName()) &&
            existsByNameAndRegion(districtDetails.getName(), district.getRegion().getId())) {
            throw new IllegalArgumentException("District with name '" + districtDetails.getName() + 
                    "' already exists in this region");
        }
        
        if (!district.getCode().equals(districtDetails.getCode()) &&
            existsByCodeAndRegion(districtDetails.getCode(), district.getRegion().getId())) {
            throw new IllegalArgumentException("District with code '" + districtDetails.getCode() + 
                    "' already exists in this region");
        }

        // Update fields
        district.setName(districtDetails.getName());
        district.setCode(districtDetails.getCode());
        district.setNameCode(districtDetails.getNameCode());
        district.setDescription(districtDetails.getDescription());
        district.setDescriptionCode(districtDetails.getDescriptionCode());
        district.setBackgroundImage(districtDetails.getBackgroundImage());
        district.setLogo(districtDetails.getLogo());
        district.setUpdatedDate(LocalDate.now());

        return districtRepository.save(district);
    }

    /**
     * Activate district
     */
    public District activateDistrict(Long id) {
        log.info("Activating district with ID: {}", id);
        
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("District not found with ID: " + id));
        
        district.setStatus(1);
        district.setUpdatedDate(LocalDate.now());
        
        return districtRepository.save(district);
    }

    /**
     * Deactivate district
     */
    public District deactivateDistrict(Long id) {
        log.info("Deactivating district with ID: {}", id);
        
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("District not found with ID: " + id));
        
        district.setStatus(0);
        district.setUpdatedDate(LocalDate.now());
        
        return districtRepository.save(district);
    }

    /**
     * Delete district (soft delete)
     */
    public void deleteDistrict(Long id) {
        log.info("Deleting district with ID: {}", id);
        
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("District not found with ID: " + id));
        
        // Check if district has wards
        List<Ward> wards = wardRepository.findByDistrictId(id);
        if (!wards.isEmpty()) {
            throw new IllegalStateException("Cannot delete district with associated wards. " +
                    "Please reassign or delete wards first.");
        }
        
        district.setStatus(-1); // Deleted
        district.setUpdatedDate(LocalDate.now());
        districtRepository.save(district);
    }

    /**
     * Get wards in a district
     */
    @Transactional(readOnly = true)
    public List<Ward> getWardsInDistrict(Long districtId) {
        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new IllegalArgumentException("District not found with ID: " + districtId));
        
        return wardRepository.findByDistrictId(districtId);
    }

    /**
     * Count wards in district
     */
    @Transactional(readOnly = true)
    public long countWardsInDistrict(Long districtId) {
        return wardRepository.countByDistrictId(districtId);
    }

    /**
     * Check if district exists by name within region
     */
    @Transactional(readOnly = true)
    public boolean existsByNameAndRegion(String name, Long regionId) {
        return districtRepository.findAll().stream()
                .anyMatch(district -> district.getName().equals(name) && 
                         district.getRegion().getId().equals(regionId));
    }

    /**
     * Check if district exists by code within region
     */
    @Transactional(readOnly = true)
    public boolean existsByCodeAndRegion(String code, Long regionId) {
        return districtRepository.findAll().stream()
                .anyMatch(district -> district.getCode().equals(code) && 
                         district.getRegion().getId().equals(regionId));
    }

    /**
     * Check if district exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return districtRepository.existsByName(name);
    }

    /**
     * Check if district exists by code
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return districtRepository.existsByCode(code);
    }
}
