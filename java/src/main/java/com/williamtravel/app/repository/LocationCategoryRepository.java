package com.williamtravel.app.repository;

import com.williamtravel.app.entity.LocationCategory;
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
 * Repository interface for LocationCategory entity operations
 */
@Repository
public interface LocationCategoryRepository extends JpaRepository<LocationCategory, Integer> {

    // Basic finder methods
    Optional<LocationCategory> findByName(String name);
    
    List<LocationCategory> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<LocationCategory> findByStatus(Boolean status);
    
    Page<LocationCategory> findByStatus(Boolean status, Pageable pageable);
    
    List<LocationCategory> findByStatusOrderByNameAsc(Boolean status);
    
    List<LocationCategory> findByStatusOrderByCreatedAtDesc(Boolean status);
    
    // Count queries
    long countByStatus(Boolean status);
    
    // Date-based queries
    List<LocationCategory> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<LocationCategory> findByUpdatedAtAfter(LocalDateTime date);
    
    List<LocationCategory> findByCreatedAtAfter(LocalDateTime date);
    
    // Search and filtering
    @Query("SELECT lc FROM LocationCategory lc WHERE " +
           "(:name IS NULL OR LOWER(lc.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:status IS NULL OR lc.status = :status)")
    Page<LocationCategory> findWithFilters(@Param("name") String name,
                                          @Param("status") Boolean status,
                                          Pageable pageable);
    
    @Query("SELECT lc FROM LocationCategory lc WHERE lc.status = :status AND " +
           "LOWER(lc.name) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<LocationCategory> searchByName(@Param("searchText") String searchText, @Param("status") Boolean status);
    
    // Advanced queries with relationships
    @Query("SELECT lc FROM LocationCategory lc LEFT JOIN FETCH lc.locations WHERE lc.id = :id")
    Optional<LocationCategory> findByIdWithLocations(@Param("id") Integer id);
    
    @Query("SELECT lc FROM LocationCategory lc LEFT JOIN FETCH lc.locations l WHERE lc.status = :status AND l.isActive = :locationActive")
    List<LocationCategory> findByStatusWithActiveLocations(@Param("status") Boolean status, @Param("locationActive") Boolean locationActive);
    
    // Statistics queries
    @Query("SELECT lc, COUNT(l) FROM LocationCategory lc LEFT JOIN lc.locations l WHERE l.isActive = :locationActive GROUP BY lc")
    List<Object[]> findCategoriesWithLocationCount(@Param("locationActive") Boolean locationActive);
    
    @Query("SELECT lc, COUNT(l) FROM LocationCategory lc LEFT JOIN lc.locations l WHERE lc.status = :status AND l.isActive = :locationActive GROUP BY lc")
    List<Object[]> findCategoriesWithLocationCountByStatus(@Param("status") Boolean status, @Param("locationActive") Boolean locationActive);
    
    @Query("SELECT COUNT(l) FROM LocationCategory lc JOIN lc.locations l WHERE lc.id = :categoryId AND l.isActive = :locationActive")
    long countActiveLocationsByCategoryId(@Param("categoryId") Integer categoryId, @Param("locationActive") Boolean locationActive);
    
    // Validation queries
    boolean existsByNameAndIdNot(String name, Integer id);
    
    // Custom business logic queries
    @Query("SELECT lc FROM LocationCategory lc WHERE lc.status = true ORDER BY " +
           "(SELECT COUNT(l) FROM lc.locations l WHERE l.isActive = true) DESC")
    List<LocationCategory> findActiveCategoriesOrderedByLocationCount();
    
    @Query("SELECT lc FROM LocationCategory lc WHERE lc.status = true AND " +
           "EXISTS (SELECT 1 FROM lc.locations l WHERE l.isActive = true)")
    List<LocationCategory> findActiveCategoriesWithActiveLocations();
    
    @Query("SELECT lc FROM LocationCategory lc WHERE lc.status = true AND " +
           "NOT EXISTS (SELECT 1 FROM lc.locations l WHERE l.isActive = true)")
    List<LocationCategory> findActiveCategoriesWithoutActiveLocations();
    
    @Query("SELECT DISTINCT lc FROM LocationCategory lc JOIN lc.locations l WHERE " +
           "lc.status = true AND l.isActive = true AND l.country.id = :countryId")
    List<LocationCategory> findActiveCategoriesByCountry(@Param("countryId") Integer countryId);
    
    @Query("SELECT DISTINCT lc FROM LocationCategory lc JOIN lc.locations l WHERE " +
           "lc.status = true AND l.isActive = true AND l.region.id = :regionId")
    List<LocationCategory> findActiveCategoriesByRegion(@Param("regionId") Integer regionId);
    
    // Most popular categories
    @Query("SELECT lc FROM LocationCategory lc WHERE lc.status = true ORDER BY " +
           "(SELECT COALESCE(AVG(l.popularityScore), 0) FROM lc.locations l WHERE l.isActive = true) DESC")
    List<LocationCategory> findActiveCategoriesOrderedByAveragePopularity();
}
