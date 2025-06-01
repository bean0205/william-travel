package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Accommodation;
import com.williamtravel.app.service.AccommodationService;
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
 * REST Controller for Accommodation operations
 */
@RestController
@RequestMapping("/api/accommodations")
@CrossOrigin(origins = "*")
public class AccommodationController extends BaseController {

    @Autowired
    private AccommodationService accommodationService;

    /**
     * Get all accommodations
     */
    @GetMapping
    public ResponseEntity<List<Accommodation>> getAllAccommodations() {
        logApiRequest("getAllAccommodations");
        List<Accommodation> accommodations = accommodationService.findAll();
        logApiSuccess("getAllAccommodations", accommodations);
        return logResponse("getAllAccommodations", ResponseEntity.ok(accommodations));
    }

    /**
     * Get accommodation by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Accommodation> getAccommodationById(@PathVariable Integer id) {
        logApiRequest("getAccommodationById", id);
        Optional<Accommodation> accommodation = accommodationService.findById(id);
        
        if (accommodation.isPresent()) {
            logApiSuccess("getAccommodationById", accommodation.get());
            return logResponse("getAccommodationById", ResponseEntity.ok(accommodation.get()));
        } else {
            logApiWarning("getAccommodationById", "Accommodation with ID %d not found", id);
            return logResponse("getAccommodationById", ResponseEntity.notFound().build());
        }
    }

    /**
     * Create new accommodation
     */
    @PostMapping
    public ResponseEntity<Accommodation> createAccommodation(@RequestBody Accommodation accommodation) {
        logApiRequest("createAccommodation", accommodation);
        try {
            Accommodation savedAccommodation = accommodationService.save(accommodation);
            logApiSuccess("createAccommodation", savedAccommodation);
            return logResponse("createAccommodation", 
                ResponseEntity.status(HttpStatus.CREATED).body(savedAccommodation));
        } catch (Exception e) {
            logApiError("createAccommodation", e);
            throw e;
        }
    }

