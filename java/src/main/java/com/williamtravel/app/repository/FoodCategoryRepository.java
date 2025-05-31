package com.williamtravel.app.repository;

import com.williamtravel.app.entity.FoodCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for FoodCategory entity operations
 * Provides CRUD operations and custom queries for food category management
 */
@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Integer> {

    // Basic finder methods
    Optional<FoodCategory> findByName(String name);
    
    boolean existsByName(String name);

    // Status-based queries
    List<FoodCategory> findByStatus(Boolean status);
    
    Page<FoodCategory> findByStatus(Boolean status, Pageable pageable);
    
    @Query("SELECT fc FROM FoodCategory fc WHERE fc.status = true ORDER BY fc.name ASC")
    List<FoodCategory> findAllActiveOrderByName();

    // Search queries
    @Query("SELECT fc FROM FoodCategory fc WHERE " +
           "LOWER(fc.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
           "fc.status = true")
    List<FoodCategory> searchByName(@Param("keyword") String keyword);
    
    @Query("SELECT fc FROM FoodCategory fc WHERE " +
           "LOWER(fc.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
           "fc.status = true")
    Page<FoodCategory> searchByName(@Param("keyword") String keyword, Pageable pageable);

    // Categories with food count
    @Query("SELECT fc, COUNT(f) FROM FoodCategory fc " +
           "LEFT JOIN fc.foods f ON f.status = true " +
           "WHERE fc.status = true " +
           "GROUP BY fc " +
           "ORDER BY fc.name ASC")
    List<Object[]> findCategoriesWithFoodCount();

    // Categories ordered by food count
    @Query("SELECT fc FROM FoodCategory fc " +
           "LEFT JOIN fc.foods f ON f.status = true " +
           "WHERE fc.status = true " +
           "GROUP BY fc " +
           "ORDER BY COUNT(f) DESC")
    List<FoodCategory> findCategoriesOrderByFoodCount();
    
    @Query("SELECT fc FROM FoodCategory fc " +
           "LEFT JOIN fc.foods f ON f.status = true " +
           "WHERE fc.status = true " +
           "GROUP BY fc " +
           "ORDER BY COUNT(f) DESC")
    Page<FoodCategory> findCategoriesOrderByFoodCount(Pageable pageable);

    // Categories with active foods
    @Query("SELECT DISTINCT fc FROM FoodCategory fc " +
           "JOIN fc.foods f " +
           "WHERE fc.status = true AND f.status = true")
    List<FoodCategory> findCategoriesWithActiveFood();

    // Statistical queries
    @Query("SELECT COUNT(fc) FROM FoodCategory fc WHERE fc.status = true")
    Long countActiveCategories();
    
    @Query("SELECT COUNT(f) FROM FoodCategory fc " +
           "JOIN fc.foods f " +
           "WHERE fc.id = :categoryId AND fc.status = true AND f.status = true")
    Long countActiveFoodInCategory(@Param("categoryId") Integer categoryId);

    // Recently created categories
    @Query("SELECT fc FROM FoodCategory fc WHERE fc.status = true ORDER BY fc.createdAt DESC")
    List<FoodCategory> findRecentCategories(Pageable pageable);

    // Categories by creation date range
    @Query("SELECT fc FROM FoodCategory fc WHERE " +
           "fc.createdAt >= :startDate AND fc.createdAt <= :endDate AND " +
           "fc.status = true " +
           "ORDER BY fc.createdAt DESC")
    List<FoodCategory> findCategoriesByDateRange(@Param("startDate") java.time.LocalDateTime startDate,
                                                @Param("endDate") java.time.LocalDateTime endDate);

    // Popular categories (by total food views)
    @Query("SELECT fc FROM FoodCategory fc " +
           "LEFT JOIN fc.foods f ON f.status = true " +
           "WHERE fc.status = true " +
           "GROUP BY fc " +
           "ORDER BY COALESCE(SUM(f.viewCount), 0) DESC")
    List<FoodCategory> findPopularCategories(Pageable pageable);
}
