package com.williamtravel.app.service;

import com.williamtravel.app.entity.LocationCategory;
import com.williamtravel.app.repository.LocationCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for LocationCategory entity operations
 */
@Service
@Transactional
public class LocationCategoryService {

    @Autowired
    private LocationCategoryRepository locationCategoryRepository;

    /**
     * Find all location categories
     */
    public List<LocationCategory> findAll() {
        return locationCategoryRepository.findAll();
    }

    /**
     * Find location category by ID
     */
    public Optional<LocationCategory> findById(Integer id) {
        return locationCategoryRepository.findById(id);
    }

    /**
     * Save location category
     */
    public LocationCategory save(LocationCategory locationCategory) {
        return locationCategoryRepository.save(locationCategory);
    }

    /**
     * Delete location category by ID
     */
    public void deleteById(Integer id) {
        locationCategoryRepository.deleteById(id);
    }

    /**
     * Count total location categories
     */
    public long count() {
        return locationCategoryRepository.count();
    }

    /**
     * Check if location category exists by ID
     */
    public boolean existsById(Integer id) {
        return locationCategoryRepository.existsById(id);
    }

    /**
     * Find all location categories with pagination
     */
    public Page<LocationCategory> findAll(Pageable pageable) {
        return locationCategoryRepository.findAll(pageable);
    }

    // Basic finder methods
    public Optional<LocationCategory> findByName(String name) {
        return locationCategoryRepository.findByName(name);
    }

    public List<LocationCategory> findByNameContainingIgnoreCase(String name) {
        return locationCategoryRepository.findByNameContainingIgnoreCase(name);
    }

    public boolean existsByName(String name) {
        return locationCategoryRepository.existsByName(name);
    }

    // Status-based queries
    public List<LocationCategory> findByStatus(Boolean status) {
        return locationCategoryRepository.findByStatus(status);
    }

    public Page<LocationCategory> findByStatus(Boolean status, Pageable pageable) {
        return locationCategoryRepository.findByStatus(status, pageable);
    }

    public List<LocationCategory> findByStatusOrderByNameAsc(Boolean status) {
        return locationCategoryRepository.findByStatusOrderByNameAsc(status);
    }

    public List<LocationCategory> findByStatusOrderByCreatedAtDesc(Boolean status) {
        return locationCategoryRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    // Count queries
    public long countByStatus(Boolean status) {
        return locationCategoryRepository.countByStatus(status);
    }

    // Date-based queries
    public List<LocationCategory> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return locationCategoryRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<LocationCategory> findByUpdatedAtAfter(LocalDateTime date) {
        return locationCategoryRepository.findByUpdatedAtAfter(date);
    }

    public List<LocationCategory> findByCreatedAtAfter(LocalDateTime date) {
        return locationCategoryRepository.findByCreatedAtAfter(date);
    }

    // Search and filtering
    public Page<LocationCategory> findWithFilters(String name, Boolean status, Pageable pageable) {
        return locationCategoryRepository.findWithFilters(name, status, pageable);
    }

    public List<LocationCategory> searchByName(String searchText, Boolean status) {
        return locationCategoryRepository.searchByName(searchText, status);
    }

    // Advanced queries with relationships
    public Optional<LocationCategory> findByIdWithLocations(Integer id) {
        return locationCategoryRepository.findByIdWithLocations(id);
    }

    public List<LocationCategory> findByStatusWithActiveLocations(Boolean status, Boolean locationActive) {
        return locationCategoryRepository.findByStatusWithActiveLocations(status, locationActive);
    }

    // Statistics queries
    public List<Object[]> findCategoriesWithLocationCount(Boolean locationActive) {
        return locationCategoryRepository.findCategoriesWithLocationCount(locationActive);
    }

    public List<Object[]> findCategoriesWithLocationCountByStatus(Boolean status, Boolean locationActive) {
        return locationCategoryRepository.findCategoriesWithLocationCountByStatus(status, locationActive);
    }

    public long countActiveLocationsByCategoryId(Integer categoryId, Boolean locationActive) {
        return locationCategoryRepository.countActiveLocationsByCategoryId(categoryId, locationActive);
    }

    // Validation queries
    public boolean existsByNameAndIdNot(String name, Integer id) {
        return locationCategoryRepository.existsByNameAndIdNot(name, id);
    }

    // Custom business logic queries
    public List<LocationCategory> findActiveCategoriesOrderedByLocationCount() {
        return locationCategoryRepository.findActiveCategoriesOrderedByLocationCount();
    }

    public List<LocationCategory> findActiveCategoriesWithActiveLocations() {
        return locationCategoryRepository.findActiveCategoriesWithActiveLocations();
    }

    public List<LocationCategory> findActiveCategoriesWithoutActiveLocations() {
        return locationCategoryRepository.findActiveCategoriesWithoutActiveLocations();
    }

    public List<LocationCategory> findActiveCategoriesByCountry(Integer countryId) {
        return locationCategoryRepository.findActiveCategoriesByCountry(countryId);
    }

    public List<LocationCategory> findActiveCategoriesByRegion(Integer regionId) {
        return locationCategoryRepository.findActiveCategoriesByRegion(regionId);
    }

    public List<LocationCategory> findActiveCategoriesOrderedByAveragePopularity() {
        return locationCategoryRepository.findActiveCategoriesOrderedByAveragePopularity();
    }
}
