package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Rating;
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
 * Repository interface for Rating entity operations
 * Provides CRUD operations and custom queries for rating management
 */
@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {

    // Find by reference (entity being rated)
    @Query("SELECT r FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType")
    List<Rating> findByReference(@Param("referenceId") Integer referenceId, 
                                @Param("referenceType") String referenceType);
    
    @Query("SELECT r FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType ORDER BY r.createdAt DESC")
    Page<Rating> findByReference(@Param("referenceId") Integer referenceId, 
                                @Param("referenceType") String referenceType, 
                                Pageable pageable);

    // Find by user
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Rating> findByUserId(@Param("userId") Integer userId);
    
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    Page<Rating> findByUserId(@Param("userId") Integer userId, Pageable pageable);

    // Find specific user rating for entity
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId AND r.referenceId = :referenceId AND r.referenceType = :referenceType")
    Optional<Rating> findByUserAndReference(@Param("userId") Integer userId, 
                                           @Param("referenceId") Integer referenceId, 
                                           @Param("referenceType") String referenceType);

    // Check if user has rated entity
    @Query("SELECT COUNT(r) > 0 FROM Rating r WHERE r.user.id = :userId AND r.referenceId = :referenceId AND r.referenceType = :referenceType")
    boolean existsByUserAndReference(@Param("userId") Integer userId, 
                                    @Param("referenceId") Integer referenceId, 
                                    @Param("referenceType") String referenceType);

    // Find by reference type
    @Query("SELECT r FROM Rating r WHERE r.referenceType = :referenceType ORDER BY r.createdAt DESC")
    List<Rating> findByReferenceType(@Param("referenceType") String referenceType);
    
    @Query("SELECT r FROM Rating r WHERE r.referenceType = :referenceType ORDER BY r.createdAt DESC")
    Page<Rating> findByReferenceType(@Param("referenceType") String referenceType, Pageable pageable);

    // Find by rating value range
    @Query("SELECT r FROM Rating r WHERE r.rating >= :minRating AND r.rating <= :maxRating ORDER BY r.createdAt DESC")
    List<Rating> findByRatingRange(@Param("minRating") Double minRating, @Param("maxRating") Double maxRating);

    // Recent ratings
    @Query("SELECT r FROM Rating r ORDER BY r.createdAt DESC")
    List<Rating> findRecentRatings(Pageable pageable);

    // Ratings by date range
    @Query("SELECT r FROM Rating r WHERE " +
           "r.createdAt >= :startDate AND r.createdAt <= :endDate " +
           "ORDER BY r.createdAt DESC")
    List<Rating> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                @Param("endDate") LocalDateTime endDate);

    // Search in review content
    @Query("SELECT r FROM Rating r WHERE " +
           "r.comment IS NOT NULL AND " +
           "LOWER(r.comment) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY r.createdAt DESC")
    List<Rating> searchByReviewContent(@Param("keyword") String keyword);
    
    @Query("SELECT r FROM Rating r WHERE " +
           "r.comment IS NOT NULL AND " +
           "LOWER(r.comment) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY r.createdAt DESC")
    Page<Rating> searchByReviewContent(@Param("keyword") String keyword, Pageable pageable);

    // Statistical queries
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType")
    Double findAverageRatingByReference(@Param("referenceId") Integer referenceId, 
                                       @Param("referenceType") String referenceType);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType")
    Long countRatingsByReference(@Param("referenceId") Integer referenceId, 
                                @Param("referenceType") String referenceType);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.user.id = :userId")
    Long countRatingsByUser(@Param("userId") Integer userId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.referenceType = :referenceType")
    Long countRatingsByType(@Param("referenceType") String referenceType);

    // Rating distribution for entity
    @Query("SELECT r.rating, COUNT(r) FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType GROUP BY r.rating ORDER BY r.rating")
    List<Object[]> findRatingDistributionByReference(@Param("referenceId") Integer referenceId, 
                                                    @Param("referenceType") String referenceType);

    // Top rated entities by type
    @Query("SELECT r.referenceId, AVG(r.rating), COUNT(r) FROM Rating r " +
           "WHERE r.referenceType = :referenceType " +
           "GROUP BY r.referenceId " +
           "HAVING COUNT(r) >= :minRatingCount " +
           "ORDER BY AVG(r.rating) DESC")
    List<Object[]> findTopRatedEntitiesByType(@Param("referenceType") String referenceType, 
                                             @Param("minRatingCount") Long minRatingCount, 
                                             Pageable pageable);

    // Most reviewed entities by type
    @Query("SELECT r.referenceId, COUNT(r), AVG(r.rating) FROM Rating r " +
           "WHERE r.referenceType = :referenceType " +
           "GROUP BY r.referenceId " +
           "ORDER BY COUNT(r) DESC")
    List<Object[]> findMostReviewedEntitiesByType(@Param("referenceType") String referenceType, Pageable pageable);

    // Recent ratings for specific entity type
    @Query("SELECT r FROM Rating r WHERE r.referenceType = :referenceType ORDER BY r.createdAt DESC")
    List<Rating> findRecentRatingsByType(@Param("referenceType") String referenceType, Pageable pageable);

    // Ratings with reviews
    @Query("SELECT r FROM Rating r WHERE r.comment IS NOT NULL AND r.comment != '' ORDER BY r.createdAt DESC")
    List<Rating> findRatingsWithReviews();
    
    @Query("SELECT r FROM Rating r WHERE r.comment IS NOT NULL AND r.comment != '' ORDER BY r.createdAt DESC")
    Page<Rating> findRatingsWithReviews(Pageable pageable);

    // Ratings with reviews for specific entity
    @Query("SELECT r FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType AND r.comment IS NOT NULL AND r.comment != '' ORDER BY r.createdAt DESC")
    List<Rating> findRatingsWithReviewsByReference(@Param("referenceId") Integer referenceId, 
                                                  @Param("referenceType") String referenceType);
    
    @Query("SELECT r FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType AND r.comment IS NOT NULL AND r.comment != '' ORDER BY r.createdAt DESC")
    Page<Rating> findRatingsWithReviewsByReference(@Param("referenceId") Integer referenceId, 
                                                  @Param("referenceType") String referenceType, 
                                                  Pageable pageable);

    // Most active raters
    @Query("SELECT r.user.id, r.user.fullName, COUNT(r), AVG(r.rating) FROM Rating r " +
           "GROUP BY r.user.id, r.user.fullName " +
           "ORDER BY COUNT(r) DESC")
    List<Object[]> findMostActiveRaters(Pageable pageable);

    // User rating statistics
    @Query("SELECT AVG(r.rating), COUNT(r), MIN(r.rating), MAX(r.rating) FROM Rating r WHERE r.user.id = :userId")
    List<Object[]> findUserRatingStatistics(@Param("userId") Integer userId);
}
