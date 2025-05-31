package com.williamtravel.app.service;

import com.williamtravel.app.entity.Location;
import com.williamtravel.app.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Location entity operations
 */
@Service
@Transactional
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    /**
     * Find all locations
     */
    public List<Location> findAll() {
        return locationRepository.findAll();
    }

    /**
     * Find location by ID
     */
    public Optional<Location> findById(Integer id) {
        return locationRepository.findById(id);
    }

    /**
     * Save location
     */
    public Location save(Location location) {
        return locationRepository.save(location);
    }

    /**
     * Delete location by ID
     */
    public void deleteById(Integer id) {
        locationRepository.deleteById(id);
    }

    /**
     * Count total locations
     */
    public long count() {
        return locationRepository.count();
    }

    /**
     * Check if location exists by ID
     */
    public boolean existsById(Integer id) {
        return locationRepository.existsById(id);
    }

    /**
     * Find locations with pagination
     */
    public Page<Location> findAll(Pageable pageable) {
        return locationRepository.findAll(pageable);
    }

    // Basic finder methods
    /**
     * Find locations by name
     */
    public List<Location> findByName(String name) {
        return locationRepository.findByName(name);
    }

    /**
     * Find locations by name containing (case insensitive)
     */
    public List<Location> findByNameContainingIgnoreCase(String name) {
        return locationRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Check if location exists by name
     */
    public boolean existsByName(String name) {
        return locationRepository.existsByName(name);
    }

    // Status-based queries
    /**
     * Find locations by active status
     */
    public List<Location> findByIsActive(Boolean isActive) {
        return locationRepository.findByIsActive(isActive);
    }

    /**
     * Find locations by active status with pagination
     */
    public Page<Location> findByIsActive(Boolean isActive, Pageable pageable) {
        return locationRepository.findByIsActive(isActive, pageable);
    }

    /**
     * Find active locations ordered by popularity score
     */
    public List<Location> findByIsActiveOrderByPopularityScoreDesc(Boolean isActive) {
        return locationRepository.findByIsActiveOrderByPopularityScoreDesc(isActive);
    }

    /**
     * Find active locations ordered by name
     */
    public List<Location> findByIsActiveOrderByNameAsc(Boolean isActive) {
        return locationRepository.findByIsActiveOrderByNameAsc(isActive);
    }

    // Category relationship queries
    /**
     * Find locations by category ID
     */
    public List<Location> findByCategoryId(Integer categoryId) {
        return locationRepository.findByCategoryId(categoryId);
    }

    /**
     * Find locations by category ID with pagination
     */
    public Page<Location> findByCategoryId(Integer categoryId, Pageable pageable) {
        return locationRepository.findByCategoryId(categoryId, pageable);
    }

    /**
     * Find locations by category ID and active status
     */
    public List<Location> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive) {
        return locationRepository.findByCategoryIdAndIsActive(categoryId, isActive);
    }

    /**
     * Find locations by category ID and active status with pagination
     */
    public Page<Location> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive, Pageable pageable) {
        return locationRepository.findByCategoryIdAndIsActive(categoryId, isActive, pageable);
    }

    /**
     * Find locations by category ID and active status with category entity
     */
    public List<Location> findByCategoryIdAndIsActiveWithCategory(Integer categoryId, Boolean isActive) {
        return locationRepository.findByCategoryIdAndIsActiveWithCategory(categoryId, isActive);
    }

    // Geographic relationship queries
    /**
     * Find locations by country ID
     */
    public List<Location> findByCountryId(Integer countryId) {
        return locationRepository.findByCountryId(countryId);
    }

    /**
     * Find locations by country ID and active status
     */
    public List<Location> findByCountryIdAndIsActive(Integer countryId, Boolean isActive) {
        return locationRepository.findByCountryIdAndIsActive(countryId, isActive);
    }

    /**
     * Find locations by region ID
     */
    public List<Location> findByRegionId(Integer regionId) {
        return locationRepository.findByRegionId(regionId);
    }

    /**
     * Find locations by region ID and active status
     */
    public List<Location> findByRegionIdAndIsActive(Integer regionId, Boolean isActive) {
        return locationRepository.findByRegionIdAndIsActive(regionId, isActive);
    }

    /**
     * Find locations by district ID
     */
    public List<Location> findByDistrictId(Integer districtId) {
        return locationRepository.findByDistrictId(districtId);
    }

    /**
     * Find locations by district ID and active status
     */
    public List<Location> findByDistrictIdAndIsActive(Integer districtId, Boolean isActive) {
        return locationRepository.findByDistrictIdAndIsActive(districtId, isActive);
    }

    /**
     * Find locations by ward ID
     */
    public List<Location> findByWardId(Integer wardId) {
        return locationRepository.findByWardId(wardId);
    }

    /**
     * Find locations by ward ID and active status
     */
    public List<Location> findByWardIdAndIsActive(Integer wardId, Boolean isActive) {
        return locationRepository.findByWardIdAndIsActive(wardId, isActive);
    }

    // Geographic queries with relationships
    /**
     * Find locations by country ID and active status with country entity
     */
    public List<Location> findByCountryIdAndIsActiveWithCountry(Integer countryId, Boolean isActive) {
        return locationRepository.findByCountryIdAndIsActiveWithCountry(countryId, isActive);
    }

    /**
     * Find locations by region ID and active status with region and country entities
     */
    public List<Location> findByRegionIdAndIsActiveWithRegionAndCountry(Integer regionId, Boolean isActive) {
        return locationRepository.findByRegionIdAndIsActiveWithRegionAndCountry(regionId, isActive);
    }

    /**
     * Find location by ID with full geography
     */
    public Optional<Location> findByIdWithFullGeography(Integer id) {
        return locationRepository.findByIdWithFullGeography(id);
    }

    // Price range queries
    /**
     * Find locations by price range
     */
    public List<Location> findByPriceMinLessThanEqualAndPriceMaxGreaterThanEqual(Double maxBudget, Double minBudget) {
        return locationRepository.findByPriceMinLessThanEqualAndPriceMaxGreaterThanEqual(maxBudget, minBudget);
    }

    /**
     * Find locations by active status and price range
     */
    public List<Location> findByIsActiveAndPriceRange(Boolean isActive, Double minPrice, Double maxPrice) {
        return locationRepository.findByIsActiveAndPriceRange(isActive, minPrice, maxPrice);
    }

    // Popularity and ranking queries
    /**
     * Find locations by active status ordered by popularity with pagination
     */
    public List<Location> findByIsActiveOrderByPopularityScoreDesc(Boolean isActive, Pageable pageable) {
        return locationRepository.findByIsActiveOrderByPopularityScoreDesc(isActive, pageable);
    }

    /**
     * Find top locations by popularity
     */
    public List<Location> findTopLocationsByPopularity(Boolean isActive, Pageable pageable) {
        return locationRepository.findTopLocationsByPopularity(isActive, pageable);
    }

    /**
     * Find top locations by category and popularity
     */
    public List<Location> findTopLocationsByCategoryAndPopularity(Integer categoryId, Boolean isActive, Pageable pageable) {
        return locationRepository.findTopLocationsByCategoryAndPopularity(categoryId, isActive, pageable);
    }

    // Geographic proximity queries
    /**
     * Find locations by active status and coordinates bounds
     */
    public List<Location> findByIsActiveAndCoordinatesBounds(Boolean isActive, Double minLat, Double maxLat, Double minLng, Double maxLng) {
        return locationRepository.findByIsActiveAndCoordinatesBounds(isActive, minLat, maxLat, minLng, maxLng);
    }

    // Search and filtering
    /**
     * Find locations with filters
     */
    public Page<Location> findWithFilters(Boolean isActive, String name, Integer categoryId, Integer countryId, Integer regionId, String city, Pageable pageable) {
        return locationRepository.findWithFilters(isActive, name, categoryId, countryId, regionId, city, pageable);
    }

    /**
     * Search locations
     */
    public List<Location> searchLocations(Boolean isActive, String searchText) {
        return locationRepository.searchLocations(isActive, searchText);
    }

    // Count queries
    /**
     * Count locations by active status
     */
    public long countByIsActive(Boolean isActive) {
        return locationRepository.countByIsActive(isActive);
    }

    /**
     * Count locations by category ID and active status
     */
    public long countByCategoryIdAndIsActive(Integer categoryId, Boolean isActive) {
        return locationRepository.countByCategoryIdAndIsActive(categoryId, isActive);
    }

    /**
     * Count locations by country ID and active status
     */
    public long countByCountryIdAndIsActive(Integer countryId, Boolean isActive) {
        return locationRepository.countByCountryIdAndIsActive(countryId, isActive);
    }

    /**
     * Count locations by region ID and active status
     */
    public long countByRegionIdAndIsActive(Integer regionId, Boolean isActive) {
        return locationRepository.countByRegionIdAndIsActive(regionId, isActive);
    }

    // Date-based queries
    /**
     * Find locations created between dates
     */
    public List<Location> findByCreatedAtBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        return locationRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * Find locations updated after date
     */
    public List<Location> findByUpdatedAtAfter(java.time.LocalDateTime date) {
        return locationRepository.findByUpdatedAtAfter(date);
    }

    // Statistics queries
    /**
     * Find location count by category
     */
    public List<Object[]> findLocationCountByCategory(Boolean isActive) {
        return locationRepository.findLocationCountByCategory(isActive);
    }

    /**
     * Find location count by country
     */
    public List<Object[]> findLocationCountByCountry(Boolean isActive) {
        return locationRepository.findLocationCountByCountry(isActive);
    }

    /**
     * Find location count by region
     */
    public List<Object[]> findLocationCountByRegion(Boolean isActive) {
        return locationRepository.findLocationCountByRegion(isActive);
    }

    /**
     * Find average popularity score
     */
    public Double findAveragePopularityScore(Boolean isActive) {
        return locationRepository.findAveragePopularityScore(isActive);
    }

    // Validation queries
    /**
     * Check if location exists by name and not ID
     */
    public boolean existsByNameAndIdNot(String name, Integer id) {
        return locationRepository.existsByNameAndIdNot(name, id);
    }

    /**
     * Check if location exists by coordinates and not ID
     */
    public boolean existsByLatitudeAndLongitudeAndIdNot(Double latitude, Double longitude, Integer id) {
        return locationRepository.existsByLatitudeAndLongitudeAndIdNot(latitude, longitude, id);
    }

    // Custom business logic queries
    /**
     * Find featured locations with images
     */
    public List<Location> findFeaturedLocationsWithImages(Pageable pageable) {
        return locationRepository.findFeaturedLocationsWithImages(pageable);
    }

    /**
     * Find top locations by country
     */
    public List<Location> findTopLocationsByCountry(Integer countryId, Pageable pageable) {
        return locationRepository.findTopLocationsByCountry(countryId, pageable);
    }

    /**
     * Find top locations by region
     */
    public List<Location> findTopLocationsByRegion(Integer regionId, Pageable pageable) {
        return locationRepository.findTopLocationsByRegion(regionId, pageable);
    }

    /**
     * Find distinct active cities by country
     */
    public List<String> findDistinctActiveCitiesByCountry(Integer countryId) {
        return locationRepository.findDistinctActiveCitiesByCountry(countryId);
    }
}
