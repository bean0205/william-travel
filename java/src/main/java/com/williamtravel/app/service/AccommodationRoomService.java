package com.williamtravel.app.service;

import com.williamtravel.app.entity.AccommodationRoom;
import com.williamtravel.app.repository.AccommodationRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for AccommodationRoom entity operations
 */
@Service
@Transactional
public class AccommodationRoomService {

    @Autowired
    private AccommodationRoomRepository accommodationRoomRepository;

    /**
     * Find all accommodation rooms
     */
    public List<AccommodationRoom> findAll() {
        return accommodationRoomRepository.findAll();
    }

    /**
     * Find accommodation room by ID
     */
    public Optional<AccommodationRoom> findById(Integer id) {
        return accommodationRoomRepository.findById(id);
    }

    /**
     * Save accommodation room
     */
    public AccommodationRoom save(AccommodationRoom accommodationRoom) {
        return accommodationRoomRepository.save(accommodationRoom);
    }

    /**
     * Delete accommodation room by ID
     */
    public void deleteById(Integer id) {
        accommodationRoomRepository.deleteById(id);
    }

    /**
     * Find accommodation rooms with pagination
     */
    public Page<AccommodationRoom> findAll(Pageable pageable) {
        return accommodationRoomRepository.findAll(pageable);
    }

    /**
     * Check if accommodation room exists by ID
     */
    public boolean existsById(Integer id) {
        return accommodationRoomRepository.existsById(id);
    }

    /**
     * Count all accommodation rooms
     */
    public long count() {
        return accommodationRoomRepository.count();
    }

    // Basic finder methods
    /**
     * Find accommodation rooms by name
     */
    public List<AccommodationRoom> findByName(String name) {
        return accommodationRoomRepository.findByName(name);
    }

    /**
     * Find accommodation rooms by name containing (case insensitive)
     */
    public List<AccommodationRoom> findByNameContainingIgnoreCase(String name) {
        return accommodationRoomRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Check if accommodation room exists by name
     */
    public boolean existsByName(String name) {
        return accommodationRoomRepository.existsByName(name);
    }

    // Status-based queries
    /**
     * Find accommodation rooms by active status
     */
    public List<AccommodationRoom> findByIsActive(Boolean isActive) {
        return accommodationRoomRepository.findByIsActive(isActive);
    }

    /**
     * Find accommodation rooms by active status with pagination
     */
    public Page<AccommodationRoom> findByIsActive(Boolean isActive, Pageable pageable) {
        return accommodationRoomRepository.findByIsActive(isActive, pageable);
    }

    /**
     * Find accommodation rooms by active status ordered by name
     */
    public List<AccommodationRoom> findByIsActiveOrderByNameAsc(Boolean isActive) {
        return accommodationRoomRepository.findByIsActiveOrderByNameAsc(isActive);
    }

    /**
     * Find accommodation rooms by active status ordered by price
     */
    public List<AccommodationRoom> findByIsActiveOrderByPricePerNightAsc(Boolean isActive) {
        return accommodationRoomRepository.findByIsActiveOrderByPricePerNightAsc(isActive);
    }

    // Accommodation relationship queries
    /**
     * Find accommodation rooms by accommodation ID
     */
    public List<AccommodationRoom> findByAccommodationId(Integer accommodationId) {
        return accommodationRoomRepository.findByAccommodationId(accommodationId);
    }

    /**
     * Find accommodation rooms by accommodation ID with pagination
     */
    public Page<AccommodationRoom> findByAccommodationId(Integer accommodationId, Pageable pageable) {
        return accommodationRoomRepository.findByAccommodationId(accommodationId, pageable);
    }

    /**
     * Find accommodation rooms by accommodation ID and active status
     */
    public List<AccommodationRoom> findByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive) {
        return accommodationRoomRepository.findByAccommodationIdAndIsActive(accommodationId, isActive);
    }

