package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Accommodation;
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
 * Repository interface for Accommodation entity operations
 */
@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Integer> {

    // Basic finder methods
    List<Accommodation> findByName(String name);
    
    List<Accommodation> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<Accommodation> findByIsActive(Boolean isActive);
    
    Page<Accommodation> findByIsActive(Boolean isActive, Pageable pageable);
    
    List<Accommodation> findByIsActiveOrderByRatingDesc(Boolean isActive);
    
    List<Accommodation> findByIsActiveOrderByNameAsc(Boolean isActive);
    
    // Category relationship queries
    List<Accommodation> findByCategoryId(Integer categoryId);
    
    Page<Accommodation> findByCategoryId(Integer categoryId, Pageable pageable);
    
    List<Accommodation> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive);
    
    Page<Accommodation> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive, Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a JOIN FETCH a.category WHERE a.category.id = :categoryId AND a.isActive = :isActive")
    List<Accommodation> findByCategoryIdAndIsActiveWithCategory(@Param("categoryId") Integer categoryId, @Param("isActive") Boolean isActive);
    
    // User relationship queries
    List<Accommodation> findByUserId(Integer userId);
    
    Page<Accommodation> findByUserId(Integer userId, Pageable pageable);
    
    List<Accommodation> findByUserIdAndIsActive(Integer userId, Boolean isActive);
    
    @Query("SELECT a FROM Accommodation a JOIN FETCH a.user WHERE a.user.id = :userId AND a.isActive = :isActive")
    List<Accommodation> findByUserIdAndIsActiveWithUser(@Param("userId") Integer userId, @Param("isActive") Boolean isActive);
    
    // Geographic relationship queries
    List<Accommodation> findByCountryId(Integer countryId);
    
    List<Accommodation> findByCountryIdAndIsActive(Integer countryId, Boolean isActive);
    
    List<Accommodation> findByRegionId(Integer regionId);
    
    List<Accommodation> findByRegionIdAndIsActive(Integer regionId, Boolean isActive);
    
    List<Accommodation> findByDistrictId(Integer districtId);
    
    List<Accommodation> findByDistrictIdAndIsActive(Integer districtId, Boolean isActive);
    
    List<Accommodation> findByWardId(Integer wardId);
    
    List<Accommodation> findByWardIdAndIsActive(Integer wardId, Boolean isActive);
    
    // Geographic queries with relationships
    @Query("SELECT a FROM Accommodation a JOIN FETCH a.country WHERE a.country.id = :countryId AND a.isActive = :isActive")
    List<Accommodation> findByCountryIdAndIsActiveWithCountry(@Param("countryId") Integer countryId, @Param("isActive") Boolean isActive);
    
    @Query("SELECT a FROM Accommodation a JOIN FETCH a.region r JOIN FETCH r.country WHERE a.region.id = :regionId AND a.isActive = :isActive")
    List<Accommodation> findByRegionIdAndIsActiveWithRegionAndCountry(@Param("regionId") Integer regionId, @Param("isActive") Boolean isActive);
    
    @Query("SELECT a FROM Accommodation a LEFT JOIN FETCH a.country LEFT JOIN FETCH a.region LEFT JOIN FETCH a.district LEFT JOIN FETCH a.ward WHERE a.id = :id")
    Optional<Accommodation> findByIdWithFullGeography(@Param("id") Integer id);
    
    // Rating and price queries
    List<Accommodation> findByIsActiveAndRatingGreaterThanEqual(Boolean isActive, Double minRating);
    
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = :isActive AND a.rating BETWEEN :minRating AND :maxRating")
    List<Accommodation> findByIsActiveAndRatingBetween(@Param("isActive") Boolean isActive, 
                                                      @Param("minRating") Double minRating, 
                                                      @Param("maxRating") Double maxRating);
    
    List<Accommodation> findByIsActiveOrderByRatingDesc(Boolean isActive, Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = :isActive AND a.rating IS NOT NULL ORDER BY a.rating DESC")
    List<Accommodation> findTopAccommodationsByRating(@Param("isActive") Boolean isActive, Pageable pageable);
    
    // Geographic proximity queries
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = :isActive AND " +
           "a.latitude BETWEEN :minLat AND :maxLat AND " +
           "a.longitude BETWEEN :minLng AND :maxLng")
    List<Accommodation> findByIsActiveAndCoordinatesBounds(@Param("isActive") Boolean isActive,
                                                          @Param("minLat") Double minLat,
                                                          @Param("maxLat") Double maxLat,
                                                          @Param("minLng") Double minLng,
                                                          @Param("maxLng") Double maxLng);
    
    // Search and filtering
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = :isActive AND " +
           "(:name IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId IS NULL OR a.category.id = :categoryId) AND " +
           "(:countryId IS NULL OR a.country.id = :countryId) AND " +
           "(:regionId IS NULL OR a.region.id = :regionId) AND " +
           "(:city IS NULL OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:minRating IS NULL OR a.rating >= :minRating)")
    Page<Accommodation> findWithFilters(@Param("isActive") Boolean isActive,
                                       @Param("name") String name,
                                       @Param("categoryId") Integer categoryId,
                                       @Param("countryId") Integer countryId,
                                       @Param("regionId") Integer regionId,
                                       @Param("city") String city,
                                       @Param("minRating") Double minRating,
                                       Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a JOIN FETCH a.category JOIN FETCH a.country WHERE " +
           "a.isActive = :isActive AND " +
           "(:searchText IS NULL OR " +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(a.city) LIKE LOWER(CONCAT('%', :searchText, '%')))")
    List<Accommodation> searchAccommodations(@Param("isActive") Boolean isActive, @Param("searchText") String searchText);
    
    // Count queries
    long countByIsActive(Boolean isActive);
    
    long countByCategoryIdAndIsActive(Integer categoryId, Boolean isActive);
    
    long countByCountryIdAndIsActive(Integer countryId, Boolean isActive);
    
    long countByRegionIdAndIsActive(Integer regionId, Boolean isActive);
    
    long countByUserId(Integer userId);
    
    // Date-based queries
    List<Accommodation> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Accommodation> findByUpdatedAtAfter(LocalDateTime date);
    
    // Statistics queries
    @Query("SELECT a.category.name, COUNT(a) FROM Accommodation a WHERE a.isActive = :isActive GROUP BY a.category.name")
    List<Object[]> findAccommodationCountByCategory(@Param("isActive") Boolean isActive);
    
    @Query("SELECT a.country.name, COUNT(a) FROM Accommodation a WHERE a.isActive = :isActive GROUP BY a.country.name")
    List<Object[]> findAccommodationCountByCountry(@Param("isActive") Boolean isActive);
    
    @Query("SELECT a.region.name, COUNT(a) FROM Accommodation a WHERE a.isActive = :isActive AND a.region IS NOT NULL GROUP BY a.region.name")
    List<Object[]> findAccommodationCountByRegion(@Param("isActive") Boolean isActive);
    
    @Query("SELECT AVG(a.rating) FROM Accommodation a WHERE a.isActive = :isActive AND a.rating IS NOT NULL")
    Double findAverageRating(@Param("isActive") Boolean isActive);
    
    @Query("SELECT AVG(a.rating) FROM Accommodation a WHERE a.isActive = :isActive AND a.category.id = :categoryId AND a.rating IS NOT NULL")
    Double findAverageRatingByCategory(@Param("isActive") Boolean isActive, @Param("categoryId") Integer categoryId);
    
    // Advanced queries with relationships
    @Query("SELECT a FROM Accommodation a LEFT JOIN FETCH a.rooms WHERE a.id = :id")
    Optional<Accommodation> findByIdWithRooms(@Param("id") Integer id);
    
    @Query("SELECT a FROM Accommodation a LEFT JOIN FETCH a.media WHERE a.id = :id")
    Optional<Accommodation> findByIdWithMedia(@Param("id") Integer id);
    
    // Validation queries
    boolean existsByNameAndIdNot(String name, Integer id);
    
    boolean existsByLatitudeAndLongitudeAndIdNot(Double latitude, Double longitude, Integer id);
    
    // Custom business logic queries
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = true AND a.imageUrl IS NOT NULL ORDER BY a.rating DESC")
    List<Accommodation> findFeaturedAccommodationsWithImages(Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = true AND a.country.id = :countryId ORDER BY a.rating DESC")
    List<Accommodation> findTopAccommodationsByCountry(@Param("countryId") Integer countryId, Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = true AND a.region.id = :regionId ORDER BY a.rating DESC")
    List<Accommodation> findTopAccommodationsByRegion(@Param("regionId") Integer regionId, Pageable pageable);
    
    @Query("SELECT DISTINCT a.city FROM Accommodation a WHERE a.isActive = true AND a.city IS NOT NULL AND " +
           "(:countryId IS NULL OR a.country.id = :countryId) ORDER BY a.city")
    List<String> findDistinctActiveCitiesByCountry(@Param("countryId") Integer countryId);
    
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = true AND a.category.id = :categoryId ORDER BY a.rating DESC")
    List<Accommodation> findTopAccommodationsByCategory(@Param("categoryId") Integer categoryId, Pageable pageable);
}
