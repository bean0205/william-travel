package com.williamtravel.app.service;

import com.williamtravel.app.entity.District;
import com.williamtravel.app.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service class for District entity operations
 */
@Service
@Transactional
public class DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    /**
     * Find all districts
     */
    public List<District> findAll() {
        return districtRepository.findAll();
    }

    /**
     * Find district by ID
     */
    public Optional<District> findById(Integer id) {
        return districtRepository.findById(id);
    }

    /**
     * Save district
     */
    public District save(District district) {
        return districtRepository.save(district);
    }

    /**
     * Delete district by ID
     */
    public void deleteById(Integer id) {
        districtRepository.deleteById(id);
    }

    /**
     * Count total districts
     */
    public long count() {
        return districtRepository.count();
    }

    /**
     * Check if district exists by ID
     */
    public boolean existsById(Integer id) {
        return districtRepository.existsById(id);
    }

    /**
     * Find all districts with pagination
     */
    public Page<District> findAll(Pageable pageable) {
        return districtRepository.findAll(pageable);
    }

    // Basic finder methods
    public Optional<District> findByCode(String code) {
        return districtRepository.findByCode(code);
    }

    public Optional<District> findByName(String name) {
        return districtRepository.findByName(name);
    }

    public List<District> findByNameContainingIgnoreCase(String name) {
        return districtRepository.findByNameContainingIgnoreCase(name);
    }

    public boolean existsByCode(String code) {
        return districtRepository.existsByCode(code);
    }

    public boolean existsByName(String name) {
        return districtRepository.existsByName(name);
    }

    // Status-based queries
    public List<District> findByStatus(Integer status) {
        return districtRepository.findByStatus(status);
    }

    public Page<District> findByStatus(Integer status, Pageable pageable) {
        return districtRepository.findByStatus(status, pageable);
    }

    public List<District> findByStatusOrderByName(Integer status) {
        return districtRepository.findByStatusOrderByName(status);
    }

    // Region relationship queries
    public List<District> findByRegionId(Integer regionId) {
        return districtRepository.findByRegionId(regionId);
    }

    public Page<District> findByRegionId(Integer regionId, Pageable pageable) {
        return districtRepository.findByRegionId(regionId, pageable);
    }

    public List<District> findByRegionIdAndStatus(Integer regionId, Integer status) {
        return districtRepository.findByRegionIdAndStatus(regionId, status);
    }

    public Page<District> findByRegionIdAndStatus(Integer regionId, Integer status, Pageable pageable) {
        return districtRepository.findByRegionIdAndStatus(regionId, status, pageable);
    }

    public List<District> findByRegionIdWithRegion(Integer regionId) {
        return districtRepository.findByRegionIdWithRegion(regionId);
    }

    public List<District> findByRegionIdAndStatusWithRegionAndCountry(Integer regionId, Integer status) {
        return districtRepository.findByRegionIdAndStatusWithRegionAndCountry(regionId, status);
    }

    // Country-based queries through region
    public List<District> findByCountryId(Integer countryId) {
        return districtRepository.findByCountryId(countryId);
    }

    public List<District> findByCountryIdAndStatus(Integer countryId, Integer status) {
        return districtRepository.findByCountryIdAndStatus(countryId, status);
    }

    // Count queries
    public long countByRegionId(Integer regionId) {
        return districtRepository.countByRegionId(regionId);
    }

    public long countByRegionIdAndStatus(Integer regionId, Integer status) {
        return districtRepository.countByRegionIdAndStatus(regionId, status);
    }

    public long countByStatus(Integer status) {
        return districtRepository.countByStatus(status);
    }

    public long countByCountryId(Integer countryId) {
        return districtRepository.countByCountryId(countryId);
    }

    // Search and filtering
    public Page<District> findWithFilters(String name, String code, Integer regionId, Integer status, Pageable pageable) {
        return districtRepository.findWithFilters(name, code, regionId, status, pageable);
    }

    public List<District> searchByNameWithRegionAndCountry(String name, Integer status) {
        return districtRepository.searchByNameWithRegionAndCountry(name, status);
    }

    // Date-based queries
    public List<District> findByCreatedDate(LocalDate createdDate) {
        return districtRepository.findByCreatedDate(createdDate);
    }

    public List<District> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate) {
        return districtRepository.findByCreatedDateBetween(startDate, endDate);
    }

    public List<District> findByUpdatedDate(LocalDate updatedDate) {
        return districtRepository.findByUpdatedDate(updatedDate);
    }

    // Advanced queries with relationships
    public Optional<District> findByIdWithWards(Integer id) {
        return districtRepository.findByIdWithWards(id);
    }

    public Optional<District> findByIdWithLocations(Integer id) {
        return districtRepository.findByIdWithLocations(id);
    }

    public Optional<District> findByIdWithAccommodations(Integer id) {
        return districtRepository.findByIdWithAccommodations(id);
    }

    public Optional<District> findByIdWithFoods(Integer id) {
        return districtRepository.findByIdWithFoods(id);
    }

    public Optional<District> findByIdWithEvents(Integer id) {
        return districtRepository.findByIdWithEvents(id);
    }

    // Statistics queries
    public List<Object[]> findDistrictsWithWardCount() {
        return districtRepository.findDistrictsWithWardCount();
    }

    public List<Object[]> findDistrictsWithLocationCount() {
        return districtRepository.findDistrictsWithLocationCount();
    }

    public List<Object[]> findDistrictsWithAccommodationCount() {
        return districtRepository.findDistrictsWithAccommodationCount();
    }

    public List<Object[]> findDistrictsWithFoodCount() {
        return districtRepository.findDistrictsWithFoodCount();
    }

    public List<Object[]> findDistrictsWithEventCount() {
        return districtRepository.findDistrictsWithEventCount();
    }

    // Validation queries
    public boolean existsByCodeAndIdNot(String code, Integer id) {
        return districtRepository.existsByCodeAndIdNot(code, id);
    }

    public boolean existsByNameAndIdNot(String name, Integer id) {
        return districtRepository.existsByNameAndIdNot(name, id);
    }

    public boolean existsByRegionIdAndCodeAndIdNot(Integer regionId, String code, Integer id) {
        return districtRepository.existsByRegionIdAndCodeAndIdNot(regionId, code, id);
    }

    // Custom queries for specific business logic
    public List<District> findActiveDistrictsByRegion(Integer regionId) {
        return districtRepository.findActiveDistrictsByRegion(regionId);
    }

    public List<District> findActiveDistrictsWithBackgroundImage() {
        return districtRepository.findActiveDistrictsWithBackgroundImage();
    }

    public List<District> findActiveDistrictsWithLogo() {
        return districtRepository.findActiveDistrictsWithLogo();
    }

    public List<District> findActiveDistrictsByCountryOrderedByRegion(Integer countryId) {
        return districtRepository.findActiveDistrictsByCountryOrderedByRegion(countryId);
    }
}
