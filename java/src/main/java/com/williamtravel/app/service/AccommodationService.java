package com.williamtravel.app.service;

import com.williamtravel.app.entity.Accommodation;
import com.williamtravel.app.repository.AccommodationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Accommodation entity operations
 */
@Service
@Transactional
public class AccommodationService {

    @Autowired
    private AccommodationRepository accommodationRepository;

    /**
     * Find all accommodations
     */
    public List<Accommodation> findAll() {
        return accommodationRepository.findAll();
    }

    /**
     * Find accommodation by ID
     */
    public Optional<Accommodation> findById(Integer id) {
        return accommodationRepository.findById(id);
    }

    /**
     * Save accommodation
     */
    public Accommodation save(Accommodation accommodation) {
        return accommodationRepository.save(accommodation);
    }

    /**
     * Delete accommodation by ID
     */
    public void deleteById(Integer id) {
        accommodationRepository.deleteById(id);
    }

    // Basic finder methods
    public List<Accommodation> findByName(String name) {
        return accommodationRepository.findByName(name);
    }

    public List<Accommodation> findByNameContainingIgnoreCase(String name) {
        return accommodationRepository.findByNameContainingIgnoreCase(name);
    }

    public boolean existsByName(String name) {
        return accommodationRepository.existsByName(name);
    }

    // Status-based queries
    public List<Accommodation> findByIsActive(Boolean isActive) {
        return accommodationRepository.findByIsActive(isActive);
    }

    public Page<Accommodation> findByIsActive(Boolean isActive, Pageable pageable) {
        return accommodationRepository.findByIsActive(isActive, pageable);
    }

    public List<Accommodation> findActiveOrderByRatingDesc() {
        return accommodationRepository.findByIsActiveOrderByRatingDesc(true);
    }

    public List<Accommodation> findActiveOrderByNameAsc() {
        return accommodationRepository.findByIsActiveOrderByNameAsc(true);
    }

    // Category relationship queries
    public List<Accommodation> findByCategoryId(Integer categoryId) {
        return accommodationRepository.findByCategoryId(categoryId);
    }

    public Page<Accommodation> findByCategoryId(Integer categoryId, Pageable pageable) {
        return accommodationRepository.findByCategoryId(categoryId, pageable);
    }

