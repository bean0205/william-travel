package com.williamtravel.app.repository;

import com.williamtravel.app.entity.AccommodationRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for AccommodationRoom entity operations
 */
@Repository
public interface AccommodationRoomRepository extends JpaRepository<AccommodationRoom, Integer> {

    // Basic finder methods
    List<AccommodationRoom> findByName(String name);
    
    List<AccommodationRoom> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<AccommodationRoom> findByIsActive(Boolean isActive);
    
    Page<AccommodationRoom> findByIsActive(Boolean isActive, Pageable pageable);
    
    List<AccommodationRoom> findByIsActiveOrderByNameAsc(Boolean isActive);
    
    List<AccommodationRoom> findByIsActiveOrderByPricePerNightAsc(Boolean isActive);
    
    // Accommodation relationship queries
    List<AccommodationRoom> findByAccommodationId(Integer accommodationId);
    
    Page<AccommodationRoom> findByAccommodationId(Integer accommodationId, Pageable pageable);
    
    List<AccommodationRoom> findByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive);
    
    Page<AccommodationRoom> findByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive, Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation WHERE ar.accommodation.id = :accommodationId AND ar.isActive = :isActive")
    List<AccommodationRoom> findByAccommodationIdAndIsActiveWithAccommodation(@Param("accommodationId") Integer accommodationId, @Param("isActive") Boolean isActive);
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation a WHERE a.isActive = :accommodationActive AND ar.isActive = :roomActive")
    List<AccommodationRoom> findByAccommodationActiveAndRoomActive(@Param("accommodationActive") Boolean accommodationActive, @Param("roomActive") Boolean roomActive);
    
    // Price-based queries
    List<AccommodationRoom> findByIsActiveAndPricePerNightLessThanEqual(Boolean isActive, Double maxPrice);
    
    List<AccommodationRoom> findByIsActiveAndPricePerNightBetween(Boolean isActive, Double minPrice, Double maxPrice);
    
    List<AccommodationRoom> findByIsActiveOrderByPricePerNightAsc(Boolean isActive, Pageable pageable);
    
    List<AccommodationRoom> findByIsActiveOrderByPricePerNightDesc(Boolean isActive, Pageable pageable);
    
    // Capacity-based queries
    List<AccommodationRoom> findByIsActiveAndCapacityGreaterThanEqual(Boolean isActive, Integer minCapacity);
    
    List<AccommodationRoom> findByIsActiveAndCapacityBetween(Boolean isActive, Integer minCapacity, Integer maxCapacity);
    
    List<AccommodationRoom> findByIsActiveOrderByCapacityAsc(Boolean isActive);
    
    List<AccommodationRoom> findByIsActiveOrderByCapacityDesc(Boolean isActive);
    
    // Search and filtering
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND " +
           "(:name IS NULL OR LOWER(ar.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:accommodationId IS NULL OR ar.accommodation.id = :accommodationId) AND " +
           "(:minPrice IS NULL OR ar.pricePerNight >= :minPrice) AND " +
           "(:maxPrice IS NULL OR ar.pricePerNight <= :maxPrice) AND " +
           "(:minCapacity IS NULL OR ar.capacity >= :minCapacity) AND " +
           "(:maxCapacity IS NULL OR ar.capacity <= :maxCapacity)")
    Page<AccommodationRoom> findWithFilters(@Param("isActive") Boolean isActive,
                                           @Param("name") String name,
                                           @Param("accommodationId") Integer accommodationId,
                                           @Param("minPrice") Double minPrice,
                                           @Param("maxPrice") Double maxPrice,
                                           @Param("minCapacity") Integer minCapacity,
                                           @Param("maxCapacity") Integer maxCapacity,
                                           Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation a WHERE " +
           "ar.isActive = :isActive AND " +
           "(:searchText IS NULL OR " +
           "LOWER(ar.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(ar.description) LIKE LOWER(CONCAT('%', :searchText, '%')))")
    List<AccommodationRoom> searchRooms(@Param("isActive") Boolean isActive, @Param("searchText") String searchText);
    
    // Geographic filtering through accommodation
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.accommodation.country.id = :countryId")
    List<AccommodationRoom> findByIsActiveAndCountryId(@Param("isActive") Boolean isActive, @Param("countryId") Integer countryId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.accommodation.region.id = :regionId")
    List<AccommodationRoom> findByIsActiveAndRegionId(@Param("isActive") Boolean isActive, @Param("regionId") Integer regionId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.accommodation.category.id = :categoryId")
    List<AccommodationRoom> findByIsActiveAndAccommodationCategoryId(@Param("isActive") Boolean isActive, @Param("categoryId") Integer categoryId);
    
    // Count queries
    long countByIsActive(Boolean isActive);
    
    long countByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive);
    
    @Query("SELECT COUNT(ar) FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.accommodation.isActive = :accommodationActive")
    long countByIsActiveAndAccommodationActive(@Param("isActive") Boolean isActive, @Param("accommodationActive") Boolean accommodationActive);
    
    // Date-based queries
    List<AccommodationRoom> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<AccommodationRoom> findByUpdatedAtAfter(LocalDateTime date);
    
    // Statistics queries
    @Query("SELECT AVG(ar.pricePerNight) FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.pricePerNight IS NOT NULL")
    Double findAveragePrice(@Param("isActive") Boolean isActive);
    
    @Query("SELECT AVG(ar.pricePerNight) FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.accommodation.id = :accommodationId AND ar.pricePerNight IS NOT NULL")
    Double findAveragePriceByAccommodation(@Param("isActive") Boolean isActive, @Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT MIN(ar.pricePerNight), MAX(ar.pricePerNight) FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.accommodation.id = :accommodationId AND ar.pricePerNight IS NOT NULL")
    List<Object[]> findPriceRangeByAccommodation(@Param("isActive") Boolean isActive, @Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT SUM(ar.capacity) FROM AccommodationRoom ar WHERE ar.isActive = :isActive AND ar.accommodation.id = :accommodationId")
    Integer findTotalCapacityByAccommodation(@Param("isActive") Boolean isActive, @Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT ar.accommodation.id, COUNT(ar) FROM AccommodationRoom ar WHERE ar.isActive = :isActive GROUP BY ar.accommodation.id")
    List<Object[]> findRoomCountByAccommodation(@Param("isActive") Boolean isActive);
    
    // Advanced queries with relationships
    @Query("SELECT ar FROM AccommodationRoom ar LEFT JOIN FETCH ar.media WHERE ar.id = :id")
    Optional<AccommodationRoom> findByIdWithMedia(@Param("id") Integer id);
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation a JOIN FETCH a.category WHERE ar.id = :id")
    Optional<AccommodationRoom> findByIdWithAccommodationAndCategory(@Param("id") Integer id);
    
    // Validation queries
    boolean existsByNameAndAccommodationIdAndIdNot(String name, Integer accommodationId, Integer id);
    
    boolean existsByAccommodationIdAndName(Integer accommodationId, String name);
    
    // Custom business logic queries
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = true AND ar.accommodation.isActive = true AND " +
           "ar.imageUrl IS NOT NULL ORDER BY ar.pricePerNight ASC")
    List<AccommodationRoom> findAvailableRoomsWithImagesOrderByPrice(Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = true AND ar.accommodation.isActive = true AND " +
           "ar.accommodation.id = :accommodationId ORDER BY ar.pricePerNight ASC")
    List<AccommodationRoom> findAvailableRoomsByAccommodationOrderByPrice(@Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = true AND ar.accommodation.isActive = true AND " +
           "ar.capacity >= :requiredCapacity ORDER BY ar.pricePerNight ASC")
    List<AccommodationRoom> findAvailableRoomsByCapacityOrderByPrice(@Param("requiredCapacity") Integer requiredCapacity);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.isActive = true AND ar.accommodation.isActive = true AND " +
           "ar.pricePerNight <= :maxBudget ORDER BY ar.capacity DESC")
    List<AccommodationRoom> findAvailableRoomsWithinBudgetOrderByCapacity(@Param("maxBudget") Double maxBudget);
}
