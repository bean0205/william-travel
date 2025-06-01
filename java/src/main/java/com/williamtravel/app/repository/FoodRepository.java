package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Food entity operations
 * Provides CRUD operations and custom queries for food management
 */
@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {

    // Basic finder methods
    Optional<Food> findByName(String name);
    
    Optional<Food> findByNameCode(String nameCode);
    
    boolean existsByName(String name);
    
    boolean existsByNameCode(String nameCode);

    // Status-based queries
    List<Food> findByStatus(Boolean status);
    
    Page<Food> findByStatus(Boolean status, Pageable pageable);

    // Category-based queries
    @Query("SELECT f FROM Food f WHERE f.category.id = :categoryId")
    List<Food> findByCategoryId(@Param("categoryId") Integer categoryId);
    
    @Query("SELECT f FROM Food f WHERE f.category.id = :categoryId AND f.status = :status")
    Page<Food> findByCategoryIdAndStatus(@Param("categoryId") Integer categoryId, 
                                        @Param("status") Boolean status, 
                                        Pageable pageable);

    // Country-based queries
    @Query("SELECT f FROM Food f WHERE f.country.id = :countryId")
    List<Food> findByCountryId(@Param("countryId") Integer countryId);
    
    @Query("SELECT f FROM Food f WHERE f.country.id = :countryId AND f.status = :status")
    Page<Food> findByCountryIdAndStatus(@Param("countryId") Integer countryId, 
                                       @Param("status") Boolean status, 
                                       Pageable pageable);

    // Region-based queries
    @Query("SELECT f FROM Food f WHERE f.region.id = :regionId")
    List<Food> findByRegionId(@Param("regionId") Integer regionId);
    
    @Query("SELECT f FROM Food f WHERE f.region.id = :regionId AND f.status = :status")
    Page<Food> findByRegionIdAndStatus(@Param("regionId") Integer regionId, 
                                      @Param("status") Boolean status, 
                                      Pageable pageable);

    // Price range queries
    @Query("SELECT f FROM Food f WHERE f.priceMin >= :minPrice AND f.priceMax <= :maxPrice AND f.status = true")
    List<Food> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                               @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT f FROM Food f WHERE f.priceMin >= :minPrice AND f.priceMax <= :maxPrice AND f.status = true")
    Page<Food> findByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                               @Param("maxPrice") BigDecimal maxPrice, 
                               Pageable pageable);

    // Search queries
    @Query("SELECT f FROM Food f WHERE " +
           "(LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "f.status = true")
    List<Food> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT f FROM Food f WHERE " +
           "(LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "f.status = true")
    Page<Food> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Popular food queries (by popularity score)
    @Query("SELECT f FROM Food f WHERE f.status = true ORDER BY f.popularityScore DESC")
    List<Food> findPopularFood(Pageable pageable);
    
    @Query("SELECT f FROM Food f WHERE f.category.id = :categoryId AND f.status = true ORDER BY f.popularityScore DESC")
    List<Food> findPopularFoodByCategory(@Param("categoryId") Integer categoryId, Pageable pageable);

    // Recently added food
    @Query("SELECT f FROM Food f WHERE f.status = true ORDER BY f.createdAt DESC")
    List<Food> findRecentFood(Pageable pageable);

    // Food with media
    @Query("SELECT DISTINCT f FROM Food f WHERE f.status = true AND EXISTS (SELECT m FROM Media m WHERE m.referenceId = f.id AND m.referenceType = 'food')")
    List<Food> findFoodWithMedia();

    // Statistical queries
    @Query("SELECT COUNT(f) FROM Food f WHERE f.status = true")
    Long countActiveFood();
    
    @Query("SELECT COUNT(f) FROM Food f WHERE f.category.id = :categoryId AND f.status = true")
    Long countActiveFoodByCategory(@Param("categoryId") Integer categoryId);
    
    @Query("SELECT COUNT(f) FROM Food f WHERE f.country.id = :countryId AND f.status = true")
    Long countActiveFoodByCountry(@Param("countryId") Integer countryId);

    // Advanced geographic queries
    @Query("SELECT f FROM Food f WHERE " +
           "f.country.id = :countryId AND " +
           "(:regionId IS NULL OR f.region.id = :regionId) AND " +
           "f.status = true")
    Page<Food> findByLocationFilters(@Param("countryId") Integer countryId,
                                    @Param("regionId") Integer regionId,
                                    Pageable pageable);

    // Complex search with multiple filters
    @Query("SELECT f FROM Food f WHERE " +
           "(:keyword IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR f.category.id = :categoryId) AND " +
           "(:countryId IS NULL OR f.country.id = :countryId) AND " +
           "(:minPrice IS NULL OR f.priceMin >= :minPrice) AND " +
           "(:maxPrice IS NULL OR f.priceMax <= :maxPrice) AND " +
           "f.status = true")
    Page<Food> findWithFilters(@Param("keyword") String keyword,
                              @Param("categoryId") Integer categoryId,
                              @Param("countryId") Integer countryId,
                              @Param("minPrice") BigDecimal minPrice,
                              @Param("maxPrice") BigDecimal maxPrice,
                              Pageable pageable);
}
