package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Article;
import com.williamtravel.app.service.ArticleService;
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
 * REST Controller for Article operations
 */
@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    /**
     * Get all articles
     */
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        List<Article> articles = articleService.findAll();
        return ResponseEntity.ok(articles);
    }

    /**
     * Get all articles with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Article>> getAllArticles(Pageable pageable) {
        Page<Article> articles = articleService.findAll(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get article by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Integer id) {
        Optional<Article> article = articleService.findById(id);
        return article.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get article by slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Article> getArticleBySlug(@PathVariable String slug) {
        Optional<Article> article = articleService.findBySlug(slug);
        return article.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new article
     */
    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        Article savedArticle = articleService.save(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedArticle);
    }

    /**
     * Update article
     */
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Integer id, @RequestBody Article article) {
        if (!articleService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        article.setId(id);
        Article updatedArticle = articleService.save(article);
        return ResponseEntity.ok(updatedArticle);
    }

    /**
     * Delete article
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Integer id) {
        if (!articleService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Check if article exists by slug
     */
    @GetMapping("/exists/slug/{slug}")
    public ResponseEntity<Boolean> checkSlugExists(@PathVariable String slug) {
        boolean exists = articleService.existsBySlug(slug);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if article exists by title
     */
    @GetMapping("/exists/title/{title}")
    public ResponseEntity<Boolean> checkTitleExists(@PathVariable String title) {
        boolean exists = articleService.existsByTitle(title);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get articles by author
     */
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Article>> getArticlesByAuthor(@PathVariable Integer authorId) {
        List<Article> articles = articleService.findByAuthorId(authorId);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by author with pagination
     */
    @GetMapping("/author/{authorId}/page")
    public ResponseEntity<Page<Article>> getArticlesByAuthor(@PathVariable Integer authorId, Pageable pageable) {
        Page<Article> articles = articleService.findByAuthorId(authorId, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by author and status
     */
    @GetMapping("/author/{authorId}/status/{status}")
    public ResponseEntity<Page<Article>> getArticlesByAuthorAndStatus(
            @PathVariable Integer authorId, 
            @PathVariable String status, 
            Pageable pageable) {
        Page<Article> articles = articleService.findByAuthorIdAndStatus(authorId, status, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Article>> getArticlesByStatus(@PathVariable String status) {
        List<Article> articles = articleService.findByStatus(status);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by status with pagination
     */
    @GetMapping("/status/{status}/page")
    public ResponseEntity<Page<Article>> getArticlesByStatus(@PathVariable String status, Pageable pageable) {
        Page<Article> articles = articleService.findByStatus(status, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get published articles
     */
    @GetMapping("/published")
    public ResponseEntity<List<Article>> getPublishedArticles() {
        List<Article> articles = articleService.findPublishedArticles();
        return ResponseEntity.ok(articles);
    }

    /**
     * Get published articles with pagination
     */
    @GetMapping("/published/page")
    public ResponseEntity<Page<Article>> getPublishedArticles(Pageable pageable) {
        Page<Article> articles = articleService.findPublishedArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get featured articles
     */
    @GetMapping("/featured")
    public ResponseEntity<List<Article>> getFeaturedArticles() {
        List<Article> articles = articleService.findFeaturedArticles();
        return ResponseEntity.ok(articles);
    }

    /**
     * Count total articles
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countArticles() {
        long count = articleService.count();
        return ResponseEntity.ok(count);
    }

    /**
     * Get featured articles with pagination
     */
    @GetMapping("/featured/page")
    public ResponseEntity<Page<Article>> getFeaturedArticles(Pageable pageable) {
        Page<Article> articles = articleService.findFeaturedArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Search articles by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<Article>> searchArticles(@RequestParam String keyword) {
        List<Article> articles = articleService.searchByKeyword(keyword);
        return ResponseEntity.ok(articles);
    }

    /**
     * Search articles by keyword with pagination
     */
    @GetMapping("/search/page")
    public ResponseEntity<Page<Article>> searchArticles(@RequestParam String keyword, Pageable pageable) {
        Page<Article> articles = articleService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Article>> getArticlesByCategory(@PathVariable Integer categoryId) {
        List<Article> articles = articleService.findByCategoryId(categoryId);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by category with pagination
     */
    @GetMapping("/category/{categoryId}/page")
    public ResponseEntity<Page<Article>> getArticlesByCategory(@PathVariable Integer categoryId, Pageable pageable) {
        Page<Article> articles = articleService.findByCategoryId(categoryId, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by tag
     */
    @GetMapping("/tag/{tagId}")
    public ResponseEntity<List<Article>> getArticlesByTag(@PathVariable Integer tagId) {
        List<Article> articles = articleService.findByTagId(tagId);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by tag with pagination
     */
    @GetMapping("/tag/{tagId}/page")
    public ResponseEntity<Page<Article>> getArticlesByTag(@PathVariable Integer tagId, Pageable pageable) {
        Page<Article> articles = articleService.findByTagId(tagId, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get popular articles
     */
    @GetMapping("/popular")
    public ResponseEntity<List<Article>> getPopularArticles(Pageable pageable) {
        List<Article> articles = articleService.findPopularArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get popular articles since date
     */
    @GetMapping("/popular/since")
    public ResponseEntity<List<Article>> getPopularArticlesSince(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since, 
            Pageable pageable) {
        List<Article> articles = articleService.findPopularArticlesSince(since, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get recent articles
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Article>> getRecentArticles(Pageable pageable) {
        List<Article> articles = articleService.findRecentArticles(pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Article>> getArticlesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Article> articles = articleService.findByDateRange(startDate, endDate);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get articles by date range with pagination
     */
    @GetMapping("/date-range/page")
    public ResponseEntity<Page<Article>> getArticlesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        Page<Article> articles = articleService.findByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Get related articles
     */
    @GetMapping("/{articleId}/related")
    public ResponseEntity<List<Article>> getRelatedArticles(@PathVariable Integer articleId, Pageable pageable) {
        List<Article> articles = articleService.findRelatedArticles(articleId, pageable);
        return ResponseEntity.ok(articles);
    }

    /**
     * Increment view count
     */
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Integer id) {
        articleService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Count published articles
     */
    @GetMapping("/count/published")
    public ResponseEntity<Long> countPublishedArticles() {
        Long count = articleService.countPublishedArticles();
        return ResponseEntity.ok(count);
    }

    /**
     * Count published articles by author
     */
    @GetMapping("/count/published/author/{authorId}")
    public ResponseEntity<Long> countPublishedArticlesByAuthor(@PathVariable Integer authorId) {
        Long count = articleService.countPublishedArticlesByAuthor(authorId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count articles by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countArticlesByStatus(@PathVariable String status) {
        Long count = articleService.countByStatus(status);
        return ResponseEntity.ok(count);
    }

    /**
     * Find articles with multiple filters
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<Article>> findWithFilters(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer authorId,
            @RequestParam(required = false) Integer categoryId,
            Pageable pageable) {
        Page<Article> articles = articleService.findWithFilters(keyword, authorId, categoryId, pageable);
        return ResponseEntity.ok(articles);
    }
}
