package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Region entity operations
 */
@Repository
public interface RegionRepository extends JpaRepository<Region, Integer> {

    // Basic finder methods
    Optional<Region> findByCode(String code);
    
    Optional<Region> findByName(String name);
    
    List<Region> findByNameContainingIgnoreCase(String name);
    
    boolean existsByCode(String code);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<Region> findByStatus(Integer status);
    
    Page<Region> findByStatus(Integer status, Pageable pageable);
    
    List<Region> findByStatusOrderByName(Integer status);
    
    // Country relationship queries
    List<Region> findByCountryId(Integer countryId);
    
    Page<Region> findByCountryId(Integer countryId, Pageable pageable);
    
    List<Region> findByCountryIdAndStatus(Integer countryId, Integer status);
    
    Page<Region> findByCountryIdAndStatus(Integer countryId, Integer status, Pageable pageable);
    
    @Query("SELECT r FROM Region r JOIN FETCH r.country WHERE r.country.id = :countryId")
    List<Region> findByCountryIdWithCountry(@Param("countryId") Integer countryId);
    
    @Query("SELECT r FROM Region r JOIN FETCH r.country WHERE r.country.id = :countryId AND r.status = :status")
    List<Region> findByCountryIdAndStatusWithCountry(@Param("countryId") Integer countryId, @Param("status") Integer status);
    
    // Count queries
    long countByCountryId(Integer countryId);
    
    long countByCountryIdAndStatus(Integer countryId, Integer status);
    
    long countByStatus(Integer status);
    
    // Search and filtering
    @Query("SELECT r FROM Region r WHERE " +
           "(:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:code IS NULL OR LOWER(r.code) LIKE LOWER(CONCAT('%', :code, '%'))) AND " +
           "(:countryId IS NULL OR r.country.id = :countryId) AND " +
           "(:status IS NULL OR r.status = :status)")
    Page<Region> findWithFilters(@Param("name") String name,
                                @Param("code") String code,
                                @Param("countryId") Integer countryId,
                                @Param("status") Integer status,
                                Pageable pageable);
    
    @Query("SELECT r FROM Region r JOIN FETCH r.country WHERE " +
           "(:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:status IS NULL OR r.status = :status)")
    List<Region> searchByNameWithCountry(@Param("name") String name, @Param("status") Integer status);
    
    // Date-based queries
    List<Region> findByCreatedDate(LocalDate createdDate);
    
    List<Region> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Region> findByUpdatedDate(LocalDate updatedDate);
    
    // Advanced queries with relationships
    @Query("SELECT r FROM Region r LEFT JOIN FETCH r.districts WHERE r.id = :id")
    Optional<Region> findByIdWithDistricts(@Param("id") Integer id);
    
    @Query("SELECT r FROM Region r LEFT JOIN FETCH r.locations WHERE r.id = :id")
    Optional<Region> findByIdWithLocations(@Param("id") Integer id);
    
    @Query("SELECT r FROM Region r LEFT JOIN FETCH r.accommodations WHERE r.id = :id")
    Optional<Region> findByIdWithAccommodations(@Param("id") Integer id);
    
    @Query("SELECT r FROM Region r LEFT JOIN FETCH r.foods WHERE r.id = :id")
    Optional<Region> findByIdWithFoods(@Param("id") Integer id);
    
    @Query("SELECT r FROM Region r LEFT JOIN FETCH r.events WHERE r.id = :id")
    Optional<Region> findByIdWithEvents(@Param("id") Integer id);
    
    // Statistics queries
    @Query("SELECT r, COUNT(l) FROM Region r LEFT JOIN r.locations l GROUP BY r")
    List<Object[]> findRegionsWithLocationCount();
    
    @Query("SELECT r, COUNT(a) FROM Region r LEFT JOIN r.accommodations a GROUP BY r")
    List<Object[]> findRegionsWithAccommodationCount();
    
    @Query("SELECT r, COUNT(f) FROM Region r LEFT JOIN r.foods f GROUP BY r")
    List<Object[]> findRegionsWithFoodCount();
    
    @Query("SELECT r, COUNT(e) FROM Region r LEFT JOIN r.events e GROUP BY r")
    List<Object[]> findRegionsWithEventCount();
    
    // Validation queries
    boolean existsByCodeAndIdNot(String code, Integer id);
    
    boolean existsByNameAndIdNot(String name, Integer id);
    
    boolean existsByCountryIdAndCodeAndIdNot(Integer countryId, String code, Integer id);
    
    // Custom queries for specific business logic
    @Query("SELECT r FROM Region r WHERE r.country.id = :countryId AND r.status = 1 ORDER BY r.name")
    List<Region> findActiveRegionsByCountry(@Param("countryId") Integer countryId);
    
    @Query("SELECT DISTINCT r FROM Region r WHERE r.backgroundImage IS NOT NULL AND r.status = 1")
    List<Region> findActiveRegionsWithBackgroundImage();
    
    @Query("SELECT r FROM Region r WHERE r.logo IS NOT NULL AND r.status = 1")
    List<Region> findActiveRegionsWithLogo();
}
