package com.williamtravel.app.service;

import com.williamtravel.app.entity.AccommodationCategory;
import com.williamtravel.app.repository.AccommodationCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for AccommodationCategory entity operations
 */
@Service
@Transactional
public class AccommodationCategoryService {

    @Autowired
    private AccommodationCategoryRepository accommodationCategoryRepository;

    /**
     * Find all accommodation categories
     */
    public List<AccommodationCategory> findAll() {
        return accommodationCategoryRepository.findAll();
    }

    /**
     * Find accommodation category by ID
     */
    public Optional<AccommodationCategory> findById(Integer id) {
        return accommodationCategoryRepository.findById(id);
    }

    /**
     * Save accommodation category
     */
    public AccommodationCategory save(AccommodationCategory accommodationCategory) {
        return accommodationCategoryRepository.save(accommodationCategory);
    }

    /**
     * Delete accommodation category by ID
     */
    public void deleteById(Integer id) {
        accommodationCategoryRepository.deleteById(id);
    }

    /**
     * Find accommodation category by name
     */
    public Optional<AccommodationCategory> findByName(String name) {
        return accommodationCategoryRepository.findByName(name);
    }

    /**
     * Find accommodation categories by name containing (case insensitive)
     */
    public List<AccommodationCategory> findByNameContainingIgnoreCase(String name) {
        return accommodationCategoryRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Check if accommodation category exists by name
     */
    public boolean existsByName(String name) {
        return accommodationCategoryRepository.existsByName(name);
    }

    /**
     * Find accommodation categories by status
     */
    public List<AccommodationCategory> findByStatus(Boolean status) {
        return accommodationCategoryRepository.findByStatus(status);
    }

    /**
     * Find accommodation categories by status with pagination
     */
    public Page<AccommodationCategory> findByStatus(Boolean status, Pageable pageable) {
        return accommodationCategoryRepository.findByStatus(status, pageable);
    }

    /**
     * Find accommodation categories by status ordered by name ascending
     */
    public List<AccommodationCategory> findByStatusOrderByNameAsc(Boolean status) {
        return accommodationCategoryRepository.findByStatusOrderByNameAsc(status);
    }

    /**
     * Find accommodation categories by status ordered by creation date descending
     */
    public List<AccommodationCategory> findByStatusOrderByCreatedAtDesc(Boolean status) {
        return accommodationCategoryRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    /**
     * Count accommodation categories by status
     */
    public long countByStatus(Boolean status) {
        return accommodationCategoryRepository.countByStatus(status);
    }

    /**
     * Find accommodation categories created between dates
     */
    public List<AccommodationCategory> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return accommodationCategoryRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * Find accommodation categories updated after date
     */
    public List<AccommodationCategory> findByUpdatedAtAfter(LocalDateTime date) {
        return accommodationCategoryRepository.findByUpdatedAtAfter(date);
    }

    /**
     * Find accommodation categories created after date
     */
    public List<AccommodationCategory> findByCreatedAtAfter(LocalDateTime date) {
        return accommodationCategoryRepository.findByCreatedAtAfter(date);
    }

    /**
     * Find accommodation categories with filters
     */
    public Page<AccommodationCategory> findWithFilters(String name, Boolean status, Pageable pageable) {
        return accommodationCategoryRepository.findWithFilters(name, status, pageable);
    }

    /**
     * Search accommodation categories by name and status
     */
    public List<AccommodationCategory> searchByName(String searchText, Boolean status) {
        return accommodationCategoryRepository.searchByName(searchText, status);
    }

    /**
     * Find accommodation category by ID with accommodations
     */
    public Optional<AccommodationCategory> findByIdWithAccommodations(Integer id) {
        return accommodationCategoryRepository.findByIdWithAccommodations(id);
    }

    /**
     * Find accommodation categories by status with active accommodations
     */
    public List<AccommodationCategory> findByStatusWithActiveAccommodations(Boolean status, Boolean accommodationActive) {
        return accommodationCategoryRepository.findByStatusWithActiveAccommodations(status, accommodationActive);
    }

    /**
     * Find accommodation categories with accommodation count
     */
    public List<Object[]> findCategoriesWithAccommodationCount(Boolean accommodationActive) {
        return accommodationCategoryRepository.findCategoriesWithAccommodationCount(accommodationActive);
    }

    /**
     * Find accommodation categories with accommodation count by status
     */
    public List<Object[]> findCategoriesWithAccommodationCountByStatus(Boolean status, Boolean accommodationActive) {
        return accommodationCategoryRepository.findCategoriesWithAccommodationCountByStatus(status, accommodationActive);
    }

    /**
     * Count active accommodations by category ID
     */
    public long countActiveAccommodationsByCategoryId(Integer categoryId, Boolean accommodationActive) {
        return accommodationCategoryRepository.countActiveAccommodationsByCategoryId(categoryId, accommodationActive);
    }

    /**
     * Find accommodation categories with average rating
     */
    public List<Object[]> findCategoriesWithAverageRating(Boolean status, Boolean accommodationActive) {
        return accommodationCategoryRepository.findCategoriesWithAverageRating(status, accommodationActive);
    }

    /**
     * Check if accommodation category exists by name and not ID
     */
    public boolean existsByNameAndIdNot(String name, Integer id) {
        return accommodationCategoryRepository.existsByNameAndIdNot(name, id);
    }

    /**
     * Find active accommodation categories ordered by accommodation count
     */
    public List<AccommodationCategory> findActiveCategoriesOrderedByAccommodationCount() {
        return accommodationCategoryRepository.findActiveCategoriesOrderedByAccommodationCount();
    }

    /**
     * Find active accommodation categories with active accommodations
     */
    public List<AccommodationCategory> findActiveCategoriesWithActiveAccommodations() {
        return accommodationCategoryRepository.findActiveCategoriesWithActiveAccommodations();
    }

    /**
     * Find active accommodation categories without active accommodations
     */
    public List<AccommodationCategory> findActiveCategoriesWithoutActiveAccommodations() {
        return accommodationCategoryRepository.findActiveCategoriesWithoutActiveAccommodations();
    }

    /**
     * Find active accommodation categories by country
     */
    public List<AccommodationCategory> findActiveCategoriesByCountry(Integer countryId) {
        return accommodationCategoryRepository.findActiveCategoriesByCountry(countryId);
    }

    /**
     * Find active accommodation categories by region
     */
    public List<AccommodationCategory> findActiveCategoriesByRegion(Integer regionId) {
        return accommodationCategoryRepository.findActiveCategoriesByRegion(regionId);
    }

    /**
     * Find active accommodation categories ordered by average rating
     */
    public List<AccommodationCategory> findActiveCategoriesOrderedByAverageRating() {
        return accommodationCategoryRepository.findActiveCategoriesOrderedByAverageRating();
    }

    /**
     * Find active accommodation categories with high-rated accommodations
     */
    public List<AccommodationCategory> findActiveCategoriesWithHighRatedAccommodations(Double minRating) {
        return accommodationCategoryRepository.findActiveCategoriesWithHighRatedAccommodations(minRating);
    }

    /**
     * Count total accommodation categories
     */
    public long count() {
        return accommodationCategoryRepository.count();
    }

    /**
     * Check if accommodation category exists by ID
     */
    public boolean existsById(Integer id) {
        return accommodationCategoryRepository.existsById(id);
    }
}
