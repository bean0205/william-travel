package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Ward;
import com.williamtravel.app.service.WardService;
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
 * REST Controller for Ward operations
 */
@RestController
@RequestMapping("/api/wards")
@CrossOrigin(origins = "*")
public class WardController {

    @Autowired
    private WardService wardService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all wards
     */
    @GetMapping
    public ResponseEntity<List<Ward>> getAllWards() {
        List<Ward> wards = wardService.findAll();
        return ResponseEntity.ok(wards);
    }

    /**
     * Get ward by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ward> getWardById(@PathVariable Integer id) {
        Optional<Ward> ward = wardService.findById(id);
        return ward.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new ward
     */
    @PostMapping
    public ResponseEntity<Ward> createWard(@RequestBody Ward ward) {
        Ward savedWard = wardService.save(ward);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedWard);
    }

    /**
     * Update ward
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ward> updateWard(@PathVariable Integer id, @RequestBody Ward ward) {
        if (!wardService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ward.setId(id);
        Ward updatedWard = wardService.save(ward);
        return ResponseEntity.ok(updatedWard);
    }

    /**
     * Delete ward
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWard(@PathVariable Integer id) {
        if (!wardService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        wardService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total wards
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countWards() {
        long count = wardService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    // Pagination
    /**
     * Get all wards with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Ward>> getWardsPage(Pageable pageable) {
        Page<Ward> wards = wardService.findAll(pageable);
        return ResponseEntity.ok(wards);
    }

    // Basic finder methods
    /**
     * Get ward by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Ward> getWardByCode(@PathVariable String code) {
        Optional<Ward> ward = wardService.findByCode(code);
        return ward.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get ward by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Ward> getWardByName(@PathVariable String name) {
        Optional<Ward> ward = wardService.findByName(name);
        return ward.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search wards by name containing text (case insensitive)
     */
    @GetMapping("/search/name")
    public ResponseEntity<List<Ward>> searchWardsByName(@RequestParam String name) {
        List<Ward> wards = wardService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(wards);
    }

    /**
     * Check if ward exists by code
     */
    @GetMapping("/exists/code/{code}")
    public ResponseEntity<Boolean> existsByCode(@PathVariable String code) {
        boolean exists = wardService.existsByCode(code);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if ward exists by name
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = wardService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    // Status-based queries
    /**
     * Get wards by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Ward>> getWardsByStatus(@PathVariable Integer status) {
        List<Ward> wards = wardService.findByStatus(status);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by status with pagination
     */
    @GetMapping("/status/{status}/page")
    public ResponseEntity<Page<Ward>> getWardsByStatusPage(@PathVariable Integer status, Pageable pageable) {
        Page<Ward> wards = wardService.findByStatus(status, pageable);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by status ordered by name
     */
    @GetMapping("/status/{status}/ordered")
    public ResponseEntity<List<Ward>> getWardsByStatusOrderByName(@PathVariable Integer status) {
        List<Ward> wards = wardService.findByStatusOrderByName(status);
        return ResponseEntity.ok(wards);
    }

    // District relationship queries
    /**
     * Get wards by district ID
     */
    @GetMapping("/district/{districtId}")
    public ResponseEntity<List<Ward>> getWardsByDistrictId(@PathVariable Integer districtId) {
        List<Ward> wards = wardService.findByDistrictId(districtId);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by district ID with pagination
     */
    @GetMapping("/district/{districtId}/page")
    public ResponseEntity<Page<Ward>> getWardsByDistrictIdPage(@PathVariable Integer districtId, Pageable pageable) {
        Page<Ward> wards = wardService.findByDistrictId(districtId, pageable);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by district ID and status
     */
    @GetMapping("/district/{districtId}/status/{status}")
    public ResponseEntity<List<Ward>> getWardsByDistrictIdAndStatus(@PathVariable Integer districtId, @PathVariable Integer status) {
        List<Ward> wards = wardService.findByDistrictIdAndStatus(districtId, status);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by district ID and status with pagination
     */
    @GetMapping("/district/{districtId}/status/{status}/page")
    public ResponseEntity<Page<Ward>> getWardsByDistrictIdAndStatusPage(@PathVariable Integer districtId, @PathVariable Integer status, Pageable pageable) {
        Page<Ward> wards = wardService.findByDistrictIdAndStatus(districtId, status, pageable);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by district ID with district details
     */
    @GetMapping("/district/{districtId}/with-district")
    public ResponseEntity<List<Ward>> getWardsByDistrictIdWithDistrict(@PathVariable Integer districtId) {
        List<Ward> wards = wardService.findByDistrictIdWithDistrict(districtId);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by district ID and status with full hierarchy
     */
    @GetMapping("/district/{districtId}/status/{status}/full-hierarchy")
    public ResponseEntity<List<Ward>> getWardsByDistrictIdAndStatusWithFullHierarchy(@PathVariable Integer districtId, @PathVariable Integer status) {
        List<Ward> wards = wardService.findByDistrictIdAndStatusWithFullHierarchy(districtId, status);
        return ResponseEntity.ok(wards);
    }

    // Region-based queries
    /**
     * Get wards by region ID
     */
    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Ward>> getWardsByRegionId(@PathVariable Integer regionId) {
        List<Ward> wards = wardService.findByRegionId(regionId);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by region ID and status
     */
    @GetMapping("/region/{regionId}/status/{status}")
    public ResponseEntity<List<Ward>> getWardsByRegionIdAndStatus(@PathVariable Integer regionId, @PathVariable Integer status) {
        List<Ward> wards = wardService.findByRegionIdAndStatus(regionId, status);
        return ResponseEntity.ok(wards);
    }

    // Country-based queries
    /**
     * Get wards by country ID
     */
    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<Ward>> getWardsByCountryId(@PathVariable Integer countryId) {
        List<Ward> wards = wardService.findByCountryId(countryId);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by country ID and status
     */
    @GetMapping("/country/{countryId}/status/{status}")
    public ResponseEntity<List<Ward>> getWardsByCountryIdAndStatus(@PathVariable Integer countryId, @PathVariable Integer status) {
        List<Ward> wards = wardService.findByCountryIdAndStatus(countryId, status);
        return ResponseEntity.ok(wards);
    }

    // Count queries
    /**
     * Count wards by district ID
     */
    @GetMapping("/count/district/{districtId}")
    public ResponseEntity<Long> countWardsByDistrictId(@PathVariable Integer districtId) {
        long count = wardService.countByDistrictId(districtId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count wards by district ID and status
     */
    @GetMapping("/count/district/{districtId}/status/{status}")
    public ResponseEntity<Long> countWardsByDistrictIdAndStatus(@PathVariable Integer districtId, @PathVariable Integer status) {
        long count = wardService.countByDistrictIdAndStatus(districtId, status);
        return ResponseEntity.ok(count);
    }

    /**
     * Count wards by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countWardsByStatus(@PathVariable Integer status) {
        long count = wardService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    /**
     * Count wards by region ID
     */
    @GetMapping("/count/region/{regionId}")
    public ResponseEntity<Long> countWardsByRegionId(@PathVariable Integer regionId) {
        long count = wardService.countByRegionId(regionId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count wards by country ID
     */
    @GetMapping("/count/country/{countryId}")
    public ResponseEntity<Long> countWardsByCountryId(@PathVariable Integer countryId) {
        long count = wardService.countByCountryId(countryId);
        return ResponseEntity.ok(count);
    }

    // Search and filtering
    /**
     * Find wards with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<Ward>> findWardsWithFilters(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) Integer districtId,
            @RequestParam(required = false) Integer status,
            Pageable pageable) {
        Page<Ward> wards = wardService.findWithFilters(name, code, districtId, status, pageable);
        return ResponseEntity.ok(wards);
    }

    /**
     * Search wards by name with full hierarchy
     */
    @GetMapping("/search/full-hierarchy")
    public ResponseEntity<List<Ward>> searchWardsByNameWithFullHierarchy(@RequestParam String name, @RequestParam Integer status) {
        List<Ward> wards = wardService.searchByNameWithFullHierarchy(name, status);
        return ResponseEntity.ok(wards);
    }

    // Date-based queries
    /**
     * Get wards by created date
     */
    @GetMapping("/created-date/{date}")
    public ResponseEntity<List<Ward>> getWardsByCreatedDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Ward> wards = wardService.findByCreatedDate(date);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by created date range
     */
    @GetMapping("/created-date-range")
    public ResponseEntity<List<Ward>> getWardsByCreatedDateBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Ward> wards = wardService.findByCreatedDateBetween(startDate, endDate);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get wards by updated date
     */
    @GetMapping("/updated-date/{date}")
    public ResponseEntity<List<Ward>> getWardsByUpdatedDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Ward> wards = wardService.findByUpdatedDate(date);
        return ResponseEntity.ok(wards);
    }

    // Advanced queries with relationships
    /**
     * Get ward by ID with locations
     */
    @GetMapping("/{id}/with-locations")
    public ResponseEntity<Ward> getWardByIdWithLocations(@PathVariable Integer id) {
        Optional<Ward> ward = wardService.findByIdWithLocations(id);
        return ward.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get ward by ID with accommodations
     */
    @GetMapping("/{id}/with-accommodations")
    public ResponseEntity<Ward> getWardByIdWithAccommodations(@PathVariable Integer id) {
        Optional<Ward> ward = wardService.findByIdWithAccommodations(id);
        return ward.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get ward by ID with foods
     */
    @GetMapping("/{id}/with-foods")
    public ResponseEntity<Ward> getWardByIdWithFoods(@PathVariable Integer id) {
        Optional<Ward> ward = wardService.findByIdWithFoods(id);
        return ward.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get ward by ID with events
     */
    @GetMapping("/{id}/with-events")
    public ResponseEntity<Ward> getWardByIdWithEvents(@PathVariable Integer id) {
        Optional<Ward> ward = wardService.findByIdWithEvents(id);
        return ward.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // Statistics queries
    /**
     * Get wards with location count
     */
    @GetMapping("/statistics/location-count")
    public ResponseEntity<List<Object[]>> getWardsWithLocationCount() {
        List<Object[]> statistics = wardService.findWardsWithLocationCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get wards with accommodation count
     */
    @GetMapping("/statistics/accommodation-count")
    public ResponseEntity<List<Object[]>> getWardsWithAccommodationCount() {
        List<Object[]> statistics = wardService.findWardsWithAccommodationCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get wards with food count
     */
    @GetMapping("/statistics/food-count")
    public ResponseEntity<List<Object[]>> getWardsWithFoodCount() {
        List<Object[]> statistics = wardService.findWardsWithFoodCount();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get wards with event count
     */
    @GetMapping("/statistics/event-count")
    public ResponseEntity<List<Object[]>> getWardsWithEventCount() {
        List<Object[]> statistics = wardService.findWardsWithEventCount();
        return ResponseEntity.ok(statistics);
    }

    // Validation queries
    /**
     * Check if ward code exists for different ward ID
     */
    @GetMapping("/validate/code/{code}/exclude/{id}")
    public ResponseEntity<Boolean> existsByCodeAndIdNot(@PathVariable String code, @PathVariable Integer id) {
        boolean exists = wardService.existsByCodeAndIdNot(code, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if ward name exists for different ward ID
     */
    @GetMapping("/validate/name/{name}/exclude/{id}")
    public ResponseEntity<Boolean> existsByNameAndIdNot(@PathVariable String name, @PathVariable Integer id) {
        boolean exists = wardService.existsByNameAndIdNot(name, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if ward code exists within district for different ward ID
     */
    @GetMapping("/validate/district/{districtId}/code/{code}/exclude/{id}")
    public ResponseEntity<Boolean> existsByDistrictIdAndCodeAndIdNot(@PathVariable Integer districtId, @PathVariable String code, @PathVariable Integer id) {
        boolean exists = wardService.existsByDistrictIdAndCodeAndIdNot(districtId, code, id);
        return ResponseEntity.ok(exists);
    }

    // Custom business logic queries
    /**
     * Get active wards by district
     */
    @GetMapping("/active/district/{districtId}")
    public ResponseEntity<List<Ward>> getActiveWardsByDistrict(@PathVariable Integer districtId) {
        List<Ward> wards = wardService.findActiveWardsByDistrict(districtId);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get active wards with background image
     */
    @GetMapping("/active/with-background-image")
    public ResponseEntity<List<Ward>> getActiveWardsWithBackgroundImage() {
        List<Ward> wards = wardService.findActiveWardsWithBackgroundImage();
        return ResponseEntity.ok(wards);
    }

    /**
     * Get active wards with logo
     */
    @GetMapping("/active/with-logo")
    public ResponseEntity<List<Ward>> getActiveWardsWithLogo() {
        List<Ward> wards = wardService.findActiveWardsWithLogo();
        return ResponseEntity.ok(wards);
    }

    /**
     * Get active wards by region ordered by district
     */
    @GetMapping("/active/region/{regionId}/ordered-by-district")
    public ResponseEntity<List<Ward>> getActiveWardsByRegionOrderedByDistrict(@PathVariable Integer regionId) {
        List<Ward> wards = wardService.findActiveWardsByRegionOrderedByDistrict(regionId);
        return ResponseEntity.ok(wards);
    }

    /**
     * Get active wards by country ordered by hierarchy
     */
    @GetMapping("/active/country/{countryId}/ordered-by-hierarchy")
    public ResponseEntity<List<Ward>> getActiveWardsByCountryOrderedByHierarchy(@PathVariable Integer countryId) {
        List<Ward> wards = wardService.findActiveWardsByCountryOrderedByHierarchy(countryId);
        return ResponseEntity.ok(wards);
    }
}