    /**
     * Find accommodation rooms by accommodation ID and active status with pagination
     */
    public Page<AccommodationRoom> findByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive, Pageable pageable) {
        return accommodationRoomRepository.findByAccommodationIdAndIsActive(accommodationId, isActive, pageable);
    }

    /**
     * Find accommodation rooms by accommodation ID and active status with accommodation entity
     */
    public List<AccommodationRoom> findByAccommodationIdAndIsActiveWithAccommodation(Integer accommodationId, Boolean isActive) {
        return accommodationRoomRepository.findByAccommodationIdAndIsActiveWithAccommodation(accommodationId, isActive);
    }

    /**
     * Find accommodation rooms by accommodation active and room active status
     */
    public List<AccommodationRoom> findByAccommodationActiveAndRoomActive(Boolean accommodationActive, Boolean roomActive) {
        return accommodationRoomRepository.findByAccommodationActiveAndRoomActive(accommodationActive, roomActive);
    }

    // Price-based queries
    /**
     * Find accommodation rooms by active status and max price
     */
    public List<AccommodationRoom> findByIsActiveAndPricePerNightLessThanEqual(Boolean isActive, Double maxPrice) {
        return accommodationRoomRepository.findByIsActiveAndPricePerNightLessThanEqual(isActive, maxPrice);
    }

    /**
     * Find accommodation rooms by active status and price range
     */
    public List<AccommodationRoom> findByIsActiveAndPricePerNightBetween(Boolean isActive, Double minPrice, Double maxPrice) {
        return accommodationRoomRepository.findByIsActiveAndPricePerNightBetween(isActive, minPrice, maxPrice);
    }

    /**
     * Find accommodation rooms by active status ordered by price ascending with pagination
     */
    public List<AccommodationRoom> findByIsActiveOrderByPricePerNightAsc(Boolean isActive, Pageable pageable) {
        return accommodationRoomRepository.findByIsActiveOrderByPricePerNightAsc(isActive, pageable);
    }

    /**
     * Find accommodation rooms by active status ordered by price descending with pagination
     */
    public List<AccommodationRoom> findByIsActiveOrderByPricePerNightDesc(Boolean isActive, Pageable pageable) {
        return accommodationRoomRepository.findByIsActiveOrderByPricePerNightDesc(isActive, pageable);
    }

    // Capacity-based queries
    /**
     * Find accommodation rooms by active status and minimum capacity
     */
    public List<AccommodationRoom> findByIsActiveAndCapacityGreaterThanEqual(Boolean isActive, Integer minCapacity) {
        return accommodationRoomRepository.findByIsActiveAndCapacityGreaterThanEqual(isActive, minCapacity);
    }

    /**
     * Find accommodation rooms by active status and capacity range
     */
    public List<AccommodationRoom> findByIsActiveAndCapacityBetween(Boolean isActive, Integer minCapacity, Integer maxCapacity) {
        return accommodationRoomRepository.findByIsActiveAndCapacityBetween(isActive, minCapacity, maxCapacity);
    }

    /**
     * Find accommodation rooms by active status ordered by capacity ascending
     */
    public List<AccommodationRoom> findByIsActiveOrderByCapacityAsc(Boolean isActive) {
        return accommodationRoomRepository.findByIsActiveOrderByCapacityAsc(isActive);
    }

    /**
     * Find accommodation rooms by active status ordered by capacity descending
     */
    public List<AccommodationRoom> findByIsActiveOrderByCapacityDesc(Boolean isActive) {
        return accommodationRoomRepository.findByIsActiveOrderByCapacityDesc(isActive);
    }

    // Search and filtering
    /**
     * Find accommodation rooms with filters
     */
    public Page<AccommodationRoom> findWithFilters(Boolean isActive, String name, Integer accommodationId, Double minPrice, Double maxPrice, Integer minCapacity, Integer maxCapacity, Pageable pageable) {
        return accommodationRoomRepository.findWithFilters(isActive, name, accommodationId, minPrice, maxPrice, minCapacity, maxCapacity, pageable);
    }

    /**
     * Search accommodation rooms
     */
    public List<AccommodationRoom> searchRooms(Boolean isActive, String searchText) {
        return accommodationRoomRepository.searchRooms(isActive, searchText);
    }

    // Geographic filtering through accommodation
    /**
     * Find accommodation rooms by active status and country ID
     */
    public List<AccommodationRoom> findByIsActiveAndCountryId(Boolean isActive, Integer countryId) {
        return accommodationRoomRepository.findByIsActiveAndCountryId(isActive, countryId);
    }

    /**
     * Find accommodation rooms by active status and region ID
     */
    public List<AccommodationRoom> findByIsActiveAndRegionId(Boolean isActive, Integer regionId) {
        return accommodationRoomRepository.findByIsActiveAndRegionId(isActive, regionId);
    }

    /**
     * Find accommodation rooms by active status and accommodation category ID
     */
    public List<AccommodationRoom> findByIsActiveAndAccommodationCategoryId(Boolean isActive, Integer categoryId) {
        return accommodationRoomRepository.findByIsActiveAndAccommodationCategoryId(isActive, categoryId);
    }

    // Count queries
    /**
     * Count accommodation rooms by active status
     */
    public long countByIsActive(Boolean isActive) {
        return accommodationRoomRepository.countByIsActive(isActive);
    }

    /**
     * Count accommodation rooms by accommodation ID and active status
     */
    public long countByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive) {
        return accommodationRoomRepository.countByAccommodationIdAndIsActive(accommodationId, isActive);
    }

    /**
     * Count accommodation rooms by active status and accommodation active status
     */
    public long countByIsActiveAndAccommodationActive(Boolean isActive, Boolean accommodationActive) {
        return accommodationRoomRepository.countByIsActiveAndAccommodationActive(isActive, accommodationActive);
    }

    // Date-based queries
    /**
     * Find accommodation rooms created between dates
     */
    public List<AccommodationRoom> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return accommodationRoomRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * Find accommodation rooms updated after date
     */
    public List<AccommodationRoom> findByUpdatedAtAfter(LocalDateTime date) {
        return accommodationRoomRepository.findByUpdatedAtAfter(date);
    }

    // Statistics queries
    /**
     * Find average price by active status
     */
    public Double findAveragePrice(Boolean isActive) {
        return accommodationRoomRepository.findAveragePrice(isActive);
    }

    /**
     * Find average price by accommodation
     */
    public Double findAveragePriceByAccommodation(Boolean isActive, Integer accommodationId) {
        return accommodationRoomRepository.findAveragePriceByAccommodation(isActive, accommodationId);
    }

    /**
     * Find price range by accommodation
     */
    public List<Object[]> findPriceRangeByAccommodation(Boolean isActive, Integer accommodationId) {
        return accommodationRoomRepository.findPriceRangeByAccommodation(isActive, accommodationId);
    }

    /**
     * Find total capacity by accommodation
     */
    public Integer findTotalCapacityByAccommodation(Boolean isActive, Integer accommodationId) {
        return accommodationRoomRepository.findTotalCapacityByAccommodation(isActive, accommodationId);
    }

    /**
     * Find room count by accommodation
     */
    public List<Object[]> findRoomCountByAccommodation(Boolean isActive) {
        return accommodationRoomRepository.findRoomCountByAccommodation(isActive);
    }

    // Advanced queries with relationships
    /**
     * Find accommodation room by ID with media
     */
    public Optional<AccommodationRoom> findByIdWithMedia(Integer id) {
        return accommodationRoomRepository.findByIdWithMedia(id);
    }

    /**
     * Find accommodation room by ID with accommodation and category
     */
    public Optional<AccommodationRoom> findByIdWithAccommodationAndCategory(Integer id) {
        return accommodationRoomRepository.findByIdWithAccommodationAndCategory(id);
    }

    // Validation queries
    /**
     * Check if accommodation room exists by name, accommodation ID and not ID
     */
    public boolean existsByNameAndAccommodationIdAndIdNot(String name, Integer accommodationId, Integer id) {
        return accommodationRoomRepository.existsByNameAndAccommodationIdAndIdNot(name, accommodationId, id);
    }

    /**
     * Check if accommodation room exists by accommodation ID and name
     */
    public boolean existsByAccommodationIdAndName(Integer accommodationId, String name) {
        return accommodationRoomRepository.existsByAccommodationIdAndName(accommodationId, name);
    }

    // Custom business logic queries
    /**
     * Find available rooms with images ordered by price
     */
    public List<AccommodationRoom> findAvailableRoomsWithImagesOrderByPrice(Pageable pageable) {
        return accommodationRoomRepository.findAvailableRoomsWithImagesOrderByPrice(pageable);
    }

    /**
     * Find available rooms by accommodation ordered by price
     */
    public List<AccommodationRoom> findAvailableRoomsByAccommodationOrderByPrice(Integer accommodationId) {
        return accommodationRoomRepository.findAvailableRoomsByAccommodationOrderByPrice(accommodationId);
    }

    /**
     * Find available rooms by capacity ordered by price
     */
    public List<AccommodationRoom> findAvailableRoomsByCapacityOrderByPrice(Integer requiredCapacity) {
        return accommodationRoomRepository.findAvailableRoomsByCapacityOrderByPrice(requiredCapacity);
    }

    /**
     * Find available rooms within budget ordered by capacity
     */
    public List<AccommodationRoom> findAvailableRoomsWithinBudgetOrderByCapacity(Double maxBudget) {
        return accommodationRoomRepository.findAvailableRoomsWithinBudgetOrderByCapacity(maxBudget);
    }
}
