package com.williamtravel.app.controller;

import com.williamtravel.app.entity.ArticleReaction;
import com.williamtravel.app.service.ArticleReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for ArticleReaction operations
 */
@RestController
@RequestMapping("/api/article-reactions")
@CrossOrigin(origins = "*")
public class ArticleReactionController {

    @Autowired
    private ArticleReactionService articleReactionService;

    /**
     * Get all article reactions
     */
    @GetMapping
    public ResponseEntity<List<ArticleReaction>> getAllArticleReactions() {
        List<ArticleReaction> reactions = articleReactionService.findAll();
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get article reaction by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArticleReaction> getArticleReactionById(@PathVariable Integer id) {
        Optional<ArticleReaction> reaction = articleReactionService.findById(id);
        return reaction.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new article reaction
     */
    @PostMapping
    public ResponseEntity<ArticleReaction> createArticleReaction(@RequestBody ArticleReaction reaction) {
        ArticleReaction savedReaction = articleReactionService.save(reaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReaction);
    }

    /**
     * Update article reaction
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArticleReaction> updateArticleReaction(@PathVariable Integer id, @RequestBody ArticleReaction reaction) {
        if (!articleReactionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reaction.setId(id);
        ArticleReaction updatedReaction = articleReactionService.save(reaction);
        return ResponseEntity.ok(updatedReaction);
    }

    /**
     * Delete article reaction
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticleReaction(@PathVariable Integer id) {
        if (!articleReactionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleReactionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total article reactions
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countArticleReactions() {
        long count = articleReactionService.count();
        return ResponseEntity.ok(count);
    }

    // ================ ARTICLE-BASED QUERIES ================

    /**
     * Get reactions by article ID
     */
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<ArticleReaction>> getReactionsByArticleId(@PathVariable Integer articleId) {
        List<ArticleReaction> reactions = articleReactionService.findByArticleId(articleId);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get reactions by article ID with pagination
     */
    @GetMapping("/article/{articleId}/paginated")
    public ResponseEntity<Page<ArticleReaction>> getReactionsByArticleIdPaginated(
            @PathVariable Integer articleId, Pageable pageable) {
        Page<ArticleReaction> reactions = articleReactionService.findByArticleId(articleId, pageable);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get reactions by article ID and status
     */
    @GetMapping("/article/{articleId}/status/{status}")
    public ResponseEntity<List<ArticleReaction>> getReactionsByArticleIdAndStatus(
            @PathVariable Integer articleId, @PathVariable Boolean status) {
        List<ArticleReaction> reactions = articleReactionService.findByArticleIdAndStatus(articleId, status);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Count active reactions by article
     */
    @GetMapping("/article/{articleId}/count/active")
    public ResponseEntity<Long> countActiveReactionsByArticle(@PathVariable Integer articleId) {
        Long count = articleReactionService.countActiveReactionsByArticle(articleId);
        return ResponseEntity.ok(count);
    }

    // ================ USER-BASED QUERIES ================

    /**
     * Get reactions by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ArticleReaction>> getReactionsByUserId(@PathVariable Integer userId) {
        List<ArticleReaction> reactions = articleReactionService.findByUserId(userId);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get reactions by user ID with pagination
     */
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<Page<ArticleReaction>> getReactionsByUserIdPaginated(
            @PathVariable Integer userId, Pageable pageable) {
        Page<ArticleReaction> reactions = articleReactionService.findByUserId(userId, pageable);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get reactions by user ID and status with pagination
     */
    @GetMapping("/user/{userId}/status/{status}/paginated")
    public ResponseEntity<Page<ArticleReaction>> getReactionsByUserIdAndStatusPaginated(
            @PathVariable Integer userId, @PathVariable Boolean status, Pageable pageable) {
        Page<ArticleReaction> reactions = articleReactionService.findByUserIdAndStatus(userId, status, pageable);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get specific user reaction to article
     */
    @GetMapping("/user/{userId}/article/{articleId}")
    public ResponseEntity<ArticleReaction> getUserReactionToArticle(
            @PathVariable Integer userId, @PathVariable Integer articleId) {
        Optional<ArticleReaction> reaction = articleReactionService.findByUserIdAndArticleId(userId, articleId);
        return reaction.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if user has reacted to article
     */
    @GetMapping("/user/{userId}/article/{articleId}/exists")
    public ResponseEntity<Boolean> checkUserReactionExists(
            @PathVariable Integer userId, @PathVariable Integer articleId) {
        boolean exists = articleReactionService.existsByUserIdAndArticleId(userId, articleId);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if user has active reaction to article
     */
    @GetMapping("/user/{userId}/article/{articleId}/active/exists")
    public ResponseEntity<Boolean> checkActiveUserReactionExists(
            @PathVariable Integer userId, @PathVariable Integer articleId) {
        boolean exists = articleReactionService.existsActiveReactionByUserAndArticle(userId, articleId);
        return ResponseEntity.ok(exists);
    }

    /**
     * Count active reactions by user
     */
    @GetMapping("/user/{userId}/count/active")
    public ResponseEntity<Long> countActiveReactionsByUser(@PathVariable Integer userId) {
        Long count = articleReactionService.countActiveReactionsByUser(userId);
        return ResponseEntity.ok(count);
    }

    /**
     * Get liked articles by user
     */
    @GetMapping("/user/{userId}/liked-articles")
    public ResponseEntity<List<Object>> getLikedArticlesByUser(@PathVariable Integer userId) {
        List<Object> articles = articleReactionService.findLikedArticlesByUser(userId);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get liked articles by user with pagination
     */
    @GetMapping("/user/{userId}/liked-articles/paginated")
    public ResponseEntity<Page<Object>> getLikedArticlesByUserPaginated(
            @PathVariable Integer userId, Pageable pageable) {
        Page<Object> articles = articleReactionService.findLikedArticlesByUser(userId, pageable);
        return ResponseEntity.ok(articles);
    }

    // ================ STATUS-BASED QUERIES ================

    /**
     * Get reactions by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ArticleReaction>> getReactionsByStatus(@PathVariable Boolean status) {
        List<ArticleReaction> reactions = articleReactionService.findByStatus(status);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get reactions by status with pagination
     */
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<Page<ArticleReaction>> getReactionsByStatusPaginated(
            @PathVariable Boolean status, Pageable pageable) {
        Page<ArticleReaction> reactions = articleReactionService.findByStatus(status, pageable);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Count all active reactions
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countAllActiveReactions() {
        Long count = articleReactionService.countAllActiveReactions();
        return ResponseEntity.ok(count);
    }

    // ================ DATE-BASED QUERIES ================

    /**
     * Get recent reactions
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ArticleReaction>> getRecentReactions(Pageable pageable) {
        List<ArticleReaction> reactions = articleReactionService.findRecentReactions(pageable);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get reactions by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<ArticleReaction>> getReactionsByDateRange(
            @RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate) {
        List<ArticleReaction> reactions = articleReactionService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(reactions);
    }

    /**
     * Get recent reactions on published articles
     */
    @GetMapping("/recent/published-articles")
    public ResponseEntity<List<ArticleReaction>> getRecentReactionsOnPublishedArticles(Pageable pageable) {
        List<ArticleReaction> reactions = articleReactionService.findRecentReactionsOnPublishedArticles(pageable);
        return ResponseEntity.ok(reactions);
    }

    // ================ STATISTICAL AND ANALYTICS QUERIES ================

    /**
     * Get most liked articles
     */
    @GetMapping("/analytics/most-liked-articles")
    public ResponseEntity<List<Object[]>> getMostLikedArticles(Pageable pageable) {
        List<Object[]> articles = articleReactionService.findMostLikedArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get most active reactors
     */
    @GetMapping("/analytics/most-active-reactors")
    public ResponseEntity<List<Object[]>> getMostActiveReactors(Pageable pageable) {
        List<Object[]> reactors = articleReactionService.findMostActiveReactors(pageable);
        return ResponseEntity.ok(reactors);
    }

    /**
     * Get trending articles by recent likes
     */
    @GetMapping("/analytics/trending")
    public ResponseEntity<List<Object[]>> getTrendingArticles(
            @RequestParam LocalDateTime since, Pageable pageable) {
        List<Object[]> articles = articleReactionService.findTrendingArticles(since, pageable);
        return ResponseEntity.ok(articles);
    }

    // ================ UPDATE OPERATIONS ================

    /**
     * Update reaction status (toggle like/unlike)
     */
    @PutMapping("/user/{userId}/article/{articleId}/status")
    public ResponseEntity<Integer> updateReactionStatus(
            @PathVariable Integer userId, 
            @PathVariable Integer articleId, 
            @RequestParam Boolean status,
            @RequestParam(required = false) LocalDateTime updatedAt) {
        LocalDateTime updateTime = updatedAt != null ? updatedAt : LocalDateTime.now();
        int updated = articleReactionService.updateReactionStatus(userId, articleId, status, updateTime);
        return ResponseEntity.ok(updated);
    }
}
