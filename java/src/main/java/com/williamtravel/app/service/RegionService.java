package com.williamtravel.app.service;

import com.williamtravel.app.entity.Region;
import com.williamtravel.app.repository.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Region entity operations
 */
@Service
@Transactional
public class RegionService {

    @Autowired
    private RegionRepository regionRepository;

    /**
     * Find all regions
     */
    public List<Region> findAll() {
        return regionRepository.findAll();
    }

    /**
     * Find region by ID
     */
    public Optional<Region> findById(Integer id) {
        return regionRepository.findById(id);
    }

    /**
     * Save region
     */
    public Region save(Region region) {
        return regionRepository.save(region);
    }

    /**
     * Delete region by ID
     */
    public void deleteById(Integer id) {
        regionRepository.deleteById(id);
    }

    /**
     * Count total regions
     */
    public long count() {
        return regionRepository.count();
    }

    /**
     * Check if region exists by ID
     */
    public boolean existsById(Integer id) {
        return regionRepository.existsById(id);
    }

    /**
     * Find all regions with pagination
     */
    public Page<Region> findAll(Pageable pageable) {
        return regionRepository.findAll(pageable);
    }

    // Basic finder methods
    public Optional<Region> findByCode(String code) {
        return regionRepository.findByCode(code);
    }

    public Optional<Region> findByName(String name) {
        return regionRepository.findByName(name);
    }

    public List<Region> findByNameContainingIgnoreCase(String name) {
        return regionRepository.findByNameContainingIgnoreCase(name);
    }

    public boolean existsByCode(String code) {
        return regionRepository.existsByCode(code);
    }

    public boolean existsByName(String name) {
        return regionRepository.existsByName(name);
    }

    // Status-based queries
    public List<Region> findByStatus(Integer status) {
        return regionRepository.findByStatus(status);
    }

    public Page<Region> findByStatus(Integer status, Pageable pageable) {
        return regionRepository.findByStatus(status, pageable);
    }

    public List<Region> findByStatusOrderByName(Integer status) {
        return regionRepository.findByStatusOrderByName(status);
    }

    // Country relationship queries
    public List<Region> findByCountryId(Integer countryId) {
        return regionRepository.findByCountryId(countryId);
    }

    public Page<Region> findByCountryId(Integer countryId, Pageable pageable) {
        return regionRepository.findByCountryId(countryId, pageable);
    }

    public List<Region> findByCountryIdAndStatus(Integer countryId, Integer status) {
        return regionRepository.findByCountryIdAndStatus(countryId, status);
    }

    public Page<Region> findByCountryIdAndStatus(Integer countryId, Integer status, Pageable pageable) {
        return regionRepository.findByCountryIdAndStatus(countryId, status, pageable);
    }

    public List<Region> findByCountryIdWithCountry(Integer countryId) {
        return regionRepository.findByCountryIdWithCountry(countryId);
    }

    public List<Region> findByCountryIdAndStatusWithCountry(Integer countryId, Integer status) {
        return regionRepository.findByCountryIdAndStatusWithCountry(countryId, status);
    }

    // Count queries
    public long countByCountryId(Integer countryId) {
        return regionRepository.countByCountryId(countryId);
    }

    public long countByCountryIdAndStatus(Integer countryId, Integer status) {
        return regionRepository.countByCountryIdAndStatus(countryId, status);
    }

    public long countByStatus(Integer status) {
        return regionRepository.countByStatus(status);
    }

    // Search and filtering
    public Page<Region> findWithFilters(String name, String code, Integer countryId, Integer status, Pageable pageable) {
        return regionRepository.findWithFilters(name, code, countryId, status, pageable);
    }

    public List<Region> searchByNameWithCountry(String name, Integer status) {
        return regionRepository.searchByNameWithCountry(name, status);
    }

    // Date-based queries
    public List<Region> findByCreatedDate(LocalDate createdDate) {
        return regionRepository.findByCreatedDate(createdDate);
    }

    public List<Region> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate) {
        return regionRepository.findByCreatedDateBetween(startDate, endDate);
    }

    public List<Region> findByUpdatedDate(LocalDate updatedDate) {
        return regionRepository.findByUpdatedDate(updatedDate);
    }

    // Advanced queries with relationships
    public Optional<Region> findByIdWithDistricts(Integer id) {
        return regionRepository.findByIdWithDistricts(id);
    }

    public Optional<Region> findByIdWithLocations(Integer id) {
        return regionRepository.findByIdWithLocations(id);
    }

    public Optional<Region> findByIdWithAccommodations(Integer id) {
        return regionRepository.findByIdWithAccommodations(id);
    }

    public Optional<Region> findByIdWithFoods(Integer id) {
        return regionRepository.findByIdWithFoods(id);
    }

    public Optional<Region> findByIdWithEvents(Integer id) {
        return regionRepository.findByIdWithEvents(id);
    }

    // Statistics queries
    public List<Object[]> findRegionsWithLocationCount() {
        return regionRepository.findRegionsWithLocationCount();
    }

    public List<Object[]> findRegionsWithAccommodationCount() {
        return regionRepository.findRegionsWithAccommodationCount();
    }

    public List<Object[]> findRegionsWithFoodCount() {
        return regionRepository.findRegionsWithFoodCount();
    }

    public List<Object[]> findRegionsWithEventCount() {
        return regionRepository.findRegionsWithEventCount();
    }

    // Validation queries
    public boolean existsByCodeAndIdNot(String code, Integer id) {
        return regionRepository.existsByCodeAndIdNot(code, id);
    }

    public boolean existsByNameAndIdNot(String name, Integer id) {
        return regionRepository.existsByNameAndIdNot(name, id);
    }

    public boolean existsByCountryIdAndCodeAndIdNot(Integer countryId, String code, Integer id) {
        return regionRepository.existsByCountryIdAndCodeAndIdNot(countryId, code, id);
    }

    // Custom queries for specific business logic
    public List<Region> findActiveRegionsByCountry(Integer countryId) {
        return regionRepository.findActiveRegionsByCountry(countryId);
    }

    public List<Region> findActiveRegionsWithBackgroundImage() {
        return regionRepository.findActiveRegionsWithBackgroundImage();
    }

    public List<Region> findActiveRegionsWithLogo() {
        return regionRepository.findActiveRegionsWithLogo();
    }
}
