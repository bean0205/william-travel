package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Region;
import com.williamtravel.app.service.RegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Region operations
 */
@RestController
@RequestMapping("/api/regions")
@CrossOrigin(origins = "*")
public class RegionController {

    @Autowired
    private RegionService regionService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all regions
     */
    @GetMapping
    public ResponseEntity<List<Region>> getAllRegions() {
        List<Region> regions = regionService.findAll();
        return ResponseEntity.ok(regions);
    }

    /**
     * Get region by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Region> getRegionById(@PathVariable Integer id) {
        Optional<Region> region = regionService.findById(id);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new region
     */
    @PostMapping
    public ResponseEntity<Region> createRegion(@RequestBody Region region) {
        Region savedRegion = regionService.save(region);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRegion);
    }

    /**
     * Update region
     */
    @PutMapping("/{id}")
    public ResponseEntity<Region> updateRegion(@PathVariable Integer id, @RequestBody Region region) {
        if (!regionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        region.setId(id);
        Region updatedRegion = regionService.save(region);
        return ResponseEntity.ok(updatedRegion);
    }

    /**
     * Delete region
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegion(@PathVariable Integer id) {
        if (!regionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        regionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total regions
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countRegions() {
        long count = regionService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    // Pagination
    /**
     * Get all regions with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Region>> getRegionsPage(Pageable pageable) {
        Page<Region> regions = regionService.findAll(pageable);
        return ResponseEntity.ok(regions);
    }

    // Basic finder methods
    /**
     * Get region by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Region> getRegionByCode(@PathVariable String code) {
        Optional<Region> region = regionService.findByCode(code);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get region by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Region> getRegionByName(@PathVariable String name) {
        Optional<Region> region = regionService.findByName(name);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search regions by name containing text (case insensitive)
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<Region>> searchRegionsByName(@RequestParam String name) {
        List<Region> regions = regionService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(regions);
    }

    /**
     * Check if region exists by code
     */
    @GetMapping("/exists/code/{code}")
    public ResponseEntity<Boolean> existsByCode(@PathVariable String code) {
        boolean exists = regionService.existsByCode(code);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if region exists by name
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = regionService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    // Status-based queries
    /**
     * Get regions by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Region>> getRegionsByStatus(@PathVariable Integer status) {
        List<Region> regions = regionService.findByStatus(status);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by status with pagination
     */
    @GetMapping("/status/{status}/page")
    public ResponseEntity<Page<Region>> getRegionsByStatusPage(@PathVariable Integer status, Pageable pageable) {
        Page<Region> regions = regionService.findByStatus(status, pageable);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by status ordered by name
     */
    @GetMapping("/status/{status}/ordered")
    public ResponseEntity<List<Region>> getRegionsByStatusOrderByName(@PathVariable Integer status) {
        List<Region> regions = regionService.findByStatusOrderByName(status);
        return ResponseEntity.ok(regions);
    }

    // Country relationship queries
    /**
     * Get regions by country ID
     */
    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<Region>> getRegionsByCountryId(@PathVariable Integer countryId) {
        List<Region> regions = regionService.findByCountryId(countryId);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by country ID with pagination
     */
    @GetMapping("/country/{countryId}/page")
    public ResponseEntity<Page<Region>> getRegionsByCountryIdPage(@PathVariable Integer countryId, Pageable pageable) {
        Page<Region> regions = regionService.findByCountryId(countryId, pageable);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by country ID and status
     */
    @GetMapping("/country/{countryId}/status/{status}")
    public ResponseEntity<List<Region>> getRegionsByCountryIdAndStatus(@PathVariable Integer countryId, @PathVariable Integer status) {
        List<Region> regions = regionService.findByCountryIdAndStatus(countryId, status);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by country ID and status with pagination
     */
    @GetMapping("/country/{countryId}/status/{status}/page")
    public ResponseEntity<Page<Region>> getRegionsByCountryIdAndStatusPage(@PathVariable Integer countryId, @PathVariable Integer status, Pageable pageable) {
        Page<Region> regions = regionService.findByCountryIdAndStatus(countryId, status, pageable);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by country ID with country details
     */
    @GetMapping("/country/{countryId}/with-country")
    public ResponseEntity<List<Region>> getRegionsByCountryIdWithCountry(@PathVariable Integer countryId) {
        List<Region> regions = regionService.findByCountryIdWithCountry(countryId);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by country ID and status with country details
     */
    @GetMapping("/country/{countryId}/status/{status}/with-country")
    public ResponseEntity<List<Region>> getRegionsByCountryIdAndStatusWithCountry(@PathVariable Integer countryId, @PathVariable Integer status) {
        List<Region> regions = regionService.findByCountryIdAndStatusWithCountry(countryId, status);
        return ResponseEntity.ok(regions);
    }

    // Count queries
    /**
     * Count regions by country ID
     */
    @GetMapping("/count/country/{countryId}")
    public ResponseEntity<Long> countRegionsByCountryId(@PathVariable Integer countryId) {
        long count = regionService.countByCountryId(countryId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count regions by country ID and status
     */
    @GetMapping("/count/country/{countryId}/status/{status}")
    public ResponseEntity<Long> countRegionsByCountryIdAndStatus(@PathVariable Integer countryId, @PathVariable Integer status) {
        long count = regionService.countByCountryIdAndStatus(countryId, status);
        return ResponseEntity.ok(count);
    }

    /**
     * Count regions by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countRegionsByStatus(@PathVariable Integer status) {
        long count = regionService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    // Search and filtering
    /**
     * Find regions with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<Region>> findRegionsWithFilters(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) Integer countryId,
            @RequestParam(required = false) Integer status,
            Pageable pageable) {
        Page<Region> regions = regionService.findWithFilters(name, code, countryId, status, pageable);
        return ResponseEntity.ok(regions);
    }

    /**
     * Search regions by name with country details
     */
    @GetMapping("/search/with-country")
    public ResponseEntity<List<Region>> searchRegionsByNameWithCountry(@RequestParam String name, @RequestParam Integer status) {
        List<Region> regions = regionService.searchByNameWithCountry(name, status);
        return ResponseEntity.ok(regions);
    }

    // Date-based queries
    /**
     * Get regions by created date
     */
    @GetMapping("/created-date/{date}")
    public ResponseEntity<List<Region>> getRegionsByCreatedDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Region> regions = regionService.findByCreatedDate(date);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by created date range
     */
    @GetMapping("/created-date-range")
    public ResponseEntity<List<Region>> getRegionsByCreatedDateBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Region> regions = regionService.findByCreatedDateBetween(startDate, endDate);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get regions by updated date
     */
    @GetMapping("/updated-date/{date}")
    public ResponseEntity<List<Region>> getRegionsByUpdatedDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Region> regions = regionService.findByUpdatedDate(date);
        return ResponseEntity.ok(regions);
    }

    // Advanced queries with relationships
    /**
     * Get region by ID with districts
     */
    @GetMapping("/{id}/with-districts")
    public ResponseEntity<Region> getRegionByIdWithDistricts(@PathVariable Integer id) {
        Optional<Region> region = regionService.findByIdWithDistricts(id);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get region by ID with locations
     */
    @GetMapping("/{id}/with-locations")
    public ResponseEntity<Region> getRegionByIdWithLocations(@PathVariable Integer id) {
        Optional<Region> region = regionService.findByIdWithLocations(id);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get region by ID with accommodations
     */
    @GetMapping("/{id}/with-accommodations")
    public ResponseEntity<Region> getRegionByIdWithAccommodations(@PathVariable Integer id) {
        Optional<Region> region = regionService.findByIdWithAccommodations(id);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get region by ID with foods
     */
    @GetMapping("/{id}/with-foods")
    public ResponseEntity<Region> getRegionByIdWithFoods(@PathVariable Integer id) {
        Optional<Region> region = regionService.findByIdWithFoods(id);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get region by ID with events
     */
    @GetMapping("/{id}/with-events")
    public ResponseEntity<Region> getRegionByIdWithEvents(@PathVariable Integer id) {
        Optional<Region> region = regionService.findByIdWithEvents(id);
        return region.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Statistics queries
    /**
     * Get regions with location count
     */
    @GetMapping("/statistics/location-count")
    public ResponseEntity<List<Object[]>> getRegionsWithLocationCount() {
        List<Object[]> statistics = regionService.findRegionsWithLocationCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get regions with accommodation count
     */
    @GetMapping("/statistics/accommodation-count")
    public ResponseEntity<List<Object[]>> getRegionsWithAccommodationCount() {
        List<Object[]> statistics = regionService.findRegionsWithAccommodationCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get regions with food count
     */
    @GetMapping("/statistics/food-count")
    public ResponseEntity<List<Object[]>> getRegionsWithFoodCount() {
        List<Object[]> statistics = regionService.findRegionsWithFoodCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get regions with event count
     */
    @GetMapping("/statistics/event-count")
    public ResponseEntity<List<Object[]>> getRegionsWithEventCount() {
        List<Object[]> statistics = regionService.findRegionsWithEventCount();
        return ResponseEntity.ok(statistics);
    }

    // Validation queries
    /**
     * Check if region code exists for different region ID
     */
    @GetMapping("/validate/code/{code}/exclude/{id}")
    public ResponseEntity<Boolean> existsByCodeAndIdNot(@PathVariable String code, @PathVariable Integer id) {
        boolean exists = regionService.existsByCodeAndIdNot(code, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if region name exists for different region ID
     */
    @GetMapping("/validate/name/{name}/exclude/{id}")
    public ResponseEntity<Boolean> existsByNameAndIdNot(@PathVariable String name, @PathVariable Integer id) {
        boolean exists = regionService.existsByNameAndIdNot(name, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if region code exists within country for different region ID
     */
    @GetMapping("/validate/country/{countryId}/code/{code}/exclude/{id}")
    public ResponseEntity<Boolean> existsByCountryIdAndCodeAndIdNot(@PathVariable Integer countryId, @PathVariable String code, @PathVariable Integer id) {
        boolean exists = regionService.existsByCountryIdAndCodeAndIdNot(countryId, code, id);
        return ResponseEntity.ok(exists);
    }

    // Custom business logic queries
    /**
     * Get active regions by country
     */
    @GetMapping("/active/country/{countryId}")
    public ResponseEntity<List<Region>> getActiveRegionsByCountry(@PathVariable Integer countryId) {
        List<Region> regions = regionService.findActiveRegionsByCountry(countryId);
        return ResponseEntity.ok(regions);
    }

    /**
     * Get active regions with background image
     */
    @GetMapping("/active/with-background-image")
    public ResponseEntity<List<Region>> getActiveRegionsWithBackgroundImage() {
        List<Region> regions = regionService.findActiveRegionsWithBackgroundImage();
        return ResponseEntity.ok(regions);
    }

    /**
     * Get active regions with logo
     */
    @GetMapping("/active/with-logo")
    public ResponseEntity<List<Region>> getActiveRegionsWithLogo() {
        List<Region> regions = regionService.findActiveRegionsWithLogo();
        return ResponseEntity.ok(regions);
    }
}
