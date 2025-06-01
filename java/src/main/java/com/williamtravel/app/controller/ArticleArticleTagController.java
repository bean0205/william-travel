package com.williamtravel.app.controller;

import com.williamtravel.app.entity.ArticleArticleTag;
import com.williamtravel.app.service.ArticleArticleTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for ArticleArticleTag operations
 */
@RestController
@RequestMapping("/api/article-article-tags")
@CrossOrigin(origins = "*")
public class ArticleArticleTagController {

    @Autowired
    private ArticleArticleTagService articleArticleTagService;

    /**
     * Get all article-article tag relationships
     */
    @GetMapping
    public ResponseEntity<List<ArticleArticleTag>> getAllArticleArticleTags() {
        List<ArticleArticleTag> relationships = articleArticleTagService.findAll();
        return ResponseEntity.ok(relationships);
    }

    /**
     * Get article-article tag by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArticleArticleTag> getArticleArticleTagById(@PathVariable Integer id) {
        Optional<ArticleArticleTag> relationship = articleArticleTagService.findById(id);
        return relationship.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new article-article tag relationship
     */
    @PostMapping
    public ResponseEntity<ArticleArticleTag> createArticleArticleTag(@RequestBody ArticleArticleTag relationship) {
        ArticleArticleTag savedRelationship = articleArticleTagService.save(relationship);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRelationship);
    }

    /**
     * Update article-article tag relationship
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArticleArticleTag> updateArticleArticleTag(@PathVariable Integer id, @RequestBody ArticleArticleTag relationship) {
        if (!articleArticleTagService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        relationship.setId(id);
        ArticleArticleTag updatedRelationship = articleArticleTagService.save(relationship);
        return ResponseEntity.ok(updatedRelationship);
    }

    /**
     * Delete article-article tag relationship
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticleArticleTag(@PathVariable Integer id) {
        if (!articleArticleTagService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleArticleTagService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total article-article tag relationships
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countArticleArticleTags() {
        long count = articleArticleTagService.count();
        return ResponseEntity.ok(count);
    }

    // ========== RELATIONSHIP QUERY ENDPOINTS ==========

    /**
     * Get all tag relationships for a specific article
     */
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<ArticleArticleTag>> getTagsByArticleId(@PathVariable Integer articleId) {
        List<ArticleArticleTag> relationships = articleArticleTagService.findByArticleId(articleId);
        return ResponseEntity.ok(relationships);
    }

    /**
     * Get all article relationships for a specific tag
     */
    @GetMapping("/tag/{tagId}")
    public ResponseEntity<List<ArticleArticleTag>> getArticlesByTagId(@PathVariable Integer tagId) {
        List<ArticleArticleTag> relationships = articleArticleTagService.findByTagId(tagId);
        return ResponseEntity.ok(relationships);
    }

    /**
     * Get specific relationship by article ID and tag ID
     */
    @GetMapping("/article/{articleId}/tag/{tagId}")
    public ResponseEntity<ArticleArticleTag> getByArticleIdAndTagId(@PathVariable Integer articleId, @PathVariable Integer tagId) {
        ArticleArticleTag relationship = articleArticleTagService.findByArticleIdAndTagId(articleId, tagId);
        if (relationship != null) {
            return ResponseEntity.ok(relationship);
        }
        return ResponseEntity.notFound().build();
    }

    // ========== EXISTENCE CHECK ENDPOINTS ==========

    /**
     * Check if relationship exists between article and tag
     */
    @GetMapping("/exists/article/{articleId}/tag/{tagId}")
    public ResponseEntity<Boolean> existsByArticleIdAndTagId(@PathVariable Integer articleId, @PathVariable Integer tagId) {
        boolean exists = articleArticleTagService.existsByArticleIdAndTagId(articleId, tagId);
        return ResponseEntity.ok(exists);
    }

    // ========== BULK DELETE ENDPOINTS ==========

    /**
     * Delete all tag relationships for a specific article
     */
    @DeleteMapping("/article/{articleId}")
    public ResponseEntity<Void> deleteByArticleId(@PathVariable Integer articleId) {
        articleArticleTagService.deleteByArticleId(articleId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete all article relationships for a specific tag
     */
    @DeleteMapping("/tag/{tagId}")
    public ResponseEntity<Void> deleteByTagId(@PathVariable Integer tagId) {
        articleArticleTagService.deleteByTagId(tagId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete specific relationship by article ID and tag ID
     */
    @DeleteMapping("/article/{articleId}/tag/{tagId}")
    public ResponseEntity<Void> deleteByArticleIdAndTagId(@PathVariable Integer articleId, @PathVariable Integer tagId) {
        articleArticleTagService.deleteByArticleIdAndTagId(articleId, tagId);
        return ResponseEntity.noContent().build();
    }

    // ========== COUNTING AND STATISTICS ENDPOINTS ==========

    /**
     * Count articles that have a specific tag
     */
    @GetMapping("/tag/{tagId}/count-articles")
    public ResponseEntity<Long> countArticlesWithTag(@PathVariable Integer tagId) {
        Long count = articleArticleTagService.countArticlesWithTag(tagId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count tags for a specific article
     */
    @GetMapping("/article/{articleId}/count-tags")
    public ResponseEntity<Long> countTagsForArticle(@PathVariable Integer articleId) {
        Long count = articleArticleTagService.countTagsForArticle(articleId);
        return ResponseEntity.ok(count);
    }

    /**
     * Find articles that have all specified tags
     */
    @PostMapping("/articles-with-all-tags")
    public ResponseEntity<List<Integer>> findArticlesWithAllTags(@RequestBody List<Integer> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Long tagCount = (long) tagIds.size();
        List<Integer> articleIds = articleArticleTagService.findArticleIdsWithAllTags(tagIds, tagCount);
        return ResponseEntity.ok(articleIds);
    }

    /**
     * Get tag usage statistics
     */
    @GetMapping("/statistics/tag-usage")
    public ResponseEntity<List<Object[]>> getTagUsageStatistics() {
        List<Object[]> statistics = articleArticleTagService.findTagUsageStatistics();
        return ResponseEntity.ok(statistics);
    }
}
