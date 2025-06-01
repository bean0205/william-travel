package com.williamtravel.app.controller;

import com.williamtravel.app.entity.District;
import com.williamtravel.app.service.DistrictService;
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
 * REST Controller for District operations
 */
@RestController
@RequestMapping("/api/districts")
@CrossOrigin(origins = "*")
public class DistrictController {

    @Autowired
    private DistrictService districtService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all districts
     */
    @GetMapping
    public ResponseEntity<List<District>> getAllDistricts() {
        List<District> districts = districtService.findAll();
        return ResponseEntity.ok(districts);
    }

    /**
     * Get district by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<District> getDistrictById(@PathVariable Integer id) {
        Optional<District> district = districtService.findById(id);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new district
     */
    @PostMapping
    public ResponseEntity<District> createDistrict(@RequestBody District district) {
        District savedDistrict = districtService.save(district);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDistrict);
    }

    /**
     * Update district
     */
    @PutMapping("/{id}")
    public ResponseEntity<District> updateDistrict(@PathVariable Integer id, @RequestBody District district) {
        if (!districtService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        district.setId(id);
        District updatedDistrict = districtService.save(district);
        return ResponseEntity.ok(updatedDistrict);
    }

    /**
     * Delete district
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistrict(@PathVariable Integer id) {
        if (!districtService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        districtService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total districts
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countDistricts() {
        long count = districtService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    // Pagination
    /**
     * Get all districts with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<District>> getDistrictsPage(Pageable pageable) {
        Page<District> districts = districtService.findAll(pageable);
        return ResponseEntity.ok(districts);
    }

    // Basic finder methods
    /**
     * Get district by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<District> getDistrictByCode(@PathVariable String code) {
        Optional<District> district = districtService.findByCode(code);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get district by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<District> getDistrictByName(@PathVariable String name) {
        Optional<District> district = districtService.findByName(name);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search districts by name containing text (case insensitive)
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<District>> searchDistrictsByName(@RequestParam String name) {
        List<District> districts = districtService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(districts);
    }

    /**
     * Check if district exists by code
     */
    @GetMapping("/exists/code/{code}")
    public ResponseEntity<Boolean> existsByCode(@PathVariable String code) {
        boolean exists = districtService.existsByCode(code);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if district exists by name
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = districtService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    // Status-based queries
    /**
     * Get districts by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<District>> getDistrictsByStatus(@PathVariable Integer status) {
        List<District> districts = districtService.findByStatus(status);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by status with pagination
     */
    @GetMapping("/status/{status}/page")
    public ResponseEntity<Page<District>> getDistrictsByStatusPage(@PathVariable Integer status, Pageable pageable) {
        Page<District> districts = districtService.findByStatus(status, pageable);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by status ordered by name
     */
    @GetMapping("/status/{status}/ordered")
    public ResponseEntity<List<District>> getDistrictsByStatusOrderByName(@PathVariable Integer status) {
        List<District> districts = districtService.findByStatusOrderByName(status);
        return ResponseEntity.ok(districts);
    }

    // Region relationship queries
    /**
     * Get districts by region ID
     */
    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<District>> getDistrictsByRegionId(@PathVariable Integer regionId) {
        List<District> districts = districtService.findByRegionId(regionId);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by region ID with pagination
     */
    @GetMapping("/region/{regionId}/page")
    public ResponseEntity<Page<District>> getDistrictsByRegionIdPage(@PathVariable Integer regionId, Pageable pageable) {
        Page<District> districts = districtService.findByRegionId(regionId, pageable);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by region ID and status
     */
    @GetMapping("/region/{regionId}/status/{status}")
    public ResponseEntity<List<District>> getDistrictsByRegionIdAndStatus(@PathVariable Integer regionId, @PathVariable Integer status) {
        List<District> districts = districtService.findByRegionIdAndStatus(regionId, status);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by region ID and status with pagination
     */
    @GetMapping("/region/{regionId}/status/{status}/page")
    public ResponseEntity<Page<District>> getDistrictsByRegionIdAndStatusPage(@PathVariable Integer regionId, @PathVariable Integer status, Pageable pageable) {
        Page<District> districts = districtService.findByRegionIdAndStatus(regionId, status, pageable);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by region ID with region details
     */
    @GetMapping("/region/{regionId}/with-region")
    public ResponseEntity<List<District>> getDistrictsByRegionIdWithRegion(@PathVariable Integer regionId) {
        List<District> districts = districtService.findByRegionIdWithRegion(regionId);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by region ID and status with region and country details
     */
    @GetMapping("/region/{regionId}/status/{status}/with-hierarchy")
    public ResponseEntity<List<District>> getDistrictsByRegionIdAndStatusWithRegionAndCountry(@PathVariable Integer regionId, @PathVariable Integer status) {
        List<District> districts = districtService.findByRegionIdAndStatusWithRegionAndCountry(regionId, status);
        return ResponseEntity.ok(districts);
    }

    // Country-based queries
    /**
     * Get districts by country ID
     */
    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<District>> getDistrictsByCountryId(@PathVariable Integer countryId) {
        List<District> districts = districtService.findByCountryId(countryId);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by country ID and status
     */
    @GetMapping("/country/{countryId}/status/{status}")
    public ResponseEntity<List<District>> getDistrictsByCountryIdAndStatus(@PathVariable Integer countryId, @PathVariable Integer status) {
        List<District> districts = districtService.findByCountryIdAndStatus(countryId, status);
        return ResponseEntity.ok(districts);
    }

    // Count queries
    /**
     * Count districts by region ID
     */
    @GetMapping("/count/region/{regionId}")
    public ResponseEntity<Long> countDistrictsByRegionId(@PathVariable Integer regionId) {
        long count = districtService.countByRegionId(regionId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count districts by region ID and status
     */
    @GetMapping("/count/region/{regionId}/status/{status}")
    public ResponseEntity<Long> countDistrictsByRegionIdAndStatus(@PathVariable Integer regionId, @PathVariable Integer status) {
        long count = districtService.countByRegionIdAndStatus(regionId, status);
        return ResponseEntity.ok(count);
    }

    /**
     * Count districts by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countDistrictsByStatus(@PathVariable Integer status) {
        long count = districtService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    /**
     * Count districts by country ID
     */
    @GetMapping("/count/country/{countryId}")
    public ResponseEntity<Long> countDistrictsByCountryId(@PathVariable Integer countryId) {
        long count = districtService.countByCountryId(countryId);
        return ResponseEntity.ok(count);
    }

    // Search and filtering
    /**
     * Find districts with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<District>> findDistrictsWithFilters(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) Integer regionId,
            @RequestParam(required = false) Integer status,
            Pageable pageable) {
        Page<District> districts = districtService.findWithFilters(name, code, regionId, status, pageable);
        return ResponseEntity.ok(districts);
    }

    /**
     * Search districts by name with region and country details
     */
    @GetMapping("/search/with-hierarchy")
    public ResponseEntity<List<District>> searchDistrictsByNameWithRegionAndCountry(@RequestParam String name, @RequestParam Integer status) {
        List<District> districts = districtService.searchByNameWithRegionAndCountry(name, status);
        return ResponseEntity.ok(districts);
    }

    // Date-based queries
    /**
     * Get districts by created date
     */
    @GetMapping("/created-date/{date}")
    public ResponseEntity<List<District>> getDistrictsByCreatedDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<District> districts = districtService.findByCreatedDate(date);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by created date range
     */
    @GetMapping("/created-date-range")
    public ResponseEntity<List<District>> getDistrictsByCreatedDateBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<District> districts = districtService.findByCreatedDateBetween(startDate, endDate);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get districts by updated date
     */
    @GetMapping("/updated-date/{date}")
    public ResponseEntity<List<District>> getDistrictsByUpdatedDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<District> districts = districtService.findByUpdatedDate(date);
        return ResponseEntity.ok(districts);
    }

    // Advanced queries with relationships
    /**
     * Get district by ID with wards
     */
    @GetMapping("/{id}/with-wards")
    public ResponseEntity<District> getDistrictByIdWithWards(@PathVariable Integer id) {
        Optional<District> district = districtService.findByIdWithWards(id);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get district by ID with locations
     */
    @GetMapping("/{id}/with-locations")
    public ResponseEntity<District> getDistrictByIdWithLocations(@PathVariable Integer id) {
        Optional<District> district = districtService.findByIdWithLocations(id);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get district by ID with accommodations
     */
    @GetMapping("/{id}/with-accommodations")
    public ResponseEntity<District> getDistrictByIdWithAccommodations(@PathVariable Integer id) {
        Optional<District> district = districtService.findByIdWithAccommodations(id);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get district by ID with foods
     */
    @GetMapping("/{id}/with-foods")
    public ResponseEntity<District> getDistrictByIdWithFoods(@PathVariable Integer id) {
        Optional<District> district = districtService.findByIdWithFoods(id);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get district by ID with events
     */
    @GetMapping("/{id}/with-events")
    public ResponseEntity<District> getDistrictByIdWithEvents(@PathVariable Integer id) {
        Optional<District> district = districtService.findByIdWithEvents(id);
        return district.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // Statistics queries
    /**
     * Get districts with ward count
     */
    @GetMapping("/statistics/ward-count")
    public ResponseEntity<List<Object[]>> getDistrictsWithWardCount() {
        List<Object[]> statistics = districtService.findDistrictsWithWardCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get districts with location count
     */
    @GetMapping("/statistics/location-count")
    public ResponseEntity<List<Object[]>> getDistrictsWithLocationCount() {
        List<Object[]> statistics = districtService.findDistrictsWithLocationCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get districts with accommodation count
     */
    @GetMapping("/statistics/accommodation-count")
    public ResponseEntity<List<Object[]>> getDistrictsWithAccommodationCount() {
        List<Object[]> statistics = districtService.findDistrictsWithAccommodationCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get districts with food count
     */
    @GetMapping("/statistics/food-count")
    public ResponseEntity<List<Object[]>> getDistrictsWithFoodCount() {
        List<Object[]> statistics = districtService.findDistrictsWithFoodCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get districts with event count
     */
    @GetMapping("/statistics/event-count")
    public ResponseEntity<List<Object[]>> getDistrictsWithEventCount() {
        List<Object[]> statistics = districtService.findDistrictsWithEventCount();
        return ResponseEntity.ok(statistics);
    }

    // Validation queries
    /**
     * Check if district code exists for different district ID
     */
    @GetMapping("/validate/code/{code}/exclude/{id}")
    public ResponseEntity<Boolean> existsByCodeAndIdNot(@PathVariable String code, @PathVariable Integer id) {
        boolean exists = districtService.existsByCodeAndIdNot(code, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if district name exists for different district ID
     */
    @GetMapping("/validate/name/{name}/exclude/{id}")
    public ResponseEntity<Boolean> existsByNameAndIdNot(@PathVariable String name, @PathVariable Integer id) {
        boolean exists = districtService.existsByNameAndIdNot(name, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if district code exists within region for different district ID
     */
    @GetMapping("/validate/region/{regionId}/code/{code}/exclude/{id}")
    public ResponseEntity<Boolean> existsByRegionIdAndCodeAndIdNot(@PathVariable Integer regionId, @PathVariable String code, @PathVariable Integer id) {
        boolean exists = districtService.existsByRegionIdAndCodeAndIdNot(regionId, code, id);
        return ResponseEntity.ok(exists);
    }

    // Custom business logic queries
    /**
     * Get active districts by region
     */
    @GetMapping("/active/region/{regionId}")
    public ResponseEntity<List<District>> getActiveDistrictsByRegion(@PathVariable Integer regionId) {
        List<District> districts = districtService.findActiveDistrictsByRegion(regionId);
        return ResponseEntity.ok(districts);
    }

    /**
     * Get active districts with background image
     */
    @GetMapping("/active/with-background-image")
    public ResponseEntity<List<District>> getActiveDistrictsWithBackgroundImage() {
        List<District> districts = districtService.findActiveDistrictsWithBackgroundImage();
        return ResponseEntity.ok(districts);
    }

    /**
     * Get active districts with logo
     */
    @GetMapping("/active/with-logo")
    public ResponseEntity<List<District>> getActiveDistrictsWithLogo() {
        List<District> districts = districtService.findActiveDistrictsWithLogo();
        return ResponseEntity.ok(districts);
    }

    /**
     * Get active districts by country ordered by region
     */
    @GetMapping("/active/country/{countryId}/ordered-by-region")
    public ResponseEntity<List<District>> getActiveDistrictsByCountryOrderedByRegion(@PathVariable Integer countryId) {
        List<District> districts = districtService.findActiveDistrictsByCountryOrderedByRegion(countryId);
        return ResponseEntity.ok(districts);
    }
}