    public List<Accommodation> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive) {
        return accommodationRepository.findByCategoryIdAndIsActive(categoryId, isActive);
    }

    public Page<Accommodation> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive, Pageable pageable) {
        return accommodationRepository.findByCategoryIdAndIsActive(categoryId, isActive, pageable);
    }

    public List<Accommodation> findByCategoryIdAndIsActiveWithCategory(Integer categoryId, Boolean isActive) {
        return accommodationRepository.findByCategoryIdAndIsActiveWithCategory(categoryId, isActive);
    }

    // User relationship queries
    public List<Accommodation> findByUserId(Integer userId) {
        return accommodationRepository.findByUserId(userId);
    }

    public Page<Accommodation> findByUserId(Integer userId, Pageable pageable) {
        return accommodationRepository.findByUserId(userId, pageable);
    }

    public List<Accommodation> findByUserIdAndIsActive(Integer userId, Boolean isActive) {
        return accommodationRepository.findByUserIdAndIsActive(userId, isActive);
    }

    public List<Accommodation> findByUserIdAndIsActiveWithUser(Integer userId, Boolean isActive) {
        return accommodationRepository.findByUserIdAndIsActiveWithUser(userId, isActive);
    }

    // Geographic relationship queries
    public List<Accommodation> findByCountryId(Integer countryId) {
        return accommodationRepository.findByCountryId(countryId);
    }

    public List<Accommodation> findByCountryIdAndIsActive(Integer countryId, Boolean isActive) {
        return accommodationRepository.findByCountryIdAndIsActive(countryId, isActive);
    }

    public List<Accommodation> findByRegionId(Integer regionId) {
        return accommodationRepository.findByRegionId(regionId);
    }

    public List<Accommodation> findByRegionIdAndIsActive(Integer regionId, Boolean isActive) {
        return accommodationRepository.findByRegionIdAndIsActive(regionId, isActive);
    }

    public List<Accommodation> findByDistrictId(Integer districtId) {
        return accommodationRepository.findByDistrictId(districtId);
    }

    public List<Accommodation> findByDistrictIdAndIsActive(Integer districtId, Boolean isActive) {
        return accommodationRepository.findByDistrictIdAndIsActive(districtId, isActive);
    }

    public List<Accommodation> findByWardId(Integer wardId) {
        return accommodationRepository.findByWardId(wardId);
    }

    public List<Accommodation> findByWardIdAndIsActive(Integer wardId, Boolean isActive) {
        return accommodationRepository.findByWardIdAndIsActive(wardId, isActive);
    }

    // Geographic queries with relationships
    public List<Accommodation> findByCountryIdAndIsActiveWithCountry(Integer countryId, Boolean isActive) {
        return accommodationRepository.findByCountryIdAndIsActiveWithCountry(countryId, isActive);
    }

    public List<Accommodation> findByRegionIdAndIsActiveWithRegionAndCountry(Integer regionId, Boolean isActive) {
        return accommodationRepository.findByRegionIdAndIsActiveWithRegionAndCountry(regionId, isActive);
    }

    public Optional<Accommodation> findByIdWithFullGeography(Integer id) {
        return accommodationRepository.findByIdWithFullGeography(id);
    }

    // Rating and price queries
    public List<Accommodation> findByIsActiveAndRatingGreaterThanEqual(Boolean isActive, Double minRating) {
        return accommodationRepository.findByIsActiveAndRatingGreaterThanEqual(isActive, minRating);
    }

    public List<Accommodation> findByIsActiveAndRatingBetween(Boolean isActive, Double minRating, Double maxRating) {
        return accommodationRepository.findByIsActiveAndRatingBetween(isActive, minRating, maxRating);
    }

    public List<Accommodation> findByIsActiveOrderByRatingDesc(Boolean isActive, Pageable pageable) {
        return accommodationRepository.findByIsActiveOrderByRatingDesc(isActive, pageable);
    }

    public List<Accommodation> findTopAccommodationsByRating(Boolean isActive, Pageable pageable) {
        return accommodationRepository.findTopAccommodationsByRating(isActive, pageable);
    }

    // Geographic proximity queries
    public List<Accommodation> findByIsActiveAndCoordinatesBounds(Boolean isActive, Double minLat, Double maxLat, Double minLng, Double maxLng) {
        return accommodationRepository.findByIsActiveAndCoordinatesBounds(isActive, minLat, maxLat, minLng, maxLng);
    }

    // Search and filtering
    public Page<Accommodation> findWithFilters(Boolean isActive, String name, Integer categoryId, Integer countryId, Integer regionId, String city, Double minRating, Pageable pageable) {
        return accommodationRepository.findWithFilters(isActive, name, categoryId, countryId, regionId, city, minRating, pageable);
    }

    public List<Accommodation> searchAccommodations(Boolean isActive, String searchText) {
        return accommodationRepository.searchAccommodations(isActive, searchText);
    }

    // Count queries
    public long countByIsActive(Boolean isActive) {
        return accommodationRepository.countByIsActive(isActive);
    }

    public long countByCategoryIdAndIsActive(Integer categoryId, Boolean isActive) {
        return accommodationRepository.countByCategoryIdAndIsActive(categoryId, isActive);
    }

    public long countByCountryIdAndIsActive(Integer countryId, Boolean isActive) {
        return accommodationRepository.countByCountryIdAndIsActive(countryId, isActive);
    }

    public long countByRegionIdAndIsActive(Integer regionId, Boolean isActive) {
        return accommodationRepository.countByRegionIdAndIsActive(regionId, isActive);
    }

    public long countByUserId(Integer userId) {
        return accommodationRepository.countByUserId(userId);
    }

    // Date-based queries
    public List<Accommodation> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return accommodationRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<Accommodation> findByUpdatedAtAfter(LocalDateTime date) {
        return accommodationRepository.findByUpdatedAtAfter(date);
    }

    // Statistics queries
    public List<Object[]> findAccommodationCountByCategory(Boolean isActive) {
        return accommodationRepository.findAccommodationCountByCategory(isActive);
    }

    public List<Object[]> findAccommodationCountByCountry(Boolean isActive) {
        return accommodationRepository.findAccommodationCountByCountry(isActive);
    }

    public List<Object[]> findAccommodationCountByRegion(Boolean isActive) {
        return accommodationRepository.findAccommodationCountByRegion(isActive);
    }

    public Double findAverageRating(Boolean isActive) {
        return accommodationRepository.findAverageRating(isActive);
    }

    public Double findAverageRatingByCategory(Boolean isActive, Integer categoryId) {
        return accommodationRepository.findAverageRatingByCategory(isActive, categoryId);
    }

    // Advanced queries with relationships
    public Optional<Accommodation> findByIdWithRooms(Integer id) {
        return accommodationRepository.findByIdWithRooms(id);
    }

    public Optional<Accommodation> findByIdWithMedia(Integer id) {
        return accommodationRepository.findByIdWithMedia(id);
    }

    // Validation queries
    public boolean existsByNameAndIdNot(String name, Integer id) {
        return accommodationRepository.existsByNameAndIdNot(name, id);
    }

    public boolean existsByLatitudeAndLongitudeAndIdNot(Double latitude, Double longitude, Integer id) {
        return accommodationRepository.existsByLatitudeAndLongitudeAndIdNot(latitude, longitude, id);
    }

    // Custom business logic queries
    public List<Accommodation> findFeaturedAccommodationsWithImages(Pageable pageable) {
        return accommodationRepository.findFeaturedAccommodationsWithImages(pageable);
    }

    public List<Accommodation> findTopAccommodationsByCountry(Integer countryId, Pageable pageable) {
        return accommodationRepository.findTopAccommodationsByCountry(countryId, pageable);
    }

    public List<Accommodation> findTopAccommodationsByRegion(Integer regionId, Pageable pageable) {
        return accommodationRepository.findTopAccommodationsByRegion(regionId, pageable);
    }

    public List<String> findDistinctActiveCitiesByCountry(Integer countryId) {
        return accommodationRepository.findDistinctActiveCitiesByCountry(countryId);
    }

    public List<Accommodation> findTopAccommodationsByCategory(Integer categoryId, Pageable pageable) {
        return accommodationRepository.findTopAccommodationsByCategory(categoryId, pageable);
    }

    /**
     * Count total accommodations
     */
    public long count() {
        return accommodationRepository.count();
    }

    /**
     * Check if accommodation exists by ID
     */
    public boolean existsById(Integer id) {
        return accommodationRepository.existsById(id);
    }
}
