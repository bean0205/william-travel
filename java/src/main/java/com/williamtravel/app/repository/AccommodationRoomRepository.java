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
    
    // Status-based queries (using status field: 1=active, 0=inactive)
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status")
    List<AccommodationRoom> findByStatus(@Param("status") Integer status);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status")
    Page<AccommodationRoom> findByStatus(@Param("status") Integer status, Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status ORDER BY ar.name ASC")
    List<AccommodationRoom> findByStatusOrderByNameAsc(@Param("status") Integer status);
    
    // Helper methods for backward compatibility
    default List<AccommodationRoom> findByIsActive(Boolean isActive) {
        return findByStatus(isActive ? 1 : 0);
    }
    
    default Page<AccommodationRoom> findByIsActive(Boolean isActive, Pageable pageable) {
        return findByStatus(isActive ? 1 : 0, pageable);
    }
    
    default List<AccommodationRoom> findByIsActiveOrderByNameAsc(Boolean isActive) {
        return findByStatusOrderByNameAsc(isActive ? 1 : 0);
    }
    
    // Accommodation relationship queries
    List<AccommodationRoom> findByAccommodationId(Integer accommodationId);
    
    Page<AccommodationRoom> findByAccommodationId(Integer accommodationId, Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.accommodation.id = :accommodationId AND ar.status = :status")
    List<AccommodationRoom> findByAccommodationIdAndStatus(@Param("accommodationId") Integer accommodationId, @Param("status") Integer status);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.accommodation.id = :accommodationId AND ar.status = :status")
    Page<AccommodationRoom> findByAccommodationIdAndStatus(@Param("accommodationId") Integer accommodationId, @Param("status") Integer status, Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation WHERE ar.accommodation.id = :accommodationId AND ar.status = :status")
    List<AccommodationRoom> findByAccommodationIdAndStatusWithAccommodation(@Param("accommodationId") Integer accommodationId, @Param("status") Integer status);
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation a WHERE a.isActive = :accommodationActive AND ar.status = :roomStatus")
    List<AccommodationRoom> findByAccommodationActiveAndRoomStatus(@Param("accommodationActive") Boolean accommodationActive, @Param("roomStatus") Integer roomStatus);
    
    // Helper methods for backward compatibility
    default List<AccommodationRoom> findByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive) {
        return findByAccommodationIdAndStatus(accommodationId, isActive ? 1 : 0);
    }
    
    default Page<AccommodationRoom> findByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive, Pageable pageable) {
        return findByAccommodationIdAndStatus(accommodationId, isActive ? 1 : 0, pageable);
    }
    
    default List<AccommodationRoom> findByAccommodationIdAndIsActiveWithAccommodation(Integer accommodationId, Boolean isActive) {
        return findByAccommodationIdAndStatusWithAccommodation(accommodationId, isActive ? 1 : 0);
    }
    
    default List<AccommodationRoom> findByAccommodationActiveAndRoomActive(Boolean accommodationActive, Boolean roomActive) {
        return findByAccommodationActiveAndRoomStatus(accommodationActive, roomActive ? 1 : 0);
    }
    
    // Price-based queries
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND ar.pricePerNight <= :maxPrice")
    List<AccommodationRoom> findByStatusAndPricePerNightLessThanEqual(@Param("status") Integer status, @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND ar.pricePerNight BETWEEN :minPrice AND :maxPrice")
    List<AccommodationRoom> findByStatusAndPricePerNightBetween(@Param("status") Integer status, @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status ORDER BY ar.pricePerNight ASC")
    List<AccommodationRoom> findByStatusOrderByPricePerNightAsc(@Param("status") Integer status, Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status ORDER BY ar.pricePerNight DESC")
    List<AccommodationRoom> findByStatusOrderByPricePerNightDesc(@Param("status") Integer status, Pageable pageable);
    
    // Capacity-based queries (using combined adult and child capacity)
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND (ar.adultCapacity + COALESCE(ar.childCapacity, 0)) >= :minCapacity")
    List<AccommodationRoom> findByStatusAndCapacityGreaterThanEqual(@Param("status") Integer status, @Param("minCapacity") Integer minCapacity);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND (ar.adultCapacity + COALESCE(ar.childCapacity, 0)) BETWEEN :minCapacity AND :maxCapacity")
    List<AccommodationRoom> findByStatusAndCapacityBetween(@Param("status") Integer status, @Param("minCapacity") Integer minCapacity, @Param("maxCapacity") Integer maxCapacity);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status ORDER BY (ar.adultCapacity + COALESCE(ar.childCapacity, 0)) ASC")
    List<AccommodationRoom> findByStatusOrderByCapacityAsc(@Param("status") Integer status);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status ORDER BY (ar.adultCapacity + COALESCE(ar.childCapacity, 0)) DESC")
    List<AccommodationRoom> findByStatusOrderByCapacityDesc(@Param("status") Integer status);
    
    // Helper methods for backward compatibility
    default List<AccommodationRoom> findByIsActiveAndPricePerNightLessThanEqual(Boolean isActive, Double maxPrice) {
        return findByStatusAndPricePerNightLessThanEqual(isActive ? 1 : 0, maxPrice);
    }
    
    default List<AccommodationRoom> findByIsActiveAndPricePerNightBetween(Boolean isActive, Double minPrice, Double maxPrice) {
        return findByStatusAndPricePerNightBetween(isActive ? 1 : 0, minPrice, maxPrice);
    }
    
    default List<AccommodationRoom> findByIsActiveOrderByPricePerNightAsc(Boolean isActive, Pageable pageable) {
        return findByStatusOrderByPricePerNightAsc(isActive ? 1 : 0, pageable);
    }
    
    default List<AccommodationRoom> findByIsActiveOrderByPricePerNightDesc(Boolean isActive, Pageable pageable) {
        return findByStatusOrderByPricePerNightDesc(isActive ? 1 : 0, pageable);
    }
    
    default List<AccommodationRoom> findByIsActiveAndCapacityGreaterThanEqual(Boolean isActive, Integer minCapacity) {
        return findByStatusAndCapacityGreaterThanEqual(isActive ? 1 : 0, minCapacity);
    }
    
    default List<AccommodationRoom> findByIsActiveAndCapacityBetween(Boolean isActive, Integer minCapacity, Integer maxCapacity) {
        return findByStatusAndCapacityBetween(isActive ? 1 : 0, minCapacity, maxCapacity);
    }
    
    default List<AccommodationRoom> findByIsActiveOrderByCapacityAsc(Boolean isActive) {
        return findByStatusOrderByCapacityAsc(isActive ? 1 : 0);
    }
    
    default List<AccommodationRoom> findByIsActiveOrderByCapacityDesc(Boolean isActive) {
        return findByStatusOrderByCapacityDesc(isActive ? 1 : 0);
    }
    
    // Search and filtering
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND " +
           "(:name IS NULL OR LOWER(ar.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:accommodationId IS NULL OR ar.accommodation.id = :accommodationId) AND " +
           "(:minPrice IS NULL OR ar.pricePerNight >= :minPrice) AND " +
           "(:maxPrice IS NULL OR ar.pricePerNight <= :maxPrice) AND " +
           "(:minCapacity IS NULL OR (ar.adultCapacity + COALESCE(ar.childCapacity, 0)) >= :minCapacity) AND " +
           "(:maxCapacity IS NULL OR (ar.adultCapacity + COALESCE(ar.childCapacity, 0)) <= :maxCapacity)")
    Page<AccommodationRoom> findWithFilters(@Param("status") Integer status,
                                           @Param("name") String name,
                                           @Param("accommodationId") Integer accommodationId,
                                           @Param("minPrice") Double minPrice,
                                           @Param("maxPrice") Double maxPrice,
                                           @Param("minCapacity") Integer minCapacity,
                                           @Param("maxCapacity") Integer maxCapacity,
                                           Pageable pageable);
    
    // Helper method for backward compatibility
    default Page<AccommodationRoom> findWithFilters(Boolean isActive,
                                           String name,
                                           Integer accommodationId,
                                           Double minPrice,
                                           Double maxPrice,
                                           Integer minCapacity,
                                           Integer maxCapacity,
                                           Pageable pageable) {
        return findWithFilters(isActive ? 1 : 0, name, accommodationId, minPrice, maxPrice, minCapacity, maxCapacity, pageable);
    }
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation a WHERE " +
           "ar.status = :status AND " +
           "(:searchText IS NULL OR " +
           "LOWER(ar.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(ar.description) LIKE LOWER(CONCAT('%', :searchText, '%')))")
    List<AccommodationRoom> searchRooms(@Param("status") Integer status, @Param("searchText") String searchText);
    
    // Helper method for backward compatibility
    default List<AccommodationRoom> searchRooms(Boolean isActive, String searchText) {
        return searchRooms(isActive ? 1 : 0, searchText);
    }
    
    // Geographic filtering through accommodation
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND ar.accommodation.country.id = :countryId")
    List<AccommodationRoom> findByStatusAndCountryId(@Param("status") Integer status, @Param("countryId") Integer countryId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND ar.accommodation.region.id = :regionId")
    List<AccommodationRoom> findByStatusAndRegionId(@Param("status") Integer status, @Param("regionId") Integer regionId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = :status AND ar.accommodation.category.id = :categoryId")
    List<AccommodationRoom> findByStatusAndAccommodationCategoryId(@Param("status") Integer status, @Param("categoryId") Integer categoryId);
    
    // Helper methods for backward compatibility
    default List<AccommodationRoom> findByIsActiveAndCountryId(Boolean isActive, Integer countryId) {
        return findByStatusAndCountryId(isActive ? 1 : 0, countryId);
    }
    
    default List<AccommodationRoom> findByIsActiveAndRegionId(Boolean isActive, Integer regionId) {
        return findByStatusAndRegionId(isActive ? 1 : 0, regionId);
    }
    
    default List<AccommodationRoom> findByIsActiveAndAccommodationCategoryId(Boolean isActive, Integer categoryId) {
        return findByStatusAndAccommodationCategoryId(isActive ? 1 : 0, categoryId);
    }
    
    // Count queries
    @Query("SELECT COUNT(ar) FROM AccommodationRoom ar WHERE ar.status = :status")
    long countByStatus(@Param("status") Integer status);
    
    @Query("SELECT COUNT(ar) FROM AccommodationRoom ar WHERE ar.accommodation.id = :accommodationId AND ar.status = :status")
    long countByAccommodationIdAndStatus(@Param("accommodationId") Integer accommodationId, @Param("status") Integer status);
    
    @Query("SELECT COUNT(ar) FROM AccommodationRoom ar WHERE ar.status = :roomStatus AND ar.accommodation.isActive = :accommodationActive")
    long countByStatusAndAccommodationActive(@Param("roomStatus") Integer roomStatus, @Param("accommodationActive") Boolean accommodationActive);
    
    // Helper methods for backward compatibility
    default long countByIsActive(Boolean isActive) {
        return countByStatus(isActive ? 1 : 0);
    }
    
    default long countByAccommodationIdAndIsActive(Integer accommodationId, Boolean isActive) {
        return countByAccommodationIdAndStatus(accommodationId, isActive ? 1 : 0);
    }
    
    default long countByIsActiveAndAccommodationActive(Boolean isActive, Boolean accommodationActive) {
        return countByStatusAndAccommodationActive(isActive ? 1 : 0, accommodationActive);
    }
    
    // Date-based queries
    List<AccommodationRoom> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<AccommodationRoom> findByUpdatedAtAfter(LocalDateTime date);
    
    // Statistics queries
    @Query("SELECT AVG(ar.pricePerNight) FROM AccommodationRoom ar WHERE ar.status = :status AND ar.pricePerNight IS NOT NULL")
    Double findAveragePrice(@Param("status") Integer status);
    
    @Query("SELECT AVG(ar.pricePerNight) FROM AccommodationRoom ar WHERE ar.status = :status AND ar.accommodation.id = :accommodationId AND ar.pricePerNight IS NOT NULL")
    Double findAveragePriceByAccommodation(@Param("status") Integer status, @Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT MIN(ar.pricePerNight), MAX(ar.pricePerNight) FROM AccommodationRoom ar WHERE ar.status = :status AND ar.accommodation.id = :accommodationId AND ar.pricePerNight IS NOT NULL")
    List<Object[]> findPriceRangeByAccommodation(@Param("status") Integer status, @Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT SUM(ar.adultCapacity + COALESCE(ar.childCapacity, 0)) FROM AccommodationRoom ar WHERE ar.status = :status AND ar.accommodation.id = :accommodationId")
    Integer findTotalCapacityByAccommodation(@Param("status") Integer status, @Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT ar.accommodation.id, COUNT(ar) FROM AccommodationRoom ar WHERE ar.status = :status GROUP BY ar.accommodation.id")
    List<Object[]> findRoomCountByAccommodation(@Param("status") Integer status);
    
    // Helper methods for backward compatibility
    default Double findAveragePrice(Boolean isActive) {
        return findAveragePrice(isActive ? 1 : 0);
    }
    
    default Double findAveragePriceByAccommodation(Boolean isActive, Integer accommodationId) {
        return findAveragePriceByAccommodation(isActive ? 1 : 0, accommodationId);
    }
    
    default List<Object[]> findPriceRangeByAccommodation(Boolean isActive, Integer accommodationId) {
        return findPriceRangeByAccommodation(isActive ? 1 : 0, accommodationId);
    }
    
    default Integer findTotalCapacityByAccommodation(Boolean isActive, Integer accommodationId) {
        return findTotalCapacityByAccommodation(isActive ? 1 : 0, accommodationId);
    }
    
    default List<Object[]> findRoomCountByAccommodation(Boolean isActive) {
        return findRoomCountByAccommodation(isActive ? 1 : 0);
    }
    
    // Advanced queries with relationships
    @Query("SELECT ar FROM AccommodationRoom ar LEFT JOIN FETCH ar.media WHERE ar.id = :id")
    Optional<AccommodationRoom> findByIdWithMedia(@Param("id") Integer id);
    
    @Query("SELECT ar FROM AccommodationRoom ar JOIN FETCH ar.accommodation a JOIN FETCH a.category WHERE ar.id = :id")
    Optional<AccommodationRoom> findByIdWithAccommodationAndCategory(@Param("id") Integer id);
    
    // Validation queries
    boolean existsByNameAndAccommodationIdAndIdNot(String name, Integer accommodationId, Integer id);
    
    boolean existsByAccommodationIdAndName(Integer accommodationId, String name);
    
    // Custom business logic queries
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = 1 AND ar.accommodation.isActive = true AND " +
           "EXISTS (SELECT 1 FROM Media m WHERE m.referenceId = ar.id AND m.referenceType = 'accommodation_room') ORDER BY ar.pricePerNight ASC")
    List<AccommodationRoom> findAvailableRoomsWithImagesOrderByPrice(Pageable pageable);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = 1 AND ar.accommodation.isActive = true AND " +
           "ar.accommodation.id = :accommodationId ORDER BY ar.pricePerNight ASC")
    List<AccommodationRoom> findAvailableRoomsByAccommodationOrderByPrice(@Param("accommodationId") Integer accommodationId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = 1 AND ar.accommodation.isActive = true AND " +
           "(ar.adultCapacity + COALESCE(ar.childCapacity, 0)) >= :requiredCapacity ORDER BY ar.pricePerNight ASC")
    List<AccommodationRoom> findAvailableRoomsByCapacityOrderByPrice(@Param("requiredCapacity") Integer requiredCapacity);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.status = 1 AND ar.accommodation.isActive = true AND " +
           "ar.pricePerNight <= :maxBudget ORDER BY (ar.adultCapacity + COALESCE(ar.childCapacity, 0)) DESC")
    List<AccommodationRoom> findAvailableRoomsWithinBudgetOrderByCapacity(@Param("maxBudget") Double maxBudget);
}
