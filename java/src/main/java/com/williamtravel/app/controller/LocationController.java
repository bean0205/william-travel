package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Location;
import com.williamtravel.app.service.LocationService;
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
 * REST Controller for Location operations
 */
@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    /**
     * Get all locations
     */
    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationService.findAll();
        return ResponseEntity.ok(locations);
    }

    /**
     * Get location by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Integer id) {
        Optional<Location> location = locationService.findById(id);
        return location.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new location
     */
    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        Location savedLocation = locationService.save(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedLocation);
    }

    /**
     * Update location
     */
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Integer id, @RequestBody Location location) {
        if (!locationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        location.setId(id);
        Location updatedLocation = locationService.save(location);
        return ResponseEntity.ok(updatedLocation);
    }

    /**
     * Delete location
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Integer id) {
        if (!locationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        locationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total locations
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countLocations() {
        long count = locationService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== PAGINATION ====================

    /**
     * Get all locations with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<Location>> getAllLocationsPaginated(Pageable pageable) {
        Page<Location> locations = locationService.findAll(pageable);
        return ResponseEntity.ok(locations);
    }

    // ==================== BASIC FINDERS ====================

    /**
     * Find locations by name
     */
    @GetMapping("/by-name/{name}")
    public ResponseEntity<List<Location>> getLocationsByName(@PathVariable String name) {
        List<Location> locations = locationService.findByName(name);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by name containing (case insensitive)
     */
    @GetMapping("/search-name")
    public ResponseEntity<List<Location>> searchLocationsByName(@RequestParam String name) {
        List<Location> locations = locationService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(locations);
    }

    /**
     * Check if location exists by name
     */
    @GetMapping("/exists-by-name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = locationService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if location exists by ID
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        boolean exists = locationService.existsById(id);
        return ResponseEntity.ok(exists);
    }

    // ==================== STATUS-BASED QUERIES ====================

    /**
     * Find locations by active status
     */
    @GetMapping("/by-status")
    public ResponseEntity<List<Location>> getLocationsByStatus(@RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByIsActive(isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by active status with pagination
     */
    @GetMapping("/by-status/paginated")
    public ResponseEntity<Page<Location>> getLocationsByStatusPaginated(
            @RequestParam Boolean isActive, Pageable pageable) {
        Page<Location> locations = locationService.findByIsActive(isActive, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find active locations ordered by popularity score
     */
    @GetMapping("/by-status/ordered-by-popularity")
    public ResponseEntity<List<Location>> getLocationsByStatusOrderedByPopularity(@RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByIsActiveOrderByPopularityScoreDesc(isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find active locations ordered by name
     */
    @GetMapping("/by-status/ordered-by-name")
    public ResponseEntity<List<Location>> getLocationsByStatusOrderedByName(@RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByIsActiveOrderByNameAsc(isActive);
        return ResponseEntity.ok(locations);
    }

    // ==================== CATEGORY RELATIONSHIPS ====================

    /**
     * Find locations by category ID
     */
    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<Location>> getLocationsByCategory(@PathVariable Integer categoryId) {
        List<Location> locations = locationService.findByCategoryId(categoryId);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by category ID with pagination
     */
    @GetMapping("/by-category/{categoryId}/paginated")
    public ResponseEntity<Page<Location>> getLocationsByCategoryPaginated(
            @PathVariable Integer categoryId, Pageable pageable) {
        Page<Location> locations = locationService.findByCategoryId(categoryId, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by category ID and active status
     */
    @GetMapping("/by-category/{categoryId}/status")
    public ResponseEntity<List<Location>> getLocationsByCategoryAndStatus(
            @PathVariable Integer categoryId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByCategoryIdAndIsActive(categoryId, isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by category ID and active status with pagination
     */
    @GetMapping("/by-category/{categoryId}/status/paginated")
    public ResponseEntity<Page<Location>> getLocationsByCategoryAndStatusPaginated(
            @PathVariable Integer categoryId, @RequestParam Boolean isActive, Pageable pageable) {
        Page<Location> locations = locationService.findByCategoryIdAndIsActive(categoryId, isActive, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by category ID and active status with category entity
     */
    @GetMapping("/by-category/{categoryId}/status/with-category")
    public ResponseEntity<List<Location>> getLocationsByCategoryAndStatusWithCategory(
            @PathVariable Integer categoryId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByCategoryIdAndIsActiveWithCategory(categoryId, isActive);
        return ResponseEntity.ok(locations);
    }

    // ==================== GEOGRAPHIC RELATIONSHIPS ====================

    /**
     * Find locations by country ID
     */
    @GetMapping("/by-country/{countryId}")
    public ResponseEntity<List<Location>> getLocationsByCountry(@PathVariable Integer countryId) {
        List<Location> locations = locationService.findByCountryId(countryId);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by country ID and active status
     */
    @GetMapping("/by-country/{countryId}/status")
    public ResponseEntity<List<Location>> getLocationsByCountryAndStatus(
            @PathVariable Integer countryId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByCountryIdAndIsActive(countryId, isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by region ID
     */
    @GetMapping("/by-region/{regionId}")
    public ResponseEntity<List<Location>> getLocationsByRegion(@PathVariable Integer regionId) {
        List<Location> locations = locationService.findByRegionId(regionId);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by region ID and active status
     */
    @GetMapping("/by-region/{regionId}/status")
    public ResponseEntity<List<Location>> getLocationsByRegionAndStatus(
            @PathVariable Integer regionId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByRegionIdAndIsActive(regionId, isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by district ID
     */
    @GetMapping("/by-district/{districtId}")
    public ResponseEntity<List<Location>> getLocationsByDistrict(@PathVariable Integer districtId) {
        List<Location> locations = locationService.findByDistrictId(districtId);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by district ID and active status
     */
    @GetMapping("/by-district/{districtId}/status")
    public ResponseEntity<List<Location>> getLocationsByDistrictAndStatus(
            @PathVariable Integer districtId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByDistrictIdAndIsActive(districtId, isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by ward ID
     */
    @GetMapping("/by-ward/{wardId}")
    public ResponseEntity<List<Location>> getLocationsByWard(@PathVariable Integer wardId) {
        List<Location> locations = locationService.findByWardId(wardId);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by ward ID and active status
     */
    @GetMapping("/by-ward/{wardId}/status")
    public ResponseEntity<List<Location>> getLocationsByWardAndStatus(
            @PathVariable Integer wardId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByWardIdAndIsActive(wardId, isActive);
        return ResponseEntity.ok(locations);
    }

    // ==================== GEOGRAPHIC QUERIES WITH RELATIONSHIPS ====================

    /**
     * Find locations by country ID and active status with country entity
     */
    @GetMapping("/by-country/{countryId}/status/with-country")
    public ResponseEntity<List<Location>> getLocationsByCountryAndStatusWithCountry(
            @PathVariable Integer countryId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByCountryIdAndIsActiveWithCountry(countryId, isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by region ID and active status with region and country entities
     */
    @GetMapping("/by-region/{regionId}/status/with-region-and-country")
    public ResponseEntity<List<Location>> getLocationsByRegionAndStatusWithRegionAndCountry(
            @PathVariable Integer regionId, @RequestParam Boolean isActive) {
        List<Location> locations = locationService.findByRegionIdAndIsActiveWithRegionAndCountry(regionId, isActive);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find location by ID with full geography
     */
    @GetMapping("/{id}/with-full-geography")
    public ResponseEntity<Location> getLocationByIdWithFullGeography(@PathVariable Integer id) {
        Optional<Location> location = locationService.findByIdWithFullGeography(id);
        return location.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // ==================== PRICE RANGE QUERIES ====================

    /**
     * Find locations by price range
     */
    @GetMapping("/by-price-range")
    public ResponseEntity<List<Location>> getLocationsByPriceRange(
            @RequestParam Double minPrice, @RequestParam Double maxPrice) {
        List<Location> locations = locationService.findByPriceMinLessThanEqualAndPriceMaxGreaterThanEqual(maxPrice, minPrice);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations by active status and price range
     */
    @GetMapping("/by-status-and-price-range")
    public ResponseEntity<List<Location>> getLocationsByStatusAndPriceRange(
            @RequestParam Boolean isActive, @RequestParam Double minPrice, @RequestParam Double maxPrice) {
        List<Location> locations = locationService.findByIsActiveAndPriceRange(isActive, minPrice, maxPrice);
        return ResponseEntity.ok(locations);
    }

    // ==================== POPULARITY AND RANKING QUERIES ====================

    /**
     * Find locations by active status ordered by popularity with pagination
     */
    @GetMapping("/by-status/ordered-by-popularity/paginated")
    public ResponseEntity<List<Location>> getLocationsByStatusOrderedByPopularityPaginated(
            @RequestParam Boolean isActive, Pageable pageable) {
        List<Location> locations = locationService.findByIsActiveOrderByPopularityScoreDesc(isActive, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find top locations by popularity
     */
    @GetMapping("/top-by-popularity")
    public ResponseEntity<List<Location>> getTopLocationsByPopularity(
            @RequestParam Boolean isActive, Pageable pageable) {
        List<Location> locations = locationService.findTopLocationsByPopularity(isActive, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find top locations by category and popularity
     */
    @GetMapping("/top-by-category-and-popularity/{categoryId}")
    public ResponseEntity<List<Location>> getTopLocationsByCategoryAndPopularity(
            @PathVariable Integer categoryId, @RequestParam Boolean isActive, Pageable pageable) {
        List<Location> locations = locationService.findTopLocationsByCategoryAndPopularity(categoryId, isActive, pageable);
        return ResponseEntity.ok(locations);
    }

    // ==================== GEOGRAPHIC PROXIMITY QUERIES ====================

    /**
     * Find locations by active status and coordinates bounds
     */
    @GetMapping("/by-coordinates-bounds")
    public ResponseEntity<List<Location>> getLocationsByCoordinatesBounds(
            @RequestParam Boolean isActive,
            @RequestParam Double minLat, @RequestParam Double maxLat,
            @RequestParam Double minLng, @RequestParam Double maxLng) {
        List<Location> locations = locationService.findByIsActiveAndCoordinatesBounds(isActive, minLat, maxLat, minLng, maxLng);
        return ResponseEntity.ok(locations);
    }

    // ==================== SEARCH AND FILTERING ====================

    /**
     * Find locations with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<Location>> getLocationsWithFilters(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer countryId,
            @RequestParam(required = false) Integer regionId,
            @RequestParam(required = false) String city,
            Pageable pageable) {
        Page<Location> locations = locationService.findWithFilters(isActive, name, categoryId, countryId, regionId, city, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Search locations
     */
    @GetMapping("/search")
    public ResponseEntity<List<Location>> searchLocations(
            @RequestParam Boolean isActive, @RequestParam String searchText) {
        List<Location> locations = locationService.searchLocations(isActive, searchText);
        return ResponseEntity.ok(locations);
    }

    // ==================== COUNT QUERIES ====================

    /**
     * Count locations by active status
     */
    @GetMapping("/count/by-status")
    public ResponseEntity<Long> countLocationsByStatus(@RequestParam Boolean isActive) {
        long count = locationService.countByIsActive(isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count locations by category ID and active status
     */
    @GetMapping("/count/by-category/{categoryId}")
    public ResponseEntity<Long> countLocationsByCategoryAndStatus(
            @PathVariable Integer categoryId, @RequestParam Boolean isActive) {
        long count = locationService.countByCategoryIdAndIsActive(categoryId, isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count locations by country ID and active status
     */
    @GetMapping("/count/by-country/{countryId}")
    public ResponseEntity<Long> countLocationsByCountryAndStatus(
            @PathVariable Integer countryId, @RequestParam Boolean isActive) {
        long count = locationService.countByCountryIdAndIsActive(countryId, isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count locations by region ID and active status
     */
    @GetMapping("/count/by-region/{regionId}")
    public ResponseEntity<Long> countLocationsByRegionAndStatus(
            @PathVariable Integer regionId, @RequestParam Boolean isActive) {
        long count = locationService.countByRegionIdAndIsActive(regionId, isActive);
        return ResponseEntity.ok(count);
    }

    // ==================== DATE-BASED QUERIES ====================

    /**
     * Find locations created between dates
     */
    @GetMapping("/by-created-date-range")
    public ResponseEntity<List<Location>> getLocationsByCreatedDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Location> locations = locationService.findByCreatedAtBetween(startDate, endDate);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find locations updated after date
     */
    @GetMapping("/by-updated-after")
    public ResponseEntity<List<Location>> getLocationsByUpdatedAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<Location> locations = locationService.findByUpdatedAtAfter(date);
        return ResponseEntity.ok(locations);
    }

    // ==================== STATISTICS QUERIES ====================

    /**
     * Find location count by category
     */
    @GetMapping("/statistics/count-by-category")
    public ResponseEntity<List<Object[]>> getLocationCountByCategory(@RequestParam Boolean isActive) {
        List<Object[]> statistics = locationService.findLocationCountByCategory(isActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Find location count by country
     */
    @GetMapping("/statistics/count-by-country")
    public ResponseEntity<List<Object[]>> getLocationCountByCountry(@RequestParam Boolean isActive) {
        List<Object[]> statistics = locationService.findLocationCountByCountry(isActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Find location count by region
     */
    @GetMapping("/statistics/count-by-region")
    public ResponseEntity<List<Object[]>> getLocationCountByRegion(@RequestParam Boolean isActive) {
        List<Object[]> statistics = locationService.findLocationCountByRegion(isActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Find average popularity score
     */
    @GetMapping("/statistics/average-popularity")
    public ResponseEntity<Double> getAveragePopularityScore(@RequestParam Boolean isActive) {
        Double average = locationService.findAveragePopularityScore(isActive);
        return ResponseEntity.ok(average);
    }

    // ==================== VALIDATION QUERIES ====================

    /**
     * Check if location exists by name and not ID
     */
    @GetMapping("/exists-by-name-and-not-id")
    public ResponseEntity<Boolean> existsByNameAndNotId(@RequestParam String name, @RequestParam Integer id) {
        boolean exists = locationService.existsByNameAndIdNot(name, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if location exists by coordinates and not ID
     */
    @GetMapping("/exists-by-coordinates-and-not-id")
    public ResponseEntity<Boolean> existsByCoordinatesAndNotId(
            @RequestParam Double latitude, @RequestParam Double longitude, @RequestParam Integer id) {
        boolean exists = locationService.existsByLatitudeAndLongitudeAndIdNot(latitude, longitude, id);
        return ResponseEntity.ok(exists);
    }

    // ==================== FEATURED AND TOP LOCATIONS ====================

    /**
     * Find featured locations with images
     */
    @GetMapping("/featured-with-images")
    public ResponseEntity<List<Location>> getFeaturedLocationsWithImages(Pageable pageable) {
        List<Location> locations = locationService.findFeaturedLocationsWithImages(pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find top locations by country
     */
    @GetMapping("/top-by-country/{countryId}")
    public ResponseEntity<List<Location>> getTopLocationsByCountry(
            @PathVariable Integer countryId, Pageable pageable) {
        List<Location> locations = locationService.findTopLocationsByCountry(countryId, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find top locations by region
     */
    @GetMapping("/top-by-region/{regionId}")
    public ResponseEntity<List<Location>> getTopLocationsByRegion(
            @PathVariable Integer regionId, Pageable pageable) {
        List<Location> locations = locationService.findTopLocationsByRegion(regionId, pageable);
        return ResponseEntity.ok(locations);
    }

    /**
     * Find distinct active cities by country
     */
    @GetMapping("/distinct-cities-by-country/{countryId}")
    public ResponseEntity<List<String>> getDistinctActiveCitiesByCountry(@PathVariable Integer countryId) {
        List<String> cities = locationService.findDistinctActiveCitiesByCountry(countryId);
        return ResponseEntity.ok(cities);
    }
}
