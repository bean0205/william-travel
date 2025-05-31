package com.williamtravel.app.service;

import com.williamtravel.app.entity.Rating;
import com.williamtravel.app.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Rating entity operations
 */
@Service
@Transactional
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    /**
     * Find all ratings
     */
    public List<Rating> findAll() {
        return ratingRepository.findAll();
    }

    /**
     * Find rating by ID
     */
    public Optional<Rating> findById(Integer id) {
        return ratingRepository.findById(id);
    }

    /**
     * Save rating
     */
    public Rating save(Rating rating) {
        return ratingRepository.save(rating);
    }

    /**
     * Delete rating by ID
     */
    public void deleteById(Integer id) {
        ratingRepository.deleteById(id);
    }

    /**
     * Count total ratings
     */
    public long count() {
        return ratingRepository.count();
    }

    /**
     * Check if rating exists by ID
     */
    public boolean existsById(Integer id) {
        return ratingRepository.existsById(id);
    }

    /**
     * Find ratings with pagination
     */
    public Page<Rating> findAll(Pageable pageable) {
        return ratingRepository.findAll(pageable);
    }

    // Find by reference (entity being rated)
    /**
     * Find ratings by reference
     */
    public List<Rating> findByReference(Integer referenceId, String referenceType) {
        return ratingRepository.findByReference(referenceId, referenceType);
    }

    /**
     * Find ratings by reference with pagination
     */
    public Page<Rating> findByReference(Integer referenceId, String referenceType, Pageable pageable) {
        return ratingRepository.findByReference(referenceId, referenceType, pageable);
    }

    // Find by user
    /**
     * Find ratings by user ID
     */
    public List<Rating> findByUserId(Integer userId) {
        return ratingRepository.findByUserId(userId);
    }

    /**
     * Find ratings by user ID with pagination
     */
    public Page<Rating> findByUserId(Integer userId, Pageable pageable) {
        return ratingRepository.findByUserId(userId, pageable);
    }

    // Find specific user rating for entity
    /**
     * Find rating by user and reference
     */
    public Optional<Rating> findByUserAndReference(Integer userId, Integer referenceId, String referenceType) {
        return ratingRepository.findByUserAndReference(userId, referenceId, referenceType);
    }

    // Check if user has rated entity
    /**
     * Check if user has rated entity
     */
    public boolean existsByUserAndReference(Integer userId, Integer referenceId, String referenceType) {
        return ratingRepository.existsByUserAndReference(userId, referenceId, referenceType);
    }

    // Find by reference type
    /**
     * Find ratings by reference type
     */
    public List<Rating> findByReferenceType(String referenceType) {
        return ratingRepository.findByReferenceType(referenceType);
    }

    /**
     * Find ratings by reference type with pagination
     */
    public Page<Rating> findByReferenceType(String referenceType, Pageable pageable) {
        return ratingRepository.findByReferenceType(referenceType, pageable);
    }

    // Find by rating value range
    /**
     * Find ratings by rating range
     */
    public List<Rating> findByRatingRange(Double minRating, Double maxRating) {
        return ratingRepository.findByRatingRange(minRating, maxRating);
    }

    // Recent ratings
    /**
     * Find recent ratings
     */
    public List<Rating> findRecentRatings(Pageable pageable) {
        return ratingRepository.findRecentRatings(pageable);
    }

    // Ratings by date range
    /**
     * Find ratings by date range
     */
    public List<Rating> findByDateRange(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        return ratingRepository.findByDateRange(startDate, endDate);
    }

    // Search in review content
    /**
     * Search ratings by review content
     */
    public List<Rating> searchByReviewContent(String keyword) {
        return ratingRepository.searchByReviewContent(keyword);
    }

    /**
     * Search ratings by review content with pagination
     */
    public Page<Rating> searchByReviewContent(String keyword, Pageable pageable) {
        return ratingRepository.searchByReviewContent(keyword, pageable);
    }

    // Statistical queries
    /**
     * Find average rating by reference
     */
    public Double findAverageRatingByReference(Integer referenceId, String referenceType) {
        return ratingRepository.findAverageRatingByReference(referenceId, referenceType);
    }

    /**
     * Count ratings by reference
     */
    public Long countRatingsByReference(Integer referenceId, String referenceType) {
        return ratingRepository.countRatingsByReference(referenceId, referenceType);
    }

    /**
     * Count ratings by user
     */
    public Long countRatingsByUser(Integer userId) {
        return ratingRepository.countRatingsByUser(userId);
    }

    /**
     * Count ratings by type
     */
    public Long countRatingsByType(String referenceType) {
        return ratingRepository.countRatingsByType(referenceType);
    }

    // Rating distribution for entity
    /**
     * Find rating distribution by reference
     */
    public List<Object[]> findRatingDistributionByReference(Integer referenceId, String referenceType) {
        return ratingRepository.findRatingDistributionByReference(referenceId, referenceType);
    }

    // Top rated entities by type
    /**
     * Find top rated entities by type
     */
    public List<Object[]> findTopRatedEntitiesByType(String referenceType, Long minRatingCount, Pageable pageable) {
        return ratingRepository.findTopRatedEntitiesByType(referenceType, minRatingCount, pageable);
    }

    // Most reviewed entities by type
    /**
     * Find most reviewed entities by type
     */
    public List<Object[]> findMostReviewedEntitiesByType(String referenceType, Pageable pageable) {
        return ratingRepository.findMostReviewedEntitiesByType(referenceType, pageable);
    }

    // Recent ratings for specific entity type
    /**
     * Find recent ratings by type
     */
    public List<Rating> findRecentRatingsByType(String referenceType, Pageable pageable) {
        return ratingRepository.findRecentRatingsByType(referenceType, pageable);
    }

    // Ratings with reviews
    /**
     * Find ratings with reviews
     */
    public List<Rating> findRatingsWithReviews() {
        return ratingRepository.findRatingsWithReviews();
    }

    /**
     * Find ratings with reviews with pagination
     */
    public Page<Rating> findRatingsWithReviews(Pageable pageable) {
        return ratingRepository.findRatingsWithReviews(pageable);
    }

    // Ratings with reviews for specific entity
    /**
     * Find ratings with reviews by reference
     */
    public List<Rating> findRatingsWithReviewsByReference(Integer referenceId, String referenceType) {
        return ratingRepository.findRatingsWithReviewsByReference(referenceId, referenceType);
    }

    /**
     * Find ratings with reviews by reference with pagination
     */
    public Page<Rating> findRatingsWithReviewsByReference(Integer referenceId, String referenceType, Pageable pageable) {
        return ratingRepository.findRatingsWithReviewsByReference(referenceId, referenceType, pageable);
    }

    // Most active raters
    /**
     * Find most active raters
     */
    public List<Object[]> findMostActiveRaters(Pageable pageable) {
        return ratingRepository.findMostActiveRaters(pageable);
    }

    // User rating statistics
    /**
     * Find user rating statistics
     */
    public List<Object[]> findUserRatingStatistics(Integer userId) {
        return ratingRepository.findUserRatingStatistics(userId);
    }
}
