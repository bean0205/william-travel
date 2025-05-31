package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Location;
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
 * Repository interface for Location entity operations
 */
@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

    // Basic finder methods
    List<Location> findByName(String name);
    
    List<Location> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<Location> findByIsActive(Boolean isActive);
    
    Page<Location> findByIsActive(Boolean isActive, Pageable pageable);
    
    List<Location> findByIsActiveOrderByPopularityScoreDesc(Boolean isActive);
    
    List<Location> findByIsActiveOrderByNameAsc(Boolean isActive);
    
    // Category relationship queries
    List<Location> findByCategoryId(Integer categoryId);
    
    Page<Location> findByCategoryId(Integer categoryId, Pageable pageable);
    
    List<Location> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive);
    
    Page<Location> findByCategoryIdAndIsActive(Integer categoryId, Boolean isActive, Pageable pageable);
    
    @Query("SELECT l FROM Location l JOIN FETCH l.category WHERE l.category.id = :categoryId AND l.isActive = :isActive")
    List<Location> findByCategoryIdAndIsActiveWithCategory(@Param("categoryId") Integer categoryId, @Param("isActive") Boolean isActive);
    
    // Geographic relationship queries
    List<Location> findByCountryId(Integer countryId);
    
    List<Location> findByCountryIdAndIsActive(Integer countryId, Boolean isActive);
    
    List<Location> findByRegionId(Integer regionId);
    
    List<Location> findByRegionIdAndIsActive(Integer regionId, Boolean isActive);
    
    List<Location> findByDistrictId(Integer districtId);
    
    List<Location> findByDistrictIdAndIsActive(Integer districtId, Boolean isActive);
    
    List<Location> findByWardId(Integer wardId);
    
    List<Location> findByWardIdAndIsActive(Integer wardId, Boolean isActive);
    
    // Geographic queries with relationships
    @Query("SELECT l FROM Location l JOIN FETCH l.country WHERE l.country.id = :countryId AND l.isActive = :isActive")
    List<Location> findByCountryIdAndIsActiveWithCountry(@Param("countryId") Integer countryId, @Param("isActive") Boolean isActive);
    
    @Query("SELECT l FROM Location l JOIN FETCH l.region r JOIN FETCH r.country WHERE l.region.id = :regionId AND l.isActive = :isActive")
    List<Location> findByRegionIdAndIsActiveWithRegionAndCountry(@Param("regionId") Integer regionId, @Param("isActive") Boolean isActive);
    
    @Query("SELECT l FROM Location l LEFT JOIN FETCH l.country LEFT JOIN FETCH l.region LEFT JOIN FETCH l.district LEFT JOIN FETCH l.ward WHERE l.id = :id")
    Optional<Location> findByIdWithFullGeography(@Param("id") Integer id);
    
    // Price range queries
    List<Location> findByPriceMinLessThanEqualAndPriceMaxGreaterThanEqual(Double maxBudget, Double minBudget);
    
    @Query("SELECT l FROM Location l WHERE l.isActive = :isActive AND " +
           "(:minPrice IS NULL OR l.priceMin >= :minPrice) AND " +
           "(:maxPrice IS NULL OR l.priceMax <= :maxPrice)")
    List<Location> findByIsActiveAndPriceRange(@Param("isActive") Boolean isActive, 
                                              @Param("minPrice") Double minPrice, 
                                              @Param("maxPrice") Double maxPrice);
    
    // Popularity and ranking queries
    List<Location> findByIsActiveOrderByPopularityScoreDesc(Boolean isActive, Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE l.isActive = :isActive AND l.popularityScore IS NOT NULL ORDER BY l.popularityScore DESC")
    List<Location> findTopLocationsByPopularity(@Param("isActive") Boolean isActive, Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE l.category.id = :categoryId AND l.isActive = :isActive ORDER BY l.popularityScore DESC")
    List<Location> findTopLocationsByCategoryAndPopularity(@Param("categoryId") Integer categoryId, 
                                                          @Param("isActive") Boolean isActive, 
                                                          Pageable pageable);
    
    // Geographic proximity queries
    @Query("SELECT l FROM Location l WHERE l.isActive = :isActive AND " +
           "l.latitude BETWEEN :minLat AND :maxLat AND " +
           "l.longitude BETWEEN :minLng AND :maxLng")
    List<Location> findByIsActiveAndCoordinatesBounds(@Param("isActive") Boolean isActive,
                                                     @Param("minLat") Double minLat,
                                                     @Param("maxLat") Double maxLat,
                                                     @Param("minLng") Double minLng,
                                                     @Param("maxLng") Double maxLng);
    
    // Search and filtering
    @Query("SELECT l FROM Location l WHERE l.isActive = :isActive AND " +
           "(:name IS NULL OR LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId IS NULL OR l.category.id = :categoryId) AND " +
           "(:countryId IS NULL OR l.country.id = :countryId) AND " +
           "(:regionId IS NULL OR l.region.id = :regionId) AND " +
           "(:city IS NULL OR LOWER(l.city) LIKE LOWER(CONCAT('%', :city, '%')))")
    Page<Location> findWithFilters(@Param("isActive") Boolean isActive,
                                  @Param("name") String name,
                                  @Param("categoryId") Integer categoryId,
                                  @Param("countryId") Integer countryId,
                                  @Param("regionId") Integer regionId,
                                  @Param("city") String city,
                                  Pageable pageable);
    
    @Query("SELECT l FROM Location l JOIN FETCH l.category JOIN FETCH l.country WHERE " +
           "l.isActive = :isActive AND " +
           "(:searchText IS NULL OR " +
           "LOWER(l.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(l.city) LIKE LOWER(CONCAT('%', :searchText, '%')))")
    List<Location> searchLocations(@Param("isActive") Boolean isActive, @Param("searchText") String searchText);
    
    // Count queries
    long countByIsActive(Boolean isActive);
    
    long countByCategoryIdAndIsActive(Integer categoryId, Boolean isActive);
    
    long countByCountryIdAndIsActive(Integer countryId, Boolean isActive);
    
    long countByRegionIdAndIsActive(Integer regionId, Boolean isActive);
    
    // Date-based queries
    List<Location> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Location> findByUpdatedAtAfter(LocalDateTime date);
    
    // Statistics queries
    @Query("SELECT l.category.name, COUNT(l) FROM Location l WHERE l.isActive = :isActive GROUP BY l.category.name")
    List<Object[]> findLocationCountByCategory(@Param("isActive") Boolean isActive);
    
    @Query("SELECT l.country.name, COUNT(l) FROM Location l WHERE l.isActive = :isActive GROUP BY l.country.name")
    List<Object[]> findLocationCountByCountry(@Param("isActive") Boolean isActive);
    
    @Query("SELECT l.region.name, COUNT(l) FROM Location l WHERE l.isActive = :isActive AND l.region IS NOT NULL GROUP BY l.region.name")
    List<Object[]> findLocationCountByRegion(@Param("isActive") Boolean isActive);
    
    @Query("SELECT AVG(l.popularityScore) FROM Location l WHERE l.isActive = :isActive AND l.popularityScore IS NOT NULL")
    Double findAveragePopularityScore(@Param("isActive") Boolean isActive);
    
    // Validation queries
    boolean existsByNameAndIdNot(String name, Integer id);
    
    boolean existsByLatitudeAndLongitudeAndIdNot(Double latitude, Double longitude, Integer id);
    
    // Custom business logic queries
    @Query("SELECT l FROM Location l WHERE l.isActive = true AND l.thumbnailUrl IS NOT NULL ORDER BY l.popularityScore DESC")
    List<Location> findFeaturedLocationsWithImages(Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE l.isActive = true AND l.country.id = :countryId ORDER BY l.popularityScore DESC")
    List<Location> findTopLocationsByCountry(@Param("countryId") Integer countryId, Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE l.isActive = true AND l.region.id = :regionId ORDER BY l.popularityScore DESC")
    List<Location> findTopLocationsByRegion(@Param("regionId") Integer regionId, Pageable pageable);
    
    @Query("SELECT DISTINCT l.city FROM Location l WHERE l.isActive = true AND l.city IS NOT NULL AND " +
           "(:countryId IS NULL OR l.country.id = :countryId) ORDER BY l.city")
    List<String> findDistinctActiveCitiesByCountry(@Param("countryId") Integer countryId);
}
