package com.williamtravel.app.controller;

import com.williamtravel.app.entity.AccommodationRoom;
import com.williamtravel.app.service.AccommodationRoomService;
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
 * REST Controller for AccommodationRoom operations
 */
@RestController
@RequestMapping("/api/accommodation-rooms")
@CrossOrigin(origins = "*")
public class AccommodationRoomController {

    @Autowired
    private AccommodationRoomService accommodationRoomService;

    /**
     * Get all accommodation rooms
     */
    @GetMapping
    public ResponseEntity<List<AccommodationRoom>> getAllAccommodationRooms() {
        List<AccommodationRoom> rooms = accommodationRoomService.findAll();
        return ResponseEntity.ok(rooms);
    }

    /**
     * Get accommodation room by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccommodationRoom> getAccommodationRoomById(@PathVariable Integer id) {
        Optional<AccommodationRoom> room = accommodationRoomService.findById(id);
        return room.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new accommodation room
     */
    @PostMapping
    public ResponseEntity<AccommodationRoom> createAccommodationRoom(@RequestBody AccommodationRoom room) {
        AccommodationRoom savedRoom = accommodationRoomService.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    /**
     * Update accommodation room
     */
    @PutMapping("/{id}")
    public ResponseEntity<AccommodationRoom> updateAccommodationRoom(@PathVariable Integer id, @RequestBody AccommodationRoom room) {
        if (!accommodationRoomService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        room.setId(id);
        AccommodationRoom updatedRoom = accommodationRoomService.save(room);
        return ResponseEntity.ok(updatedRoom);
    }

    /**
     * Delete accommodation room
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccommodationRoom(@PathVariable Integer id) {
        if (!accommodationRoomService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        accommodationRoomService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total accommodation rooms
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countAccommodationRooms() {
        long count = accommodationRoomService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== PAGINATION ====================

    /**
     * Get all accommodation rooms with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<AccommodationRoom>> getAllAccommodationRoomsPaginated(Pageable pageable) {
        Page<AccommodationRoom> rooms = accommodationRoomService.findAll(pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Check if accommodation room exists by ID
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        boolean exists = accommodationRoomService.existsById(id);
        return ResponseEntity.ok(exists);
    }

    // ==================== BASIC FINDERS ====================

    /**
     * Find accommodation rooms by name
     */
    @GetMapping("/by-name/{name}")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByName(@PathVariable String name) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByName(name);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by name containing (case insensitive)
     */
    @GetMapping("/search-name")
    public ResponseEntity<List<AccommodationRoom>> searchRoomsByName(@RequestParam String name) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Check if accommodation room exists by name
     */
    @GetMapping("/exists-by-name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = accommodationRoomService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    // ==================== STATUS-BASED QUERIES ====================

    /**
     * Find accommodation rooms by active status
     */
    @GetMapping("/by-status")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatus(@RequestParam Boolean isActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActive(isActive);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status with pagination
     */
    @GetMapping("/by-status/paginated")
    public ResponseEntity<Page<AccommodationRoom>> getRoomsByStatusPaginated(
            @RequestParam Boolean isActive, Pageable pageable) {
        Page<AccommodationRoom> rooms = accommodationRoomService.findByIsActive(isActive, pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status ordered by name
     */
    @GetMapping("/by-status/ordered-by-name")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusOrderedByName(@RequestParam Boolean isActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveOrderByNameAsc(isActive);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status ordered by price
     */
    @GetMapping("/by-status/ordered-by-price")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusOrderedByPrice(@RequestParam Boolean isActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveOrderByPricePerNightAsc(isActive);
        return ResponseEntity.ok(rooms);
    }

    // ==================== ACCOMMODATION RELATIONSHIPS ====================

    /**
     * Find accommodation rooms by accommodation ID
     */
    @GetMapping("/by-accommodation/{accommodationId}")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByAccommodation(@PathVariable Integer accommodationId) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByAccommodationId(accommodationId);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by accommodation ID with pagination
     */
    @GetMapping("/by-accommodation/{accommodationId}/paginated")
    public ResponseEntity<Page<AccommodationRoom>> getRoomsByAccommodationPaginated(
            @PathVariable Integer accommodationId, Pageable pageable) {
        Page<AccommodationRoom> rooms = accommodationRoomService.findByAccommodationId(accommodationId, pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by accommodation ID and active status
     */
    @GetMapping("/by-accommodation/{accommodationId}/status")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByAccommodationAndStatus(
            @PathVariable Integer accommodationId, @RequestParam Boolean isActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByAccommodationIdAndIsActive(accommodationId, isActive);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by accommodation ID and active status with pagination
     */
    @GetMapping("/by-accommodation/{accommodationId}/status/paginated")
    public ResponseEntity<Page<AccommodationRoom>> getRoomsByAccommodationAndStatusPaginated(
            @PathVariable Integer accommodationId, @RequestParam Boolean isActive, Pageable pageable) {
        Page<AccommodationRoom> rooms = accommodationRoomService.findByAccommodationIdAndIsActive(accommodationId, isActive, pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by accommodation ID and active status with accommodation entity
     */
    @GetMapping("/by-accommodation/{accommodationId}/status/with-accommodation")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByAccommodationAndStatusWithAccommodation(
            @PathVariable Integer accommodationId, @RequestParam Boolean isActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByAccommodationIdAndIsActiveWithAccommodation(accommodationId, isActive);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by accommodation active and room active status
     */
    @GetMapping("/by-accommodation-and-room-status")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByAccommodationAndRoomStatus(
            @RequestParam Boolean accommodationActive, @RequestParam Boolean roomActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByAccommodationActiveAndRoomActive(accommodationActive, roomActive);
        return ResponseEntity.ok(rooms);
    }

    // ==================== PRICE-BASED QUERIES ====================

    /**
     * Find accommodation rooms by active status and max price
     */
    @GetMapping("/by-status-and-max-price")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusAndMaxPrice(
            @RequestParam Boolean isActive, @RequestParam Double maxPrice) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveAndPricePerNightLessThanEqual(isActive, maxPrice);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status and price range
     */
    @GetMapping("/by-status-and-price-range")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusAndPriceRange(
            @RequestParam Boolean isActive, @RequestParam Double minPrice, @RequestParam Double maxPrice) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveAndPricePerNightBetween(isActive, minPrice, maxPrice);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status ordered by price ascending with pagination
     */
    @GetMapping("/by-status/ordered-by-price-asc/paginated")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusOrderedByPriceAscPaginated(
            @RequestParam Boolean isActive, Pageable pageable) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveOrderByPricePerNightAsc(isActive, pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status ordered by price descending with pagination
     */
    @GetMapping("/by-status/ordered-by-price-desc/paginated")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusOrderedByPriceDescPaginated(
            @RequestParam Boolean isActive, Pageable pageable) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveOrderByPricePerNightDesc(isActive, pageable);
        return ResponseEntity.ok(rooms);
    }

    // ==================== CAPACITY-BASED QUERIES ====================

    /**
     * Find accommodation rooms by active status and minimum capacity
     */
    @GetMapping("/by-status-and-min-capacity")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusAndMinCapacity(
            @RequestParam Boolean isActive, @RequestParam Integer minCapacity) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveAndCapacityGreaterThanEqual(isActive, minCapacity);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status and capacity range
     */
    @GetMapping("/by-status-and-capacity-range")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusAndCapacityRange(
            @RequestParam Boolean isActive, @RequestParam Integer minCapacity, @RequestParam Integer maxCapacity) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveAndCapacityBetween(isActive, minCapacity, maxCapacity);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status ordered by capacity ascending
     */
    @GetMapping("/by-status/ordered-by-capacity-asc")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusOrderedByCapacityAsc(@RequestParam Boolean isActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveOrderByCapacityAsc(isActive);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status ordered by capacity descending
     */
    @GetMapping("/by-status/ordered-by-capacity-desc")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusOrderedByCapacityDesc(@RequestParam Boolean isActive) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveOrderByCapacityDesc(isActive);
        return ResponseEntity.ok(rooms);
    }

    // ==================== SEARCH AND FILTERING ====================

    /**
     * Find accommodation rooms with filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<AccommodationRoom>> getRoomsWithFilters(
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer accommodationId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            Pageable pageable) {
        Page<AccommodationRoom> rooms = accommodationRoomService.findWithFilters(isActive, name, accommodationId, minPrice, maxPrice, minCapacity, maxCapacity, pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Search accommodation rooms
     */
    @GetMapping("/search")
    public ResponseEntity<List<AccommodationRoom>> searchRooms(
            @RequestParam Boolean isActive, @RequestParam String searchText) {
        List<AccommodationRoom> rooms = accommodationRoomService.searchRooms(isActive, searchText);
        return ResponseEntity.ok(rooms);
    }

    // ==================== GEOGRAPHIC FILTERING ====================

    /**
     * Find accommodation rooms by active status and country ID
     */
    @GetMapping("/by-status-and-country/{countryId}")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusAndCountry(
            @RequestParam Boolean isActive, @PathVariable Integer countryId) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveAndCountryId(isActive, countryId);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status and region ID
     */
    @GetMapping("/by-status-and-region/{regionId}")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusAndRegion(
            @RequestParam Boolean isActive, @PathVariable Integer regionId) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveAndRegionId(isActive, regionId);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms by active status and accommodation category ID
     */
    @GetMapping("/by-status-and-accommodation-category/{categoryId}")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByStatusAndAccommodationCategory(
            @RequestParam Boolean isActive, @PathVariable Integer categoryId) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByIsActiveAndAccommodationCategoryId(isActive, categoryId);
        return ResponseEntity.ok(rooms);
    }

    // ==================== COUNT QUERIES ====================

    /**
     * Count accommodation rooms by active status
     */
    @GetMapping("/count/by-status")
    public ResponseEntity<Long> countRoomsByStatus(@RequestParam Boolean isActive) {
        long count = accommodationRoomService.countByIsActive(isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count accommodation rooms by accommodation ID and active status
     */
    @GetMapping("/count/by-accommodation/{accommodationId}")
    public ResponseEntity<Long> countRoomsByAccommodationAndStatus(
            @PathVariable Integer accommodationId, @RequestParam Boolean isActive) {
        long count = accommodationRoomService.countByAccommodationIdAndIsActive(accommodationId, isActive);
        return ResponseEntity.ok(count);
    }

    /**
     * Count accommodation rooms by active status and accommodation active status
     */
    @GetMapping("/count/by-status-and-accommodation-status")
    public ResponseEntity<Long> countRoomsByStatusAndAccommodationStatus(
            @RequestParam Boolean isActive, @RequestParam Boolean accommodationActive) {
        long count = accommodationRoomService.countByIsActiveAndAccommodationActive(isActive, accommodationActive);
        return ResponseEntity.ok(count);
    }

    // ==================== DATE-BASED QUERIES ====================

    /**
     * Find accommodation rooms created between dates
     */
    @GetMapping("/by-created-date-range")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByCreatedDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByCreatedAtBetween(startDate, endDate);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find accommodation rooms updated after date
     */
    @GetMapping("/by-updated-after")
    public ResponseEntity<List<AccommodationRoom>> getRoomsByUpdatedAfter(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<AccommodationRoom> rooms = accommodationRoomService.findByUpdatedAtAfter(date);
        return ResponseEntity.ok(rooms);
    }

    // ==================== STATISTICS QUERIES ====================

    /**
     * Find average price by active status
     */
    @GetMapping("/statistics/average-price")
    public ResponseEntity<Double> getAveragePrice(@RequestParam Boolean isActive) {
        Double average = accommodationRoomService.findAveragePrice(isActive);
        return ResponseEntity.ok(average);
    }

    /**
     * Find average price by accommodation
     */
    @GetMapping("/statistics/average-price-by-accommodation/{accommodationId}")
    public ResponseEntity<Double> getAveragePriceByAccommodation(
            @RequestParam Boolean isActive, @PathVariable Integer accommodationId) {
        Double average = accommodationRoomService.findAveragePriceByAccommodation(isActive, accommodationId);
        return ResponseEntity.ok(average);
    }

    /**
     * Find price range by accommodation
     */
    @GetMapping("/statistics/price-range-by-accommodation/{accommodationId}")
    public ResponseEntity<List<Object[]>> getPriceRangeByAccommodation(
            @RequestParam Boolean isActive, @PathVariable Integer accommodationId) {
        List<Object[]> priceRange = accommodationRoomService.findPriceRangeByAccommodation(isActive, accommodationId);
        return ResponseEntity.ok(priceRange);
    }

    /**
     * Find total capacity by accommodation
     */
    @GetMapping("/statistics/total-capacity-by-accommodation/{accommodationId}")
    public ResponseEntity<Integer> getTotalCapacityByAccommodation(
            @RequestParam Boolean isActive, @PathVariable Integer accommodationId) {
        Integer totalCapacity = accommodationRoomService.findTotalCapacityByAccommodation(isActive, accommodationId);
        return ResponseEntity.ok(totalCapacity);
    }

    /**
     * Find room count by accommodation
     */
    @GetMapping("/statistics/room-count-by-accommodation")
    public ResponseEntity<List<Object[]>> getRoomCountByAccommodation(@RequestParam Boolean isActive) {
        List<Object[]> roomCount = accommodationRoomService.findRoomCountByAccommodation(isActive);
        return ResponseEntity.ok(roomCount);
    }

    // ==================== ADVANCED QUERIES WITH RELATIONSHIPS ====================

    /**
     * Find accommodation room by ID with media
     */
    @GetMapping("/{id}/with-media")
    public ResponseEntity<AccommodationRoom> getRoomByIdWithMedia(@PathVariable Integer id) {
        Optional<AccommodationRoom> room = accommodationRoomService.findByIdWithMedia(id);
        return room.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Find accommodation room by ID with accommodation and category
     */
    @GetMapping("/{id}/with-accommodation-and-category")
    public ResponseEntity<AccommodationRoom> getRoomByIdWithAccommodationAndCategory(@PathVariable Integer id) {
        Optional<AccommodationRoom> room = accommodationRoomService.findByIdWithAccommodationAndCategory(id);
        return room.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // ==================== VALIDATION QUERIES ====================

    /**
     * Check if accommodation room exists by name, accommodation ID and not ID
     */
    @GetMapping("/exists-by-name-and-accommodation-and-not-id")
    public ResponseEntity<Boolean> existsByNameAndAccommodationAndNotId(
            @RequestParam String name, @RequestParam Integer accommodationId, @RequestParam Integer id) {
        boolean exists = accommodationRoomService.existsByNameAndAccommodationIdAndIdNot(name, accommodationId, id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if accommodation room exists by accommodation ID and name
     */
    @GetMapping("/exists-by-accommodation-and-name")
    public ResponseEntity<Boolean> existsByAccommodationAndName(
            @RequestParam Integer accommodationId, @RequestParam String name) {
        boolean exists = accommodationRoomService.existsByAccommodationIdAndName(accommodationId, name);
        return ResponseEntity.ok(exists);
    }

    // ==================== CUSTOM BUSINESS LOGIC QUERIES ====================

    /**
     * Find available rooms with images ordered by price
     */
    @GetMapping("/available-with-images")
    public ResponseEntity<List<AccommodationRoom>> getAvailableRoomsWithImages(Pageable pageable) {
        List<AccommodationRoom> rooms = accommodationRoomService.findAvailableRoomsWithImagesOrderByPrice(pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find available rooms by accommodation ordered by price
     */
    @GetMapping("/available-by-accommodation/{accommodationId}")
    public ResponseEntity<List<AccommodationRoom>> getAvailableRoomsByAccommodation(@PathVariable Integer accommodationId) {
        List<AccommodationRoom> rooms = accommodationRoomService.findAvailableRoomsByAccommodationOrderByPrice(accommodationId);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find available rooms by capacity ordered by price
     */
    @GetMapping("/available-by-capacity/{requiredCapacity}")
    public ResponseEntity<List<AccommodationRoom>> getAvailableRoomsByCapacity(@PathVariable Integer requiredCapacity) {
        List<AccommodationRoom> rooms = accommodationRoomService.findAvailableRoomsByCapacityOrderByPrice(requiredCapacity);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Find available rooms within budget ordered by capacity
     */
    @GetMapping("/available-within-budget/{maxBudget}")
    public ResponseEntity<List<AccommodationRoom>> getAvailableRoomsWithinBudget(@PathVariable Double maxBudget) {
        List<AccommodationRoom> rooms = accommodationRoomService.findAvailableRoomsWithinBudgetOrderByCapacity(maxBudget);
        return ResponseEntity.ok(rooms);
    }
}
