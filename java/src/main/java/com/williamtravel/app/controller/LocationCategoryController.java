package com.williamtravel.app.controller;

import com.williamtravel.app.entity.LocationCategory;
import com.williamtravel.app.service.LocationCategoryService;
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
 * REST Controller for LocationCategory operations
 */
@RestController
@RequestMapping("/api/location-categories")
@CrossOrigin(origins = "*")
public class LocationCategoryController {

    @Autowired
    private LocationCategoryService locationCategoryService;

    /**
     * Get all location categories
     */
    @GetMapping
    public ResponseEntity<List<LocationCategory>> getAllLocationCategories() {
        List<LocationCategory> categories = locationCategoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<LocationCategory> getLocationCategoryById(@PathVariable Integer id) {
        Optional<LocationCategory> category = locationCategoryService.findById(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new location category
     */
    @PostMapping
    public ResponseEntity<LocationCategory> createLocationCategory(@RequestBody LocationCategory category) {
        LocationCategory savedCategory = locationCategoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    /**
     * Update location category
     */
    @PutMapping("/{id}")
    public ResponseEntity<LocationCategory> updateLocationCategory(@PathVariable Integer id, @RequestBody LocationCategory category) {
        if (!locationCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        category.setId(id);
        LocationCategory updatedCategory = locationCategoryService.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Delete location category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocationCategory(@PathVariable Integer id) {
        if (!locationCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        locationCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total location categories
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countLocationCategories() {
        long count = locationCategoryService.count();
        return ResponseEntity.ok(count);
    }

    /**
     * Get all location categories with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<LocationCategory>> getAllLocationCategoriesPaginated(Pageable pageable) {
        Page<LocationCategory> categories = locationCategoryService.findAll(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location category by name
     */
    @GetMapping("/by-name/{name}")
    public ResponseEntity<LocationCategory> getLocationCategoryByName(@PathVariable String name) {
        Optional<LocationCategory> category = locationCategoryService.findByName(name);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search location categories by name containing text (case insensitive)
     */
    @GetMapping("/search")
    public ResponseEntity<List<LocationCategory>> searchLocationCategoriesByName(@RequestParam String name) {
        List<LocationCategory> categories = locationCategoryService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(categories);
    }

    /**
     * Check if location category exists by name
     */
    @GetMapping("/exists/by-name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = locationCategoryService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get location categories by status
     */
    @GetMapping("/by-status")
    public ResponseEntity<List<LocationCategory>> getLocationCategoriesByStatus(@RequestParam Boolean status) {
        List<LocationCategory> categories = locationCategoryService.findByStatus(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location categories by status with pagination
     */
    @GetMapping("/by-status/paginated")
    public ResponseEntity<Page<LocationCategory>> getLocationCategoriesByStatusPaginated(
            @RequestParam Boolean status, Pageable pageable) {
        Page<LocationCategory> categories = locationCategoryService.findByStatus(status, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location categories by status ordered by name ascending
     */
    @GetMapping("/by-status/ordered-by-name")
    public ResponseEntity<List<LocationCategory>> getLocationCategoriesByStatusOrderedByName(@RequestParam Boolean status) {
        List<LocationCategory> categories = locationCategoryService.findByStatusOrderByNameAsc(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location categories by status ordered by created date descending
     */
    @GetMapping("/by-status/ordered-by-created")
    public ResponseEntity<List<LocationCategory>> getLocationCategoriesByStatusOrderedByCreated(@RequestParam Boolean status) {
        List<LocationCategory> categories = locationCategoryService.findByStatusOrderByCreatedAtDesc(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Count location categories by status
     */
    @GetMapping("/count/by-status")
    public ResponseEntity<Long> countLocationCategoriesByStatus(@RequestParam Boolean status) {
        long count = locationCategoryService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    /**
     * Get location categories created between dates
     */
    @GetMapping("/by-created-between")
    public ResponseEntity<List<LocationCategory>> getLocationCategoriesByCreatedBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<LocationCategory> categories = locationCategoryService.findByCreatedAtBetween(startDate, endDate);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location categories updated after date
     */
    @GetMapping("/by-updated-after")
    public ResponseEntity<List<LocationCategory>> getLocationCategoriesByUpdatedAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<LocationCategory> categories = locationCategoryService.findByUpdatedAtAfter(date);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location categories created after date
     */
    @GetMapping("/by-created-after")
    public ResponseEntity<List<LocationCategory>> getLocationCategoriesByCreatedAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<LocationCategory> categories = locationCategoryService.findByCreatedAtAfter(date);
        return ResponseEntity.ok(categories);
    }

    /**
     * Search location categories with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<LocationCategory>> findWithFilters(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean status,
            Pageable pageable) {
        Page<LocationCategory> categories = locationCategoryService.findWithFilters(name, status, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Search location categories by name with status filter
     */
    @GetMapping("/search-by-name")
    public ResponseEntity<List<LocationCategory>> searchByName(
            @RequestParam String searchText,
            @RequestParam(required = false) Boolean status) {
        List<LocationCategory> categories = locationCategoryService.searchByName(searchText, status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get location category by ID with associated locations
     */
    @GetMapping("/{id}/with-locations")
    public ResponseEntity<LocationCategory> getLocationCategoryWithLocations(@PathVariable Integer id) {
        Optional<LocationCategory> category = locationCategoryService.findByIdWithLocations(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get location categories by status with active locations
     */
    @GetMapping("/by-status/with-active-locations")
    public ResponseEntity<List<LocationCategory>> getLocationCategoriesByStatusWithActiveLocations(
            @RequestParam Boolean status,
            @RequestParam Boolean locationActive) {
        List<LocationCategory> categories = locationCategoryService.findByStatusWithActiveLocations(status, locationActive);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories with location count statistics
     */
    @GetMapping("/statistics/with-location-count")
    public ResponseEntity<List<Object[]>> getCategoriesWithLocationCount(@RequestParam(required = false) Boolean locationActive) {
        List<Object[]> statistics = locationCategoryService.findCategoriesWithLocationCount(locationActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get categories with location count by status
     */
    @GetMapping("/statistics/with-location-count-by-status")
    public ResponseEntity<List<Object[]>> getCategoriesWithLocationCountByStatus(
            @RequestParam Boolean status,
            @RequestParam(required = false) Boolean locationActive) {
        List<Object[]> statistics = locationCategoryService.findCategoriesWithLocationCountByStatus(status, locationActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Count active locations by category ID
     */
    @GetMapping("/{categoryId}/count-active-locations")
    public ResponseEntity<Long> countActiveLocationsByCategoryId(
            @PathVariable Integer categoryId,
            @RequestParam(required = false) Boolean locationActive) {
        long count = locationCategoryService.countActiveLocationsByCategoryId(categoryId, locationActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Check if category name exists excluding current ID
     */
    @GetMapping("/exists/by-name-except-id")
    public ResponseEntity<Boolean> existsByNameAndIdNot(@RequestParam String name, @RequestParam Integer id) {
        boolean exists = locationCategoryService.existsByNameAndIdNot(name, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get active categories ordered by location count
     */
    @GetMapping("/active/ordered-by-location-count")
    public ResponseEntity<List<LocationCategory>> getActiveCategoriesOrderedByLocationCount() {
        List<LocationCategory> categories = locationCategoryService.findActiveCategoriesOrderedByLocationCount();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories with active locations
     */
    @GetMapping("/active/with-active-locations")
    public ResponseEntity<List<LocationCategory>> getActiveCategoriesWithActiveLocations() {
        List<LocationCategory> categories = locationCategoryService.findActiveCategoriesWithActiveLocations();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories without active locations
     */
    @GetMapping("/active/without-active-locations")
    public ResponseEntity<List<LocationCategory>> getActiveCategoriesWithoutActiveLocations() {
        List<LocationCategory> categories = locationCategoryService.findActiveCategoriesWithoutActiveLocations();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories by country
     */
    @GetMapping("/active/by-country/{countryId}")
    public ResponseEntity<List<LocationCategory>> getActiveCategoriesByCountry(@PathVariable Integer countryId) {
        List<LocationCategory> categories = locationCategoryService.findActiveCategoriesByCountry(countryId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories by region
     */
    @GetMapping("/active/by-region/{regionId}")
    public ResponseEntity<List<LocationCategory>> getActiveCategoriesByRegion(@PathVariable Integer regionId) {
        List<LocationCategory> categories = locationCategoryService.findActiveCategoriesByRegion(regionId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get active categories ordered by average popularity
     */
    @GetMapping("/active/ordered-by-popularity")
    public ResponseEntity<List<LocationCategory>> getActiveCategoriesOrderedByAveragePopularity() {
        List<LocationCategory> categories = locationCategoryService.findActiveCategoriesOrderedByAveragePopularity();
        return ResponseEntity.ok(categories);
    }
}
