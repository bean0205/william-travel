package com.williamtravel.app.controller;

import com.williamtravel.app.entity.ArticleComment;
import com.williamtravel.app.service.ArticleCommentService;
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
 * REST Controller for ArticleComment operations
 */
@RestController
@RequestMapping("/api/article-comments")
@CrossOrigin(origins = "*")
public class ArticleCommentController {

    @Autowired
    private ArticleCommentService articleCommentService;

    /**
     * Get all article comments
     */
    @GetMapping
    public ResponseEntity<List<ArticleComment>> getAllArticleComments() {
        List<ArticleComment> comments = articleCommentService.findAll();
        return ResponseEntity.ok(comments);
    }

    /**
     * Get article comment by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArticleComment> getArticleCommentById(@PathVariable Integer id) {
        Optional<ArticleComment> comment = articleCommentService.findById(id);
        return comment.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new article comment
     */
    @PostMapping
    public ResponseEntity<ArticleComment> createArticleComment(@RequestBody ArticleComment comment) {
        ArticleComment savedComment = articleCommentService.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    /**
     * Update article comment
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArticleComment> updateArticleComment(@PathVariable Integer id, @RequestBody ArticleComment comment) {
        if (!articleCommentService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        comment.setId(id);
        ArticleComment updatedComment = articleCommentService.save(comment);
        return ResponseEntity.ok(updatedComment);
    }

    /**
     * Delete article comment
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticleComment(@PathVariable Integer id) {
        if (!articleCommentService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleCommentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total article comments
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countArticleComments() {
        long count = articleCommentService.count();
        return ResponseEntity.ok(count);
    }

    // ================ ARTICLE-BASED QUERIES ================

    /**
     * Get comments by article ID
     */
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<ArticleComment>> getCommentsByArticleId(@PathVariable Integer articleId) {
        List<ArticleComment> comments = articleCommentService.findByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by article ID with pagination
     */
    @GetMapping("/article/{articleId}/paginated")
    public ResponseEntity<Page<ArticleComment>> getCommentsByArticleIdPaginated(
            @PathVariable Integer articleId, Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.findByArticleId(articleId, pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by article ID and status
     */
    @GetMapping("/article/{articleId}/status/{status}")
    public ResponseEntity<List<ArticleComment>> getCommentsByArticleIdAndStatus(
            @PathVariable Integer articleId, @PathVariable Boolean status) {
        List<ArticleComment> comments = articleCommentService.findByArticleIdAndStatus(articleId, status);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by article ID and status with pagination
     */
    @GetMapping("/article/{articleId}/status/{status}/paginated")
    public ResponseEntity<Page<ArticleComment>> getCommentsByArticleIdAndStatusPaginated(
            @PathVariable Integer articleId, @PathVariable Boolean status, Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.findByArticleIdAndStatus(articleId, status, pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Count active comments by article
     */
    @GetMapping("/article/{articleId}/count/active")
    public ResponseEntity<Long> countActiveCommentsByArticle(@PathVariable Integer articleId) {
        Long count = articleCommentService.countActiveCommentsByArticle(articleId);
        return ResponseEntity.ok(count);
    }

    // ================ USER-BASED QUERIES ================

    /**
     * Get comments by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ArticleComment>> getCommentsByUserId(@PathVariable Integer userId) {
        List<ArticleComment> comments = articleCommentService.findByUserId(userId);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by user ID with pagination
     */
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<Page<ArticleComment>> getCommentsByUserIdPaginated(
            @PathVariable Integer userId, Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.findByUserId(userId, pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by user ID and status with pagination
     */
    @GetMapping("/user/{userId}/status/{status}/paginated")
    public ResponseEntity<Page<ArticleComment>> getCommentsByUserIdAndStatusPaginated(
            @PathVariable Integer userId, @PathVariable Boolean status, Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.findByUserIdAndStatus(userId, status, pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Count active comments by user
     */
    @GetMapping("/user/{userId}/count/active")
    public ResponseEntity<Long> countActiveCommentsByUser(@PathVariable Integer userId) {
        Long count = articleCommentService.countActiveCommentsByUser(userId);
        return ResponseEntity.ok(count);
    }

    // ================ STATUS-BASED QUERIES ================

    /**
     * Get comments by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ArticleComment>> getCommentsByStatus(@PathVariable Boolean status) {
        List<ArticleComment> comments = articleCommentService.findByStatus(status);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by status with pagination
     */
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<Page<ArticleComment>> getCommentsByStatusPaginated(
            @PathVariable Boolean status, Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.findByStatus(status, pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Count all active comments
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countAllActiveComments() {
        Long count = articleCommentService.countAllActiveComments();
        return ResponseEntity.ok(count);
    }

    /**
     * Get pending comments
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ArticleComment>> getPendingComments() {
        List<ArticleComment> comments = articleCommentService.findPendingComments();
        return ResponseEntity.ok(comments);
    }

    /**
     * Get pending comments with pagination
     */
    @GetMapping("/pending/paginated")
    public ResponseEntity<Page<ArticleComment>> getPendingCommentsPaginated(Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.findPendingComments(pageable);
        return ResponseEntity.ok(comments);
    }

    // ================ DATE-BASED QUERIES ================

    /**
     * Get recent comments
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ArticleComment>> getRecentComments(Pageable pageable) {
        List<ArticleComment> comments = articleCommentService.findRecentComments(pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<ArticleComment>> getCommentsByDateRange(
            @RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate) {
        List<ArticleComment> comments = articleCommentService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get comments by date range with pagination
     */
    @GetMapping("/date-range/paginated")
    public ResponseEntity<Page<ArticleComment>> getCommentsByDateRangePaginated(
            @RequestParam LocalDateTime startDate, @RequestParam LocalDateTime endDate, Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.findByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(comments);
    }

    /**
     * Get recent comments on published articles
     */
    @GetMapping("/recent/published-articles")
    public ResponseEntity<List<ArticleComment>> getRecentCommentsOnPublishedArticles(Pageable pageable) {
        List<ArticleComment> comments = articleCommentService.findRecentCommentsOnPublishedArticles(pageable);
        return ResponseEntity.ok(comments);
    }

    // ================ SEARCH FUNCTIONALITY ================

    /**
     * Search comments by content
     */
    @GetMapping("/search")
    public ResponseEntity<List<ArticleComment>> searchCommentsByContent(@RequestParam String keyword) {
        List<ArticleComment> comments = articleCommentService.searchByContent(keyword);
        return ResponseEntity.ok(comments);
    }

    /**
     * Search comments by content with pagination
     */
    @GetMapping("/search/paginated")
    public ResponseEntity<Page<ArticleComment>> searchCommentsByContentPaginated(
            @RequestParam String keyword, Pageable pageable) {
        Page<ArticleComment> comments = articleCommentService.searchByContent(keyword, pageable);
        return ResponseEntity.ok(comments);
    }

    // ================ ANALYTICS AND STATISTICS ================

    /**
     * Get most commented articles
     */
    @GetMapping("/analytics/most-commented-articles")
    public ResponseEntity<List<Object[]>> getMostCommentedArticles(Pageable pageable) {
        List<Object[]> articles = articleCommentService.findMostCommentedArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get most active commenters
     */
    @GetMapping("/analytics/most-active-commenters")
    public ResponseEntity<List<Object[]>> getMostActiveCommenters(Pageable pageable) {
        List<Object[]> commenters = articleCommentService.findMostActiveCommenters(pageable);
        return ResponseEntity.ok(commenters);
    }
}