    /**
     * Update accommodation
     */
    @PutMapping("/{id}")
    public ResponseEntity<Accommodation> updateAccommodation(@PathVariable Integer id, @RequestBody Accommodation accommodation) {
        if (!accommodationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        accommodation.setId(id);
        Accommodation updatedAccommodation = accommodationService.save(accommodation);
        return ResponseEntity.ok(updatedAccommodation);
    }

    /**
     * Delete accommodation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccommodation(@PathVariable Integer id) {
        if (!accommodationService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        accommodationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get accommodations by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByName(@PathVariable String name) {
        List<Accommodation> accommodations = accommodationService.findByName(name);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Search accommodations by name
     */
    @GetMapping("/search/{name}")
    public ResponseEntity<List<Accommodation>> searchAccommodationsByName(@PathVariable String name) {
        List<Accommodation> accommodations = accommodationService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Check if accommodation name exists
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> checkNameExists(@PathVariable String name) {
        boolean exists = accommodationService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get accommodations by active status
     */
    @GetMapping("/status/{isActive}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByActiveStatus(@PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByIsActive(isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by active status with pagination
     */
    @GetMapping("/status/{isActive}/page")
    public ResponseEntity<Page<Accommodation>> getAccommodationsByActiveStatus(@PathVariable Boolean isActive, Pageable pageable) {
        Page<Accommodation> accommodations = accommodationService.findByIsActive(isActive, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get active accommodations ordered by rating
     */
    @GetMapping("/active/rating")
    public ResponseEntity<List<Accommodation>> getActiveAccommodationsOrderByRating() {
        List<Accommodation> accommodations = accommodationService.findActiveOrderByRatingDesc();
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get active accommodations ordered by name
     */
    @GetMapping("/active/name")
    public ResponseEntity<List<Accommodation>> getActiveAccommodationsOrderByName() {
        List<Accommodation> accommodations = accommodationService.findActiveOrderByNameAsc();
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByCategory(@PathVariable Integer categoryId) {
        List<Accommodation> accommodations = accommodationService.findByCategoryId(categoryId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by category with pagination
     */
    @GetMapping("/category/{categoryId}/page")
    public ResponseEntity<Page<Accommodation>> getAccommodationsByCategory(@PathVariable Integer categoryId, Pageable pageable) {
        Page<Accommodation> accommodations = accommodationService.findByCategoryId(categoryId, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by category and active status
     */
    @GetMapping("/category/{categoryId}/status/{isActive}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByCategoryAndStatus(@PathVariable Integer categoryId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByCategoryIdAndIsActive(categoryId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by category and active status with pagination
     */
    @GetMapping("/category/{categoryId}/status/{isActive}/page")
    public ResponseEntity<Page<Accommodation>> getAccommodationsByCategoryAndStatus(@PathVariable Integer categoryId, @PathVariable Boolean isActive, Pageable pageable) {
        Page<Accommodation> accommodations = accommodationService.findByCategoryIdAndIsActive(categoryId, isActive, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Count total accommodations
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countAccommodations() {
        long count = accommodationService.count();
        return ResponseEntity.ok(count);
    }

    // =========================
    // CATEGORY RELATIONSHIP ENDPOINTS
    // =========================

    /**
     * Get accommodations by category and active status with category info
     */
    @GetMapping("/category/{categoryId}/status/{isActive}/with-category")
    public ResponseEntity<List<Accommodation>> getAccommodationsByCategoryAndStatusWithCategory(@PathVariable Integer categoryId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByCategoryIdAndIsActiveWithCategory(categoryId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    // =========================
    // USER RELATIONSHIP ENDPOINTS
    // =========================

    /**
     * Get accommodations by user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByUser(@PathVariable Integer userId) {
        List<Accommodation> accommodations = accommodationService.findByUserId(userId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by user with pagination
     */
    @GetMapping("/user/{userId}/page")
    public ResponseEntity<Page<Accommodation>> getAccommodationsByUser(@PathVariable Integer userId, Pageable pageable) {
        Page<Accommodation> accommodations = accommodationService.findByUserId(userId, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by user and active status
     */
    @GetMapping("/user/{userId}/status/{isActive}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByUserAndStatus(@PathVariable Integer userId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByUserIdAndIsActive(userId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by user and active status with user info
     */
    @GetMapping("/user/{userId}/status/{isActive}/with-user")
    public ResponseEntity<List<Accommodation>> getAccommodationsByUserAndStatusWithUser(@PathVariable Integer userId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByUserIdAndIsActiveWithUser(userId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    // =========================
    // GEOGRAPHIC RELATIONSHIP ENDPOINTS
    // =========================

    /**
     * Get accommodations by country
     */
    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByCountry(@PathVariable Integer countryId) {
        List<Accommodation> accommodations = accommodationService.findByCountryId(countryId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by country and active status
     */
    @GetMapping("/country/{countryId}/status/{isActive}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByCountryAndStatus(@PathVariable Integer countryId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByCountryIdAndIsActive(countryId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by country and active status with country info
     */
    @GetMapping("/country/{countryId}/status/{isActive}/with-country")
    public ResponseEntity<List<Accommodation>> getAccommodationsByCountryAndStatusWithCountry(@PathVariable Integer countryId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByCountryIdAndIsActiveWithCountry(countryId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by region
     */
    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByRegion(@PathVariable Integer regionId) {
        List<Accommodation> accommodations = accommodationService.findByRegionId(regionId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by region and active status
     */
    @GetMapping("/region/{regionId}/status/{isActive}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByRegionAndStatus(@PathVariable Integer regionId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByRegionIdAndIsActive(regionId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by region and active status with region and country info
     */
    @GetMapping("/region/{regionId}/status/{isActive}/with-region-country")
    public ResponseEntity<List<Accommodation>> getAccommodationsByRegionAndStatusWithRegionAndCountry(@PathVariable Integer regionId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByRegionIdAndIsActiveWithRegionAndCountry(regionId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by district
     */
    @GetMapping("/district/{districtId}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByDistrict(@PathVariable Integer districtId) {
        List<Accommodation> accommodations = accommodationService.findByDistrictId(districtId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by district and active status
     */
    @GetMapping("/district/{districtId}/status/{isActive}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByDistrictAndStatus(@PathVariable Integer districtId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByDistrictIdAndIsActive(districtId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by ward
     */
    @GetMapping("/ward/{wardId}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByWard(@PathVariable Integer wardId) {
        List<Accommodation> accommodations = accommodationService.findByWardId(wardId);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by ward and active status
     */
    @GetMapping("/ward/{wardId}/status/{isActive}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByWardAndStatus(@PathVariable Integer wardId, @PathVariable Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByWardIdAndIsActive(wardId, isActive);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodation by ID with full geography info
     */
    @GetMapping("/{id}/full-geography")
    public ResponseEntity<Accommodation> getAccommodationWithFullGeography(@PathVariable Integer id) {
        Optional<Accommodation> accommodation = accommodationService.findByIdWithFullGeography(id);
        return accommodation.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // RATING AND RANKING ENDPOINTS
    // =========================

    /**
     * Get accommodations by minimum rating
     */
    @GetMapping("/rating/min/{minRating}")
    public ResponseEntity<List<Accommodation>> getAccommodationsByMinRating(@PathVariable Double minRating, @RequestParam(defaultValue = "true") Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByIsActiveAndRatingGreaterThanEqual(isActive, minRating);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations by rating range
     */
    @GetMapping("/rating/range")
    public ResponseEntity<List<Accommodation>> getAccommodationsByRatingRange(@RequestParam Double minRating, @RequestParam Double maxRating, @RequestParam(defaultValue = "true") Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByIsActiveAndRatingBetween(isActive, minRating, maxRating);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations ordered by rating (paginated)
     */
    @GetMapping("/rating/top")
    public ResponseEntity<List<Accommodation>> getAccommodationsOrderByRating(@RequestParam(defaultValue = "true") Boolean isActive, Pageable pageable) {
        List<Accommodation> accommodations = accommodationService.findByIsActiveOrderByRatingDesc(isActive, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get top accommodations by rating
     */
    @GetMapping("/top-rated")
    public ResponseEntity<List<Accommodation>> getTopAccommodationsByRating(@RequestParam(defaultValue = "true") Boolean isActive, Pageable pageable) {
        List<Accommodation> accommodations = accommodationService.findTopAccommodationsByRating(isActive, pageable);
        return ResponseEntity.ok(accommodations);
    }

    // =========================
    // GEOGRAPHIC PROXIMITY ENDPOINTS
    // =========================

    /**
     * Get accommodations within coordinate bounds
     */
    @GetMapping("/coordinates/bounds")
    public ResponseEntity<List<Accommodation>> getAccommodationsWithinBounds(
            @RequestParam Double minLat, @RequestParam Double maxLat,
            @RequestParam Double minLng, @RequestParam Double maxLng,
            @RequestParam(defaultValue = "true") Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.findByIsActiveAndCoordinatesBounds(isActive, minLat, maxLat, minLng, maxLng);
        return ResponseEntity.ok(accommodations);
    }

    // =========================
    // SEARCH AND FILTERING ENDPOINTS
    // =========================

    /**
     * Search accommodations with filters
     */
    @GetMapping("/search/filtered")
    public ResponseEntity<Page<Accommodation>> searchAccommodationsWithFilters(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer countryId,
            @RequestParam(required = false) Integer regionId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            Pageable pageable) {
        Page<Accommodation> accommodations = accommodationService.findWithFilters(isActive, name, categoryId, countryId, regionId, city, minRating, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Search accommodations by text
     */
    @GetMapping("/search/text")
    public ResponseEntity<List<Accommodation>> searchAccommodations(@RequestParam String searchText, @RequestParam(defaultValue = "true") Boolean isActive) {
        List<Accommodation> accommodations = accommodationService.searchAccommodations(isActive, searchText);
        return ResponseEntity.ok(accommodations);
    }

    // =========================
    // COUNT AND STATISTICS ENDPOINTS
    // =========================

    /**
     * Count accommodations by active status
     */
    @GetMapping("/count/status/{isActive}")
    public ResponseEntity<Long> countAccommodationsByStatus(@PathVariable Boolean isActive) {
        long count = accommodationService.countByIsActive(isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count accommodations by category and active status
     */
    @GetMapping("/count/category/{categoryId}/status/{isActive}")
    public ResponseEntity<Long> countAccommodationsByCategoryAndStatus(@PathVariable Integer categoryId, @PathVariable Boolean isActive) {
        long count = accommodationService.countByCategoryIdAndIsActive(categoryId, isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count accommodations by country and active status
     */
    @GetMapping("/count/country/{countryId}/status/{isActive}")
    public ResponseEntity<Long> countAccommodationsByCountryAndStatus(@PathVariable Integer countryId, @PathVariable Boolean isActive) {
        long count = accommodationService.countByCountryIdAndIsActive(countryId, isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count accommodations by region and active status
     */
    @GetMapping("/count/region/{regionId}/status/{isActive}")
    public ResponseEntity<Long> countAccommodationsByRegionAndStatus(@PathVariable Integer regionId, @PathVariable Boolean isActive) {
        long count = accommodationService.countByRegionIdAndIsActive(regionId, isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count accommodations by user
     */
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Long> countAccommodationsByUser(@PathVariable Integer userId) {
        long count = accommodationService.countByUserId(userId);
        return ResponseEntity.ok(count);
    }

    // =========================
    // DATE-BASED ENDPOINTS
    // =========================

    /**
     * Get accommodations created between dates
     */
    @GetMapping("/created/between")
    public ResponseEntity<List<Accommodation>> getAccommodationsCreatedBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Accommodation> accommodations = accommodationService.findByCreatedAtBetween(startDate, endDate);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get accommodations updated after date
     */
    @GetMapping("/updated/after")
    public ResponseEntity<List<Accommodation>> getAccommodationsUpdatedAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<Accommodation> accommodations = accommodationService.findByUpdatedAtAfter(date);
        return ResponseEntity.ok(accommodations);
    }

    // =========================
    // STATISTICS ENDPOINTS
    // =========================

    /**
     * Get accommodation count by category
     */
    @GetMapping("/statistics/count-by-category")
    public ResponseEntity<List<Object[]>> getAccommodationCountByCategory(@RequestParam(defaultValue = "true") Boolean isActive) {
        List<Object[]> statistics = accommodationService.findAccommodationCountByCategory(isActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get accommodation count by country
     */
    @GetMapping("/statistics/count-by-country")
    public ResponseEntity<List<Object[]>> getAccommodationCountByCountry(@RequestParam(defaultValue = "true") Boolean isActive) {
        List<Object[]> statistics = accommodationService.findAccommodationCountByCountry(isActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get accommodation count by region
     */
    @GetMapping("/statistics/count-by-region")
    public ResponseEntity<List<Object[]>> getAccommodationCountByRegion(@RequestParam(defaultValue = "true") Boolean isActive) {
        List<Object[]> statistics = accommodationService.findAccommodationCountByRegion(isActive);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Get average rating
     */
    @GetMapping("/statistics/average-rating")
    public ResponseEntity<Double> getAverageRating(@RequestParam(defaultValue = "true") Boolean isActive) {
        Double averageRating = accommodationService.findAverageRating(isActive);
        return ResponseEntity.ok(averageRating);
    }

    /**
     * Get average rating by category
     */
    @GetMapping("/statistics/average-rating/category/{categoryId}")
    public ResponseEntity<Double> getAverageRatingByCategory(@PathVariable Integer categoryId, @RequestParam(defaultValue = "true") Boolean isActive) {
        Double averageRating = accommodationService.findAverageRatingByCategory(isActive, categoryId);
        return ResponseEntity.ok(averageRating);
    }

    // =========================
    // ADVANCED RELATIONSHIP ENDPOINTS
    // =========================

    /**
     * Get accommodation by ID with rooms
     */
    @GetMapping("/{id}/with-rooms")
    public ResponseEntity<Accommodation> getAccommodationWithRooms(@PathVariable Integer id) {
        Optional<Accommodation> accommodation = accommodationService.findByIdWithRooms(id);
        return accommodation.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get accommodation by ID with media
     */
    @GetMapping("/{id}/with-media")
    public ResponseEntity<Accommodation> getAccommodationWithMedia(@PathVariable Integer id) {
        Optional<Accommodation> accommodation = accommodationService.findByIdWithMedia(id);
        return accommodation.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // VALIDATION ENDPOINTS
    // =========================

    /**
     * Check if accommodation name exists (excluding specific ID)
     */
    @GetMapping("/exists/name/{name}/exclude/{id}")
    public ResponseEntity<Boolean> checkNameExistsExcludingId(@PathVariable String name, @PathVariable Integer id) {
        boolean exists = accommodationService.existsByNameAndIdNot(name, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if coordinates exist (excluding specific ID)
     */
    @GetMapping("/exists/coordinates")
    public ResponseEntity<Boolean> checkCoordinatesExistExcludingId(@RequestParam Double latitude, @RequestParam Double longitude, @RequestParam Integer id) {
        boolean exists = accommodationService.existsByLatitudeAndLongitudeAndIdNot(latitude, longitude, id);
        return ResponseEntity.ok(exists);
    }

    // =========================
    // FEATURED AND TOP ENDPOINTS
    // =========================

    /**
     * Get featured accommodations with images
     */
    @GetMapping("/featured/with-images")
    public ResponseEntity<List<Accommodation>> getFeaturedAccommodationsWithImages(Pageable pageable) {
        List<Accommodation> accommodations = accommodationService.findFeaturedAccommodationsWithImages(pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get top accommodations by country
     */
    @GetMapping("/top/country/{countryId}")
    public ResponseEntity<List<Accommodation>> getTopAccommodationsByCountry(@PathVariable Integer countryId, Pageable pageable) {
        List<Accommodation> accommodations = accommodationService.findTopAccommodationsByCountry(countryId, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get top accommodations by region
     */
    @GetMapping("/top/region/{regionId}")
    public ResponseEntity<List<Accommodation>> getTopAccommodationsByRegion(@PathVariable Integer regionId, Pageable pageable) {
        List<Accommodation> accommodations = accommodationService.findTopAccommodationsByRegion(regionId, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get top accommodations by category
     */
    @GetMapping("/top/category/{categoryId}")
    public ResponseEntity<List<Accommodation>> getTopAccommodationsByCategory(@PathVariable Integer categoryId, Pageable pageable) {
        List<Accommodation> accommodations = accommodationService.findTopAccommodationsByCategory(categoryId, pageable);
        return ResponseEntity.ok(accommodations);
    }

    /**
     * Get distinct active cities by country
     */
    @GetMapping("/cities/country/{countryId}")
    public ResponseEntity<List<String>> getDistinctActiveCitiesByCountry(@PathVariable Integer countryId) {
        List<String> cities = accommodationService.findDistinctActiveCitiesByCountry(countryId);
        return ResponseEntity.ok(cities);
    }
}
