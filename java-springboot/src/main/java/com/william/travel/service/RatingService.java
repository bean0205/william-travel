package com.william.travel.service;

import com.william.travel.entity.Rating;
import com.william.travel.entity.User;
import com.william.travel.repository.RatingRepository;
import com.william.travel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    // Reference type constants for polymorphic relationships
    public static final String REFERENCE_TYPE_LOCATION = "location";
    public static final String REFERENCE_TYPE_ACCOMMODATION = "accommodation";
    public static final String REFERENCE_TYPE_FOOD = "food";
    public static final String REFERENCE_TYPE_EVENT = "event";
    public static final String REFERENCE_TYPE_ARTICLE = "article";

    // CRUD Operations
    
    @Transactional
    public Rating createRating(Rating rating, Long userId) {
        log.debug("Creating rating for {} {} by user {}", rating.getReferenceType(), rating.getReferenceId(), userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Check if user already rated this item
        Optional<Rating> existingRating = ratingRepository.findByUserAndReference(
                userId, rating.getReferenceId(), rating.getReferenceType());
        
        if (existingRating.isPresent()) {
            throw new RuntimeException("User has already rated this item");
        }
        
        // Validate rating value
        if (rating.getRating() < 1.0 || rating.getRating() > 5.0) {
            throw new RuntimeException("Rating must be between 1.0 and 5.0");
        }
        
        rating.setUser(user);
        return ratingRepository.save(rating);
    }

    @Transactional
    public Rating updateRating(Long id, Rating updatedRating) {
        log.debug("Updating rating with id: {}", id);
        
        Rating existingRating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found with id: " + id));

        // Validate rating value
        if (updatedRating.getRating() < 1.0 || updatedRating.getRating() > 5.0) {
            throw new RuntimeException("Rating must be between 1.0 and 5.0");
        }

        // Update fields
        existingRating.setRating(updatedRating.getRating());
        existingRating.setComment(updatedRating.getComment());

        return ratingRepository.save(existingRating);
    }

    @Transactional
    public Rating updateUserRating(Long userId, Long referenceId, String referenceType, Double newRating, String comment) {
        log.debug("Updating rating for {} {} by user {}", referenceType, referenceId, userId);
        
        Rating existingRating = ratingRepository.findByUserAndReference(userId, referenceId, referenceType)
                .orElseThrow(() -> new RuntimeException("Rating not found for user and reference"));
        
        // Validate rating value
        if (newRating < 1.0 || newRating > 5.0) {
            throw new RuntimeException("Rating must be between 1.0 and 5.0");
        }
        
        existingRating.setRating(newRating);
        existingRating.setComment(comment);
        
        return ratingRepository.save(existingRating);
    }

    @Transactional
    public void deleteRating(Long id) {
        log.debug("Deleting rating with id: {}", id);
        ratingRepository.deleteById(id);
    }

    @Transactional
    public void deleteUserRating(Long userId, Long referenceId, String referenceType) {
        log.debug("Deleting rating for {} {} by user {}", referenceType, referenceId, userId);
        
        Rating rating = ratingRepository.findByUserAndReference(userId, referenceId, referenceType)
                .orElseThrow(() -> new RuntimeException("Rating not found for user and reference"));
        
        ratingRepository.delete(rating);
    }

    // Read Operations

    public Optional<Rating> getRatingById(Long id) {
        log.debug("Finding rating by id: {}", id);
        return ratingRepository.findById(id);
    }

    public List<Rating> getRatingsByReference(Long referenceId, String referenceType) {
        log.debug("Finding ratings for {} {}", referenceType, referenceId);
        return ratingRepository.findByReference(referenceId, referenceType);
    }

    public Page<Rating> getRatingsByReference(Long referenceId, String referenceType, Pageable pageable) {
        log.debug("Finding ratings for {} {} with pagination", referenceType, referenceId);
        return ratingRepository.findByReference(referenceId, referenceType, pageable);
    }

    public Page<Rating> getRatingsByUser(Long userId, Pageable pageable) {
        log.debug("Finding ratings by user: {}", userId);
        return ratingRepository.findByUserId(userId, pageable);
    }

    public Optional<Rating> getUserRatingForReference(Long userId, Long referenceId, String referenceType) {
        log.debug("Finding rating for {} {} by user {}", referenceType, referenceId, userId);
        return ratingRepository.findByUserAndReference(userId, referenceId, referenceType);
    }

    // Reference-specific methods

    public List<Rating> getRatingsForLocation(Long locationId) {
        return getRatingsByReference(locationId, REFERENCE_TYPE_LOCATION);
    }

    public List<Rating> getRatingsForAccommodation(Long accommodationId) {
        return getRatingsByReference(accommodationId, REFERENCE_TYPE_ACCOMMODATION);
    }

    public List<Rating> getRatingsForFood(Long foodId) {
        return getRatingsByReference(foodId, REFERENCE_TYPE_FOOD);
    }

    public List<Rating> getRatingsForEvent(Long eventId) {
        return getRatingsByReference(eventId, REFERENCE_TYPE_EVENT);
    }

    public List<Rating> getRatingsForArticle(Long articleId) {
        return getRatingsByReference(articleId, REFERENCE_TYPE_ARTICLE);
    }

    // Rating statistics

    public Double getAverageRating(Long referenceId, String referenceType) {
        log.debug("Calculating average rating for {} {}", referenceType, referenceId);
        Double average = ratingRepository.findAverageRatingByReference(referenceId, referenceType);
        return average != null ? Math.round(average * 10.0) / 10.0 : 0.0; // Round to 1 decimal place
    }

    public Double getAverageRatingForLocation(Long locationId) {
        return getAverageRating(locationId, REFERENCE_TYPE_LOCATION);
    }

    public Double getAverageRatingForAccommodation(Long accommodationId) {
        return getAverageRating(accommodationId, REFERENCE_TYPE_ACCOMMODATION);
    }

    public Double getAverageRatingForFood(Long foodId) {
        return getAverageRating(foodId, REFERENCE_TYPE_FOOD);
    }

    public Double getAverageRatingForEvent(Long eventId) {
        return getAverageRating(eventId, REFERENCE_TYPE_EVENT);
    }

    public Double getAverageRatingForArticle(Long articleId) {
        return getAverageRating(articleId, REFERENCE_TYPE_ARTICLE);
    }

    public Long getRatingCount(Long referenceId, String referenceType) {
        log.debug("Counting ratings for {} {}", referenceType, referenceId);
        return ratingRepository.countByReference(referenceId, referenceType);
    }

    public Long getRatingCountForLocation(Long locationId) {
        return getRatingCount(locationId, REFERENCE_TYPE_LOCATION);
    }

    public Long getRatingCountForAccommodation(Long accommodationId) {
        return getRatingCount(accommodationId, REFERENCE_TYPE_ACCOMMODATION);
    }

    public Long getRatingCountForFood(Long foodId) {
        return getRatingCount(foodId, REFERENCE_TYPE_FOOD);
    }

    public Long getRatingCountForEvent(Long eventId) {
        return getRatingCount(eventId, REFERENCE_TYPE_EVENT);
    }

    public Long getRatingCountForArticle(Long articleId) {
        return getRatingCount(articleId, REFERENCE_TYPE_ARTICLE);
    }

    // Filtered ratings

    public List<Rating> getHighRatings(Long referenceId, String referenceType, Integer minRating) {
        log.debug("Finding ratings >= {} for {} {}", minRating, referenceType, referenceId);
        return ratingRepository.findByReferenceAndMinRating(referenceId, referenceType, minRating);
    }

    // Rating validation

    public boolean hasUserRated(Long userId, Long referenceId, String referenceType) {
        return ratingRepository.findByUserAndReference(userId, referenceId, referenceType).isPresent();
    }

    public boolean canUserRate(Long userId, Long referenceId, String referenceType) {
        // User can rate if they haven't rated before
        return !hasUserRated(userId, referenceId, referenceType);
    }

    // Bulk operations

    @Transactional
    public void deleteAllRatingsForReference(Long referenceId, String referenceType) {
        log.debug("Deleting all ratings for {} {}", referenceType, referenceId);
        
        List<Rating> ratings = ratingRepository.findByReference(referenceId, referenceType);
        ratingRepository.deleteAll(ratings);
    }

    @Transactional
    public void deleteAllRatingsByUser(Long userId) {
        log.debug("Deleting all ratings by user: {}", userId);
        
        Page<Rating> userRatings = ratingRepository.findByUserId(userId, Pageable.unpaged());
        ratingRepository.deleteAll(userRatings.getContent());
    }

    // Rating summary for entity

    public RatingSummary getRatingSummary(Long referenceId, String referenceType) {
        log.debug("Getting rating summary for {} {}", referenceType, referenceId);
        
        Double averageRating = getAverageRating(referenceId, referenceType);
        Long totalRatings = getRatingCount(referenceId, referenceType);
        
        return new RatingSummary(averageRating, totalRatings);
    }

    // Inner class for rating summary
    public static class RatingSummary {
        private final Double averageRating;
        private final Long totalRatings;

        public RatingSummary(Double averageRating, Long totalRatings) {
            this.averageRating = averageRating;
            this.totalRatings = totalRatings;
        }

        public Double getAverageRating() {
            return averageRating;
        }

        public Long getTotalRatings() {
            return totalRatings;
        }

        public String getFormattedAverage() {
            return averageRating != null ? String.format("%.1f", averageRating) : "0.0";
        }

        public int getStarRating() {
            return averageRating != null ? (int) Math.round(averageRating) : 0;
        }
    }
}
