package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Rating;
import com.williamtravel.app.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Rating operations
 */
@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all ratings
     */
    @GetMapping
    public ResponseEntity<List<Rating>> getAllRatings() {
        List<Rating> ratings = ratingService.findAll();
        return ResponseEntity.ok(ratings);
    }

    /**
     * Get rating by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Rating> getRatingById(@PathVariable Integer id) {
        Optional<Rating> rating = ratingService.findById(id);
        return rating.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new rating
     */
    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating) {
        Rating savedRating = ratingService.save(rating);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRating);
    }

    /**
     * Update rating
     */
    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable Integer id, @RequestBody Rating rating) {
        if (!ratingService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rating.setId(id);
        Rating updatedRating = ratingService.save(rating);
        return ResponseEntity.ok(updatedRating);
    }

    /**
     * Delete rating
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Integer id) {
        if (!ratingService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        ratingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total ratings
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countRatings() {
        long count = ratingService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    // Pagination
    /**
     * Get all ratings with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Rating>> getRatingsPage(Pageable pageable) {
        Page<Rating> ratings = ratingService.findAll(pageable);
        return ResponseEntity.ok(ratings);
    }

    // Find by reference (entity being rated)
    /**
     * Get ratings by reference
     */
    @GetMapping("/reference/{referenceId}/{referenceType}")
    public ResponseEntity<List<Rating>> getRatingsByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        List<Rating> ratings = ratingService.findByReference(referenceId, referenceType);
        return ResponseEntity.ok(ratings);
    }

    /**
     * Get ratings by reference with pagination
     */
    @GetMapping("/reference/{referenceId}/{referenceType}/page")
    public ResponseEntity<Page<Rating>> getRatingsByReferencePage(@PathVariable Integer referenceId, @PathVariable String referenceType, Pageable pageable) {
        Page<Rating> ratings = ratingService.findByReference(referenceId, referenceType, pageable);
        return ResponseEntity.ok(ratings);
    }

    // Find by user
    /**
     * Get ratings by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getRatingsByUserId(@PathVariable Integer userId) {
        List<Rating> ratings = ratingService.findByUserId(userId);
        return ResponseEntity.ok(ratings);
    }

    /**
     * Get ratings by user ID with pagination
     */
    @GetMapping("/user/{userId}/page")
    public ResponseEntity<Page<Rating>> getRatingsByUserIdPage(@PathVariable Integer userId, Pageable pageable) {
        Page<Rating> ratings = ratingService.findByUserId(userId, pageable);
        return ResponseEntity.ok(ratings);
    }

    // Find specific user rating for entity
    /**
     * Get rating by user and reference
     */
    @GetMapping("/user/{userId}/reference/{referenceId}/{referenceType}")
    public ResponseEntity<Rating> getRatingByUserAndReference(@PathVariable Integer userId, @PathVariable Integer referenceId, @PathVariable String referenceType) {
        Optional<Rating> rating = ratingService.findByUserAndReference(userId, referenceId, referenceType);
        return rating.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if user has rated entity
     */
    @GetMapping("/exists/user/{userId}/reference/{referenceId}/{referenceType}")
    public ResponseEntity<Boolean> existsByUserAndReference(@PathVariable Integer userId, @PathVariable Integer referenceId, @PathVariable String referenceType) {
        boolean exists = ratingService.existsByUserAndReference(userId, referenceId, referenceType);
        return ResponseEntity.ok(exists);
    }

    // Find by reference type
    /**
     * Get ratings by reference type
     */
    @GetMapping("/type/{referenceType}")
    public ResponseEntity<List<Rating>> getRatingsByReferenceType(@PathVariable String referenceType) {
        List<Rating> ratings = ratingService.findByReferenceType(referenceType);
        return ResponseEntity.ok(ratings);
    }

    /**
     * Get ratings by reference type with pagination
     */
    @GetMapping("/type/{referenceType}/page")
    public ResponseEntity<Page<Rating>> getRatingsByReferenceTypePage(@PathVariable String referenceType, Pageable pageable) {
        Page<Rating> ratings = ratingService.findByReferenceType(referenceType, pageable);
        return ResponseEntity.ok(ratings);
    }

    // Find by rating value range
    /**
     * Get ratings by rating range
     */
    @GetMapping("/range")
    public ResponseEntity<List<Rating>> getRatingsByRange(@RequestParam Double minRating, @RequestParam Double maxRating) {
        List<Rating> ratings = ratingService.findByRatingRange(minRating, maxRating);
        return ResponseEntity.ok(ratings);
    }

    // Recent ratings
    /**
     * Get recent ratings
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Rating>> getRecentRatings(Pageable pageable) {
        List<Rating> ratings = ratingService.findRecentRatings(pageable);
        return ResponseEntity.ok(ratings);
    }

    // Ratings by date range
    /**
     * Get ratings by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Rating>> getRatingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Rating> ratings = ratingService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(ratings);
    }

    // Search in review content
    /**
     * Search ratings by review content
     */
    @GetMapping("/search")
    public ResponseEntity<List<Rating>> searchRatingsByReviewContent(@RequestParam String keyword) {
        List<Rating> ratings = ratingService.searchByReviewContent(keyword);
        return ResponseEntity.ok(ratings);
    }

    /**
     * Search ratings by review content with pagination
     */
    @GetMapping("/search/page")
    public ResponseEntity<Page<Rating>> searchRatingsByReviewContentPage(@RequestParam String keyword, Pageable pageable) {
        Page<Rating> ratings = ratingService.searchByReviewContent(keyword, pageable);
        return ResponseEntity.ok(ratings);
    }

    // Statistical queries
    /**
     * Get average rating by reference
     */
    @GetMapping("/average/reference/{referenceId}/{referenceType}")
    public ResponseEntity<Double> getAverageRatingByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        Double average = ratingService.findAverageRatingByReference(referenceId, referenceType);
        return ResponseEntity.ok(average);
    }

    /**
     * Count ratings by reference
     */
    @GetMapping("/count/reference/{referenceId}/{referenceType}")
    public ResponseEntity<Long> countRatingsByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        Long count = ratingService.countRatingsByReference(referenceId, referenceType);
        return ResponseEntity.ok(count);
    }

    /**
     * Count ratings by user
     */
    @GetMapping("/count/user/{userId}")
    public ResponseEntity<Long> countRatingsByUser(@PathVariable Integer userId) {
        Long count = ratingService.countRatingsByUser(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count ratings by type
     */
    @GetMapping("/count/type/{referenceType}")
    public ResponseEntity<Long> countRatingsByType(@PathVariable String referenceType) {
        Long count = ratingService.countRatingsByType(referenceType);
        return ResponseEntity.ok(count);
    }

    // Rating distribution for entity
    /**
     * Get rating distribution by reference
     */
    @GetMapping("/distribution/reference/{referenceId}/{referenceType}")
    public ResponseEntity<List<Object[]>> getRatingDistributionByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        List<Object[]> distribution = ratingService.findRatingDistributionByReference(referenceId, referenceType);
        return ResponseEntity.ok(distribution);
    }

    // Top rated entities by type
    /**
     * Get top rated entities by type
     */
    @GetMapping("/top-rated/type/{referenceType}")
    public ResponseEntity<List<Object[]>> getTopRatedEntitiesByType(@PathVariable String referenceType, @RequestParam Long minRatingCount, Pageable pageable) {
        List<Object[]> topRated = ratingService.findTopRatedEntitiesByType(referenceType, minRatingCount, pageable);
        return ResponseEntity.ok(topRated);
    }

    // Most reviewed entities by type
    /**
     * Get most reviewed entities by type
     */
    @GetMapping("/most-reviewed/type/{referenceType}")
    public ResponseEntity<List<Object[]>> getMostReviewedEntitiesByType(@PathVariable String referenceType, Pageable pageable) {
        List<Object[]> mostReviewed = ratingService.findMostReviewedEntitiesByType(referenceType, pageable);
        return ResponseEntity.ok(mostReviewed);
    }

    // Recent ratings for specific entity type
    /**
     * Get recent ratings by type
     */
    @GetMapping("/recent/type/{referenceType}")
    public ResponseEntity<List<Rating>> getRecentRatingsByType(@PathVariable String referenceType, Pageable pageable) {
        List<Rating> ratings = ratingService.findRecentRatingsByType(referenceType, pageable);
        return ResponseEntity.ok(ratings);
    }

    // Ratings with reviews
    /**
     * Get ratings with reviews
     */
    @GetMapping("/with-reviews")
    public ResponseEntity<List<Rating>> getRatingsWithReviews() {
        List<Rating> ratings = ratingService.findRatingsWithReviews();
        return ResponseEntity.ok(ratings);
    }

    /**
     * Get ratings with reviews with pagination
     */
    @GetMapping("/with-reviews/page")
    public ResponseEntity<Page<Rating>> getRatingsWithReviewsPage(Pageable pageable) {
        Page<Rating> ratings = ratingService.findRatingsWithReviews(pageable);
        return ResponseEntity.ok(ratings);
    }

    // Ratings with reviews for specific entity
    /**
     * Get ratings with reviews by reference
     */
    @GetMapping("/with-reviews/reference/{referenceId}/{referenceType}")
    public ResponseEntity<List<Rating>> getRatingsWithReviewsByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        List<Rating> ratings = ratingService.findRatingsWithReviewsByReference(referenceId, referenceType);
        return ResponseEntity.ok(ratings);
    }

    /**
     * Get ratings with reviews by reference with pagination
     */
    @GetMapping("/with-reviews/reference/{referenceId}/{referenceType}/page")
    public ResponseEntity<Page<Rating>> getRatingsWithReviewsByReferencePage(@PathVariable Integer referenceId, @PathVariable String referenceType, Pageable pageable) {
        Page<Rating> ratings = ratingService.findRatingsWithReviewsByReference(referenceId, referenceType, pageable);
        return ResponseEntity.ok(ratings);
    }

    // Most active raters
    /**
     * Get most active raters
     */
    @GetMapping("/most-active-raters")
    public ResponseEntity<List<Object[]>> getMostActiveRaters(Pageable pageable) {
        List<Object[]> activeRaters = ratingService.findMostActiveRaters(pageable);
        return ResponseEntity.ok(activeRaters);
    }

    // User rating statistics
    /**
     * Get user rating statistics
     */
    @GetMapping("/statistics/user/{userId}")
    public ResponseEntity<List<Object[]>> getUserRatingStatistics(@PathVariable Integer userId) {
        List<Object[]> statistics = ratingService.findUserRatingStatistics(userId);
        return ResponseEntity.ok(statistics);
    }
}
