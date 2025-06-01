package com.williamtravel.app.controller;

import com.williamtravel.app.entity.ArticleArticleCategory;
import com.williamtravel.app.service.ArticleArticleCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for ArticleArticleCategory operations
 */
@RestController
@RequestMapping("/api/article-article-categories")
@CrossOrigin(origins = "*")
public class ArticleArticleCategoryController {

    @Autowired
    private ArticleArticleCategoryService articleArticleCategoryService;

    /**
     * Get all article-article category relationships
     */
    @GetMapping
    public ResponseEntity<List<ArticleArticleCategory>> getAllArticleArticleCategories() {
        List<ArticleArticleCategory> relationships = articleArticleCategoryService.findAll();
        return ResponseEntity.ok(relationships);
    }

    /**
     * Get article-article category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArticleArticleCategory> getArticleArticleCategoryById(@PathVariable Integer id) {
        Optional<ArticleArticleCategory> relationship = articleArticleCategoryService.findById(id);
        return relationship.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new article-article category relationship
     */
    @PostMapping
    public ResponseEntity<ArticleArticleCategory> createArticleArticleCategory(@RequestBody ArticleArticleCategory relationship) {
        ArticleArticleCategory savedRelationship = articleArticleCategoryService.save(relationship);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRelationship);
    }

    /**
     * Update article-article category relationship
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArticleArticleCategory> updateArticleArticleCategory(@PathVariable Integer id, @RequestBody ArticleArticleCategory relationship) {
        if (!articleArticleCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        relationship.setId(id);
        ArticleArticleCategory updatedRelationship = articleArticleCategoryService.save(relationship);
        return ResponseEntity.ok(updatedRelationship);
    }

    /**
     * Delete article-article category relationship
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticleArticleCategory(@PathVariable Integer id) {
        if (!articleArticleCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleArticleCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total article-article category relationships
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countArticleArticleCategories() {
        long count = articleArticleCategoryService.count();
        return ResponseEntity.ok(count);
    }

    /**
     * Get relationships by article ID
     */
    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<ArticleArticleCategory>> getRelationshipsByArticleId(@PathVariable Integer articleId) {
        List<ArticleArticleCategory> relationships = articleArticleCategoryService.findByArticleId(articleId);
        return ResponseEntity.ok(relationships);
    }

    /**
     * Get relationships by category ID
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ArticleArticleCategory>> getRelationshipsByCategoryId(@PathVariable Integer categoryId) {
        List<ArticleArticleCategory> relationships = articleArticleCategoryService.findByCategoryId(categoryId);
        return ResponseEntity.ok(relationships);
    }

    /**
     * Get specific relationship by article ID and category ID
     */
    @GetMapping("/article/{articleId}/category/{categoryId}")
    public ResponseEntity<ArticleArticleCategory> getRelationshipByArticleAndCategory(
            @PathVariable Integer articleId, 
            @PathVariable Integer categoryId) {
        ArticleArticleCategory relationship = articleArticleCategoryService.findByArticleIdAndCategoryId(articleId, categoryId);
        if (relationship != null) {
            return ResponseEntity.ok(relationship);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Check if relationship exists by article ID and category ID
     */
    @GetMapping("/exists/article/{articleId}/category/{categoryId}")
    public ResponseEntity<Boolean> existsByArticleAndCategory(
            @PathVariable Integer articleId, 
            @PathVariable Integer categoryId) {
        boolean exists = articleArticleCategoryService.existsByArticleIdAndCategoryId(articleId, categoryId);
        return ResponseEntity.ok(exists);
    }

    /**
     * Delete relationships by article ID
     */
    @DeleteMapping("/article/{articleId}")
    public ResponseEntity<Void> deleteRelationshipsByArticleId(@PathVariable Integer articleId) {
        articleArticleCategoryService.deleteByArticleId(articleId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete relationships by category ID
     */
    @DeleteMapping("/category/{categoryId}")
    public ResponseEntity<Void> deleteRelationshipsByCategoryId(@PathVariable Integer categoryId) {
        articleArticleCategoryService.deleteByCategoryId(categoryId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete specific relationship by article ID and category ID
     */
    @DeleteMapping("/article/{articleId}/category/{categoryId}")
    public ResponseEntity<Void> deleteRelationshipByArticleAndCategory(
            @PathVariable Integer articleId, 
            @PathVariable Integer categoryId) {
        articleArticleCategoryService.deleteByArticleIdAndCategoryId(articleId, categoryId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count articles in category
     */
    @GetMapping("/category/{categoryId}/articles/count")
    public ResponseEntity<Long> countArticlesInCategory(@PathVariable Integer categoryId) {
        Long count = articleArticleCategoryService.countArticlesInCategory(categoryId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count categories for article
     */
    @GetMapping("/article/{articleId}/categories/count")
    public ResponseEntity<Long> countCategoriesForArticle(@PathVariable Integer articleId) {
        Long count = articleArticleCategoryService.countCategoriesForArticle(articleId);
        return ResponseEntity.ok(count);
    }

    /**
     * Find article IDs with all specified categories
     */
    @PostMapping("/articles/with-all-categories")
    public ResponseEntity<List<Integer>> findArticleIdsWithAllCategories(@RequestBody List<Integer> categoryIds) {
        Long categoryCount = (long) categoryIds.size();
        List<Integer> articleIds = articleArticleCategoryService.findArticleIdsWithAllCategories(categoryIds, categoryCount);
        return ResponseEntity.ok(articleIds);
    }

    /**
     * Check if relationship exists by ID
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        boolean exists = articleArticleCategoryService.existsById(id);
        return ResponseEntity.ok(exists);
    }
}
