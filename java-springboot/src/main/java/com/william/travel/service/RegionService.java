package com.william.travel.service;

import com.william.travel.entity.Region;
import com.william.travel.entity.Country;
import com.william.travel.entity.District;
import com.william.travel.repository.RegionRepository;
import com.william.travel.repository.CountryRepository;
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
public class RegionService {

    private final RegionRepository regionRepository;
    private final CountryRepository countryRepository;
    private final DistrictRepository districtRepository;

    /**
     * Create a new region
     */
    public Region createRegion(Region region) {
        log.info("Creating new region: {} in country: {}", region.getName(), region.getCountry().getName());
        
        // Validate country exists
        if (region.getCountry() == null || region.getCountry().getId() == null) {
            throw new IllegalArgumentException("Country is required for region");
        }
        
        Country country = countryRepository.findById(region.getCountry().getId())
                .orElseThrow(() -> new IllegalArgumentException("Country not found with ID: " + region.getCountry().getId()));
        
        // Validate unique constraints within country
        if (existsByNameAndCountry(region.getName(), region.getCountry().getId())) {
            throw new IllegalArgumentException("Region with name '" + region.getName() + 
                    "' already exists in country '" + country.getName() + "'");
        }
        
        if (existsByCodeAndCountry(region.getCode(), region.getCountry().getId())) {
            throw new IllegalArgumentException("Region with code '" + region.getCode() + 
                    "' already exists in country '" + country.getName() + "'");
        }
        
        region.setCountry(country);
        region.setStatus(1); // Active
        region.setCreatedDate(LocalDate.now());
        
        return regionRepository.save(region);
    }

    /**
     * Get region by ID
     */
    @Transactional(readOnly = true)
    public Optional<Region> getRegionById(Long id) {
        return regionRepository.findById(id);
    }

    /**
     * Get region by name
     */
    @Transactional(readOnly = true)
    public Optional<Region> getRegionByName(String name) {
        return regionRepository.findByName(name);
    }

    /**
     * Get region by code
     */
    @Transactional(readOnly = true)
    public Optional<Region> getRegionByCode(String code) {
        return regionRepository.findByCode(code);
    }

    /**
     * Get all active regions
     */
    @Transactional(readOnly = true)
    public List<Region> getAllActiveRegions() {
        return regionRepository.findActiveRegions();
    }

    /**
     * Get active regions by country ID
     */
    @Transactional(readOnly = true)
    public List<Region> getActiveRegionsByCountryId(Long countryId) {
        return regionRepository.findActiveByCountryId(countryId);
    }

    /**
     * Get active regions by country code
     */
    @Transactional(readOnly = true)
    public List<Region> getActiveRegionsByCountryCode(String countryCode) {
        return regionRepository.findActiveByCountryCode(countryCode);
    }

    /**
     * Get all regions
     */
    @Transactional(readOnly = true)
    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }

    /**
     * Update region
     */
    public Region updateRegion(Long id, Region regionDetails) {
        log.info("Updating region with ID: {}", id);
        
        Region region = regionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Region not found with ID: " + id));

        // Validate country if being changed
        if (regionDetails.getCountry() != null && regionDetails.getCountry().getId() != null &&
            !regionDetails.getCountry().getId().equals(region.getCountry().getId())) {
            
            Country newCountry = countryRepository.findById(regionDetails.getCountry().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Country not found with ID: " + regionDetails.getCountry().getId()));
            
            region.setCountry(newCountry);
        }

        // Check for unique constraints if name or code is being changed
        if (!region.getName().equals(regionDetails.getName()) &&
            existsByNameAndCountry(regionDetails.getName(), region.getCountry().getId())) {
            throw new IllegalArgumentException("Region with name '" + regionDetails.getName() + 
                    "' already exists in this country");
        }
        
        if (!region.getCode().equals(regionDetails.getCode()) &&
            existsByCodeAndCountry(regionDetails.getCode(), region.getCountry().getId())) {
            throw new IllegalArgumentException("Region with code '" + regionDetails.getCode() + 
                    "' already exists in this country");
        }

        // Update fields
        region.setName(regionDetails.getName());
        region.setCode(regionDetails.getCode());
        region.setNameCode(regionDetails.getNameCode());
        region.setDescription(regionDetails.getDescription());
        region.setDescriptionCode(regionDetails.getDescriptionCode());
        region.setBackgroundImage(regionDetails.getBackgroundImage());
        region.setLogo(regionDetails.getLogo());
        region.setUpdatedDate(LocalDate.now());

        return regionRepository.save(region);
    }

    /**
     * Activate region
     */
    public Region activateRegion(Long id) {
        log.info("Activating region with ID: {}", id);
        
        Region region = regionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Region not found with ID: " + id));
        
        region.setStatus(1);
        region.setUpdatedDate(LocalDate.now());
        
        return regionRepository.save(region);
    }

    /**
     * Deactivate region
     */
    public Region deactivateRegion(Long id) {
        log.info("Deactivating region with ID: {}", id);
        
        Region region = regionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Region not found with ID: " + id));
        
        region.setStatus(0);
        region.setUpdatedDate(LocalDate.now());
        
        return regionRepository.save(region);
    }

    /**
     * Delete region (soft delete)
     */
    public void deleteRegion(Long id) {
        log.info("Deleting region with ID: {}", id);
        
        Region region = regionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Region not found with ID: " + id));
        
        // Check if region has districts
        List<District> districts = districtRepository.findByRegionId(id);
        if (!districts.isEmpty()) {
            throw new IllegalStateException("Cannot delete region with associated districts. " +
                    "Please reassign or delete districts first.");
        }
        
        region.setStatus(-1); // Deleted
        region.setUpdatedDate(LocalDate.now());
        regionRepository.save(region);
    }

    /**
     * Get districts in a region
     */
    @Transactional(readOnly = true)
    public List<District> getDistrictsInRegion(Long regionId) {
        Region region = regionRepository.findById(regionId)
                .orElseThrow(() -> new IllegalArgumentException("Region not found with ID: " + regionId));
        
        return districtRepository.findByRegionId(regionId);
    }

    /**
     * Count districts in region
     */
    @Transactional(readOnly = true)
    public long countDistrictsInRegion(Long regionId) {
        return districtRepository.countByRegionId(regionId);
    }

    /**
     * Check if region exists by name within country
     */
    @Transactional(readOnly = true)
    public boolean existsByNameAndCountry(String name, Long countryId) {
        return regionRepository.findAll().stream()
                .anyMatch(region -> region.getName().equals(name) && 
                         region.getCountry().getId().equals(countryId));
    }

    /**
     * Check if region exists by code within country
     */
    @Transactional(readOnly = true)
    public boolean existsByCodeAndCountry(String code, Long countryId) {
        return regionRepository.findAll().stream()
                .anyMatch(region -> region.getCode().equals(code) && 
                         region.getCountry().getId().equals(countryId));
    }

    /**
     * Check if region exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return regionRepository.existsByName(name);
    }

    /**
     * Check if region exists by code
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return regionRepository.existsByCode(code);
    }
}
