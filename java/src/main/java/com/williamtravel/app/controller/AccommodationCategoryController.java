package com.williamtravel.app.controller;

import com.williamtravel.app.entity.AccommodationCategory;
import com.williamtravel.app.service.AccommodationCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for AccommodationCategory operations
 */
@RestController
@RequestMapping("/api/accommodation-categories")
@CrossOrigin(origins = "*")
public class AccommodationCategoryController {

    @Autowired
    private AccommodationCategoryService accommodationCategoryService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all accommodation categories
     */
    @GetMapping
    public ResponseEntity<List<AccommodationCategory>> getAllAccommodationCategories() {
        List<AccommodationCategory> categories = accommodationCategoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get accommodation category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccommodationCategory> getAccommodationCategoryById(@PathVariable Integer id) {
        Optional<AccommodationCategory> category = accommodationCategoryService.findById(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new accommodation category
     */
    @PostMapping
    public ResponseEntity<AccommodationCategory> createAccommodationCategory(@RequestBody AccommodationCategory category) {
        AccommodationCategory savedCategory = accommodationCategoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    /**
     * Update accommodation category
     */
    @PutMapping("/{id}")
    public ResponseEntity<AccommodationCategory> updateAccommodationCategory(@PathVariable Integer id, @RequestBody AccommodationCategory category) {
        if (!accommodationCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        category.setId(id);
        AccommodationCategory updatedCategory = accommodationCategoryService.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Delete accommodation category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccommodationCategory(@PathVariable Integer id) {
        if (!accommodationCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        accommodationCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total accommodation categories
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countAccommodationCategories() {
        long count = accommodationCategoryService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    // Basic finder methods
    /**
     * Get accommodation category by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<AccommodationCategory> getAccommodationCategoryByName(@PathVariable String name) {
        Optional<AccommodationCategory> category = accommodationCategoryService.findByName(name);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search accommodation categories by name containing text
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<AccommodationCategory>> searchByNameContaining(@RequestParam String name) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(categories);
    }

    /**
     * Check if accommodation category exists by name
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = accommodationCategoryService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if accommodation category exists by name and not ID
     */
    @GetMapping("/exists/name/{name}/not-id/{id}")
    public ResponseEntity<Boolean> existsByNameAndIdNot(@PathVariable String name, @PathVariable Integer id) {
        boolean exists = accommodationCategoryService.existsByNameAndIdNot(name, id);
        return ResponseEntity.ok(exists);
    }

    // Status-based queries
    /**
     * Get accommodation categories by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AccommodationCategory>> getAccommodationCategoriesByStatus(@PathVariable Boolean status) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByStatus(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get accommodation categories by status with pagination
     */
    @GetMapping("/status/{status}/page")
    public ResponseEntity<Page<AccommodationCategory>> getAccommodationCategoriesByStatusPage(@PathVariable Boolean status, Pageable pageable) {
        Page<AccommodationCategory> categories = accommodationCategoryService.findByStatus(status, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get accommodation categories by status ordered by name
     */
    @GetMapping("/status/{status}/ordered-by-name")
    public ResponseEntity<List<AccommodationCategory>> getAccommodationCategoriesByStatusOrderByName(@PathVariable Boolean status) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByStatusOrderByNameAsc(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get accommodation categories by status ordered by creation date
     */
    @GetMapping("/status/{status}/ordered-by-creation")
    public ResponseEntity<List<AccommodationCategory>> getAccommodationCategoriesByStatusOrderByCreation(@PathVariable Boolean status) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByStatusOrderByCreatedAtDesc(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Count accommodation categories by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countAccommodationCategoriesByStatus(@PathVariable Boolean status) {
        long count = accommodationCategoryService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    // Date-based queries
    /**
     * Get accommodation categories created between dates
     */
    @GetMapping("/created-between")
    public ResponseEntity<List<AccommodationCategory>> getAccommodationCategoriesCreatedBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByCreatedAtBetween(startDate, endDate);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get accommodation categories updated after date
     */
    @GetMapping("/updated-after")
    public ResponseEntity<List<AccommodationCategory>> getAccommodationCategoriesUpdatedAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByUpdatedAtAfter(date);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get accommodation categories created after date
     */
    @GetMapping("/created-after")
    public ResponseEntity<List<AccommodationCategory>> getAccommodationCategoriesCreatedAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByCreatedAtAfter(date);
        return ResponseEntity.ok(categories);
    }

    // Search and filtering
    /**
     * Get accommodation categories with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<AccommodationCategory>> getAccommodationCategoriesWithFilters(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean status,
            Pageable pageable) {
        Page<AccommodationCategory> categories = accommodationCategoryService.findWithFilters(name, status, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Search accommodation categories by name and status
     */
    @GetMapping("/search")
    public ResponseEntity<List<AccommodationCategory>> searchAccommodationCategories(
            @RequestParam String searchText,
            @RequestParam(required = false) Boolean status) {
        List<AccommodationCategory> categories = accommodationCategoryService.searchByName(searchText, status);
        return ResponseEntity.ok(categories);
    }

    // Accommodation relationship queries
    /**
     * Get accommodation category by ID with accommodations
     */
    @GetMapping("/{id}/with-accommodations")
    public ResponseEntity<AccommodationCategory> getAccommodationCategoryByIdWithAccommodations(@PathVariable Integer id) {
        Optional<AccommodationCategory> category = accommodationCategoryService.findByIdWithAccommodations(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get accommodation categories by status with active accommodations
     */
    @GetMapping("/status/{status}/with-active-accommodations")
    public ResponseEntity<List<AccommodationCategory>> getAccommodationCategoriesByStatusWithActiveAccommodations(
            @PathVariable Boolean status,
            @RequestParam Boolean accommodationActive) {
        List<AccommodationCategory> categories = accommodationCategoryService.findByStatusWithActiveAccommodations(status, accommodationActive);
        return ResponseEntity.ok(categories);
    }

    // Statistical queries with accommodation counts
    /**
     * Get categories with accommodation count
     */
    @GetMapping("/with-accommodation-count")
    public ResponseEntity<List<Object[]>> getCategoriesWithAccommodationCount(@RequestParam Boolean accommodationActive) {
        List<Object[]> results = accommodationCategoryService.findCategoriesWithAccommodationCount(accommodationActive);
        return ResponseEntity.ok(results);
    }

    /**
     * Get categories with accommodation count by status
     */
    @GetMapping("/with-accommodation-count/status/{status}")
    public ResponseEntity<List<Object[]>> getCategoriesWithAccommodationCountByStatus(
            @PathVariable Boolean status,
            @RequestParam Boolean accommodationActive) {
        List<Object[]> results = accommodationCategoryService.findCategoriesWithAccommodationCountByStatus(status, accommodationActive);
        return ResponseEntity.ok(results);
    }

    /**
     * Count active accommodations by category ID
     */
    @GetMapping("/{categoryId}/count-accommodations")
    public ResponseEntity<Long> countActiveAccommodationsByCategoryId(
            @PathVariable Integer categoryId,
            @RequestParam Boolean accommodationActive) {
        long count = accommodationCategoryService.countActiveAccommodationsByCategoryId(categoryId, accommodationActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Get categories with average rating
     */
    @GetMapping("/with-average-rating")
    public ResponseEntity<List<Object[]>> getCategoriesWithAverageRating(
            @RequestParam Boolean status,
            @RequestParam Boolean accommodationActive) {
        List<Object[]> results = accommodationCategoryService.findCategoriesWithAverageRating(status, accommodationActive);
        return ResponseEntity.ok(results);
    }

    // Active category specific queries
    /**
     * Get active categories ordered by accommodation count
     */
    @GetMapping("/active/ordered-by-accommodation-count")
    public ResponseEntity<List<AccommodationCategory>> getActiveCategoriesOrderedByAccommodationCount() {
        List<AccommodationCategory> categories = accommodationCategoryService.findActiveCategoriesOrderedByAccommodationCount();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories with active accommodations
     */
    @GetMapping("/active/with-active-accommodations")
    public ResponseEntity<List<AccommodationCategory>> getActiveCategoriesWithActiveAccommodations() {
        List<AccommodationCategory> categories = accommodationCategoryService.findActiveCategoriesWithActiveAccommodations();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories without active accommodations
     */
    @GetMapping("/active/without-active-accommodations")
    public ResponseEntity<List<AccommodationCategory>> getActiveCategoriesWithoutActiveAccommodations() {
        List<AccommodationCategory> categories = accommodationCategoryService.findActiveCategoriesWithoutActiveAccommodations();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories by country
     */
    @GetMapping("/active/country/{countryId}")
    public ResponseEntity<List<AccommodationCategory>> getActiveCategoriesByCountry(@PathVariable Integer countryId) {
        List<AccommodationCategory> categories = accommodationCategoryService.findActiveCategoriesByCountry(countryId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories by region
     */
    @GetMapping("/active/region/{regionId}")
    public ResponseEntity<List<AccommodationCategory>> getActiveCategoriesByRegion(@PathVariable Integer regionId) {
        List<AccommodationCategory> categories = accommodationCategoryService.findActiveCategoriesByRegion(regionId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories ordered by average rating
     */
    @GetMapping("/active/ordered-by-average-rating")
    public ResponseEntity<List<AccommodationCategory>> getActiveCategoriesOrderedByAverageRating() {
        List<AccommodationCategory> categories = accommodationCategoryService.findActiveCategoriesOrderedByAverageRating();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories with high-rated accommodations
     */
    @GetMapping("/active/with-high-rated-accommodations")
    public ResponseEntity<List<AccommodationCategory>> getActiveCategoriesWithHighRatedAccommodations(@RequestParam Double minRating) {
        List<AccommodationCategory> categories = accommodationCategoryService.findActiveCategoriesWithHighRatedAccommodations(minRating);
        return ResponseEntity.ok(categories);
    }
}
