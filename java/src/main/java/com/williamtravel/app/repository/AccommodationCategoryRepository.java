package com.williamtravel.app.repository;

import com.williamtravel.app.entity.AccommodationCategory;
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
 * Repository interface for AccommodationCategory entity operations
 */
@Repository
public interface AccommodationCategoryRepository extends JpaRepository<AccommodationCategory, Integer> {

    // Basic finder methods
    Optional<AccommodationCategory> findByName(String name);
    
    List<AccommodationCategory> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<AccommodationCategory> findByStatus(Boolean status);
    
    Page<AccommodationCategory> findByStatus(Boolean status, Pageable pageable);
    
    List<AccommodationCategory> findByStatusOrderByNameAsc(Boolean status);
    
    List<AccommodationCategory> findByStatusOrderByCreatedAtDesc(Boolean status);
    
    // Count queries
    long countByStatus(Boolean status);
    
    // Date-based queries
    List<AccommodationCategory> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<AccommodationCategory> findByUpdatedAtAfter(LocalDateTime date);
    
    List<AccommodationCategory> findByCreatedAtAfter(LocalDateTime date);
    
    // Search and filtering
    @Query("SELECT ac FROM AccommodationCategory ac WHERE " +
           "(:name IS NULL OR LOWER(ac.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:status IS NULL OR ac.status = :status)")
    Page<AccommodationCategory> findWithFilters(@Param("name") String name,
                                               @Param("status") Boolean status,
                                               Pageable pageable);
    
    @Query("SELECT ac FROM AccommodationCategory ac WHERE ac.status = :status AND " +
           "LOWER(ac.name) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<AccommodationCategory> searchByName(@Param("searchText") String searchText, @Param("status") Boolean status);
    
    // Advanced queries with relationships
    @Query("SELECT ac FROM AccommodationCategory ac LEFT JOIN FETCH ac.accommodations WHERE ac.id = :id")
    Optional<AccommodationCategory> findByIdWithAccommodations(@Param("id") Integer id);
    
    @Query("SELECT ac FROM AccommodationCategory ac LEFT JOIN FETCH ac.accommodations a WHERE ac.status = :status AND a.isActive = :accommodationActive")
    List<AccommodationCategory> findByStatusWithActiveAccommodations(@Param("status") Boolean status, @Param("accommodationActive") Boolean accommodationActive);
    
    // Statistics queries
    @Query("SELECT ac, COUNT(a) FROM AccommodationCategory ac LEFT JOIN ac.accommodations a WHERE a.isActive = :accommodationActive GROUP BY ac")
    List<Object[]> findCategoriesWithAccommodationCount(@Param("accommodationActive") Boolean accommodationActive);
    
    @Query("SELECT ac, COUNT(a) FROM AccommodationCategory ac LEFT JOIN ac.accommodations a WHERE ac.status = :status AND a.isActive = :accommodationActive GROUP BY ac")
    List<Object[]> findCategoriesWithAccommodationCountByStatus(@Param("status") Boolean status, @Param("accommodationActive") Boolean accommodationActive);
    
    @Query("SELECT COUNT(a) FROM AccommodationCategory ac JOIN ac.accommodations a WHERE ac.id = :categoryId AND a.isActive = :accommodationActive")
    long countActiveAccommodationsByCategoryId(@Param("categoryId") Integer categoryId, @Param("accommodationActive") Boolean accommodationActive);
    
    @Query("SELECT ac, AVG(a.rating) FROM AccommodationCategory ac LEFT JOIN ac.accommodations a WHERE ac.status = :status AND a.isActive = :accommodationActive AND a.rating IS NOT NULL GROUP BY ac")
    List<Object[]> findCategoriesWithAverageRating(@Param("status") Boolean status, @Param("accommodationActive") Boolean accommodationActive);
    
    // Validation queries
    boolean existsByNameAndIdNot(String name, Integer id);
    
    // Custom business logic queries
    @Query("SELECT ac FROM AccommodationCategory ac WHERE ac.status = true ORDER BY " +
           "(SELECT COUNT(a) FROM ac.accommodations a WHERE a.isActive = true) DESC")
    List<AccommodationCategory> findActiveCategoriesOrderedByAccommodationCount();
    
    @Query("SELECT ac FROM AccommodationCategory ac WHERE ac.status = true AND " +
           "EXISTS (SELECT 1 FROM ac.accommodations a WHERE a.isActive = true)")
    List<AccommodationCategory> findActiveCategoriesWithActiveAccommodations();
    
    @Query("SELECT ac FROM AccommodationCategory ac WHERE ac.status = true AND " +
           "NOT EXISTS (SELECT 1 FROM ac.accommodations a WHERE a.isActive = true)")
    List<AccommodationCategory> findActiveCategoriesWithoutActiveAccommodations();
    
    @Query("SELECT DISTINCT ac FROM AccommodationCategory ac JOIN ac.accommodations a WHERE " +
           "ac.status = true AND a.isActive = true AND a.country.id = :countryId")
    List<AccommodationCategory> findActiveCategoriesByCountry(@Param("countryId") Integer countryId);
    
    @Query("SELECT DISTINCT ac FROM AccommodationCategory ac JOIN ac.accommodations a WHERE " +
           "ac.status = true AND a.isActive = true AND a.region.id = :regionId")
    List<AccommodationCategory> findActiveCategoriesByRegion(@Param("regionId") Integer regionId);
    
    // Most popular categories by rating
    @Query("SELECT ac FROM AccommodationCategory ac WHERE ac.status = true ORDER BY " +
           "(SELECT COALESCE(AVG(a.rating), 0) FROM ac.accommodations a WHERE a.isActive = true) DESC")
    List<AccommodationCategory> findActiveCategoriesOrderedByAverageRating();
    
    // Categories with high-rated accommodations
    @Query("SELECT DISTINCT ac FROM AccommodationCategory ac JOIN ac.accommodations a WHERE " +
           "ac.status = true AND a.isActive = true AND a.rating >= :minRating")
    List<AccommodationCategory> findActiveCategoriesWithHighRatedAccommodations(@Param("minRating") Double minRating);
}
