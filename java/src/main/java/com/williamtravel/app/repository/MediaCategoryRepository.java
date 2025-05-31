package com.williamtravel.app.repository;

import com.williamtravel.app.entity.MediaCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MediaCategory entity operations
 * Provides CRUD operations and custom queries for media category management
 */
@Repository
public interface MediaCategoryRepository extends JpaRepository<MediaCategory, Integer> {

    // Basic finder methods
    Optional<MediaCategory> findByName(String name);
    
    boolean existsByName(String name);

    // Status-based queries
    List<MediaCategory> findByStatus(Boolean status);
    
    Page<MediaCategory> findByStatus(Boolean status, Pageable pageable);
    
    @Query("SELECT mc FROM MediaCategory mc WHERE mc.status = true ORDER BY mc.name ASC")
    List<MediaCategory> findAllActiveOrderByName();

    // Search queries
    @Query("SELECT mc FROM MediaCategory mc WHERE " +
           "(LOWER(mc.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(mc.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "mc.status = true")
    List<MediaCategory> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT mc FROM MediaCategory mc WHERE " +
           "(LOWER(mc.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(mc.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "mc.status = true")
    Page<MediaCategory> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Categories with media count
    @Query("SELECT mc, COUNT(m) FROM MediaCategory mc " +
           "LEFT JOIN mc.media m " +
           "WHERE mc.status = true " +
           "GROUP BY mc " +
           "ORDER BY mc.name ASC")
    List<Object[]> findCategoriesWithMediaCount();

    // Categories ordered by media count
    @Query("SELECT mc FROM MediaCategory mc " +
           "LEFT JOIN mc.media m " +
           "WHERE mc.status = true " +
           "GROUP BY mc " +
           "ORDER BY COUNT(m) DESC")
    List<MediaCategory> findCategoriesOrderByMediaCount();
    
    @Query("SELECT mc FROM MediaCategory mc " +
           "LEFT JOIN mc.media m " +
           "WHERE mc.status = true " +
           "GROUP BY mc " +
           "ORDER BY COUNT(m) DESC")
    Page<MediaCategory> findCategoriesOrderByMediaCount(Pageable pageable);

    // Categories with media
    @Query("SELECT DISTINCT mc FROM MediaCategory mc " +
           "JOIN mc.media m " +
           "WHERE mc.status = true")
    List<MediaCategory> findCategoriesWithMedia();

    // Categories by usage in specific reference type
    @Query("SELECT mc, COUNT(m) FROM MediaCategory mc " +
           "LEFT JOIN mc.media m ON m.referenceType = :referenceType " +
           "WHERE mc.status = true " +
           "GROUP BY mc " +
           "ORDER BY COUNT(m) DESC")
    List<Object[]> findCategoriesUsageByReferenceType(@Param("referenceType") String referenceType);

    // Statistical queries
    @Query("SELECT COUNT(mc) FROM MediaCategory mc WHERE mc.status = true")
    Long countActiveCategories();
    
    @Query("SELECT COUNT(m) FROM MediaCategory mc " +
           "JOIN mc.media m " +
           "WHERE mc.id = :categoryId AND mc.status = true")
    Long countMediaInCategory(@Param("categoryId") Integer categoryId);

    // Recently created categories
    @Query("SELECT mc FROM MediaCategory mc WHERE mc.status = true ORDER BY mc.createdAt DESC")
    List<MediaCategory> findRecentCategories(Pageable pageable);

    // Categories by creation date range
    @Query("SELECT mc FROM MediaCategory mc WHERE " +
           "mc.createdAt >= :startDate AND mc.createdAt <= :endDate AND " +
           "mc.status = true " +
           "ORDER BY mc.createdAt DESC")
    List<MediaCategory> findCategoriesByDateRange(@Param("startDate") java.time.LocalDateTime startDate,
                                                 @Param("endDate") java.time.LocalDateTime endDate);

    // Popular categories (by total file size)
    @Query("SELECT mc FROM MediaCategory mc " +
           "LEFT JOIN mc.media m " +
           "WHERE mc.status = true " +
           "GROUP BY mc " +
           "ORDER BY COALESCE(SUM(m.fileSize), 0) DESC")
    List<MediaCategory> findCategoriesByTotalFileSize(Pageable pageable);

    // Categories with media of specific type
    @Query("SELECT DISTINCT mc FROM MediaCategory mc " +
           "JOIN mc.media m " +
           "JOIN m.type mt " +
           "WHERE mc.status = true AND mt.id = :mediaTypeId")
    List<MediaCategory> findCategoriesWithMediaType(@Param("mediaTypeId") Integer mediaTypeId);

    // Categories used for specific entity type
    @Query("SELECT DISTINCT mc FROM MediaCategory mc " +
           "JOIN mc.media m " +
           "WHERE mc.status = true AND m.referenceType = :referenceType")
    List<MediaCategory> findCategoriesUsedForReferenceType(@Param("referenceType") String referenceType);

    // Empty categories (no media)
    @Query("SELECT mc FROM MediaCategory mc " +
           "LEFT JOIN mc.media m " +
           "WHERE mc.status = true " +
           "GROUP BY mc " +
           "HAVING COUNT(m) = 0")
    List<MediaCategory> findEmptyCategories();
}
