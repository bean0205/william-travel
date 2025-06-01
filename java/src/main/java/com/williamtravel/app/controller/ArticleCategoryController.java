package com.williamtravel.app.controller;

import com.williamtravel.app.entity.ArticleCategory;
import com.williamtravel.app.service.ArticleCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for ArticleCategory operations
 */
@RestController
@RequestMapping("/api/article-categories")
@CrossOrigin(origins = "*")
public class ArticleCategoryController {

    @Autowired
    private ArticleCategoryService articleCategoryService;

    /**
     * Get all article categories
     */
    @GetMapping
    public ResponseEntity<List<ArticleCategory>> getAllArticleCategories() {
        List<ArticleCategory> categories = articleCategoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get article category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArticleCategory> getArticleCategoryById(@PathVariable Integer id) {
        Optional<ArticleCategory> category = articleCategoryService.findById(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new article category
     */
    @PostMapping
    public ResponseEntity<ArticleCategory> createArticleCategory(@RequestBody ArticleCategory category) {
        ArticleCategory savedCategory = articleCategoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    /**
     * Update article category
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArticleCategory> updateArticleCategory(@PathVariable Integer id, @RequestBody ArticleCategory category) {
        if (!articleCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        category.setId(id);
        ArticleCategory updatedCategory = articleCategoryService.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Delete article category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticleCategory(@PathVariable Integer id) {
        if (!articleCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total article categories
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countArticleCategories() {
        long count = articleCategoryService.count();
        return ResponseEntity.ok(count);
    }

    // ================ PAGINATION QUERIES ================

    /**
     * Get all article categories with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<ArticleCategory>> getAllArticleCategoriesPaginated(Pageable pageable) {
        Page<ArticleCategory> categories = articleCategoryService.findAll(pageable);
        return ResponseEntity.ok(categories);
    }

    // ================ NAME AND SLUG BASED QUERIES ================

    /**
     * Get article category by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<ArticleCategory> getArticleCategoryByName(@PathVariable String name) {
        Optional<ArticleCategory> category = articleCategoryService.findByName(name);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get article category by slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ArticleCategory> getArticleCategoryBySlug(@PathVariable String slug) {
        Optional<ArticleCategory> category = articleCategoryService.findBySlug(slug);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if article category exists by name
     */
    @GetMapping("/name/{name}/exists")
    public ResponseEntity<Boolean> checkCategoryExistsByName(@PathVariable String name) {
        boolean exists = articleCategoryService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if article category exists by slug
     */
    @GetMapping("/slug/{slug}/exists")
    public ResponseEntity<Boolean> checkCategoryExistsBySlug(@PathVariable String slug) {
        boolean exists = articleCategoryService.existsBySlug(slug);
        return ResponseEntity.ok(exists);
    }

    // ================ STATUS-BASED QUERIES ================

    /**
     * Get article categories by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ArticleCategory>> getArticleCategoriesByStatus(@PathVariable Boolean status) {
        List<ArticleCategory> categories = articleCategoryService.findByStatus(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get article categories by status with pagination
     */
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<Page<ArticleCategory>> getArticleCategoriesByStatusPaginated(
            @PathVariable Boolean status, Pageable pageable) {
        Page<ArticleCategory> categories = articleCategoryService.findByStatus(status, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get all active categories ordered by name
     */
    @GetMapping("/active/ordered-by-name")
    public ResponseEntity<List<ArticleCategory>> getAllActiveCategoriesOrderedByName() {
        List<ArticleCategory> categories = articleCategoryService.findAllActiveOrderByName();
        return ResponseEntity.ok(categories);
    }

    /**
     * Count active categories
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveCategories() {
        Long count = articleCategoryService.countActiveCategories();
        return ResponseEntity.ok(count);
    }

    // ================ SEARCH FUNCTIONALITY ================

    /**
     * Search categories by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<ArticleCategory>> searchCategoriesByKeyword(@RequestParam String keyword) {
        List<ArticleCategory> categories = articleCategoryService.searchByKeyword(keyword);
        return ResponseEntity.ok(categories);
    }

    /**
     * Search categories by keyword with pagination
     */
    @GetMapping("/search/paginated")
    public ResponseEntity<Page<ArticleCategory>> searchCategoriesByKeywordPaginated(
            @RequestParam String keyword, Pageable pageable) {
        Page<ArticleCategory> categories = articleCategoryService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(categories);
    }

    // ================ HIERARCHICAL QUERIES ================

    /**
     * Get root categories
     */
    @GetMapping("/root")
    public ResponseEntity<List<ArticleCategory>> getRootCategories() {
        List<ArticleCategory> categories = articleCategoryService.findRootCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get root categories with pagination
     */
    @GetMapping("/root/paginated")
    public ResponseEntity<Page<ArticleCategory>> getRootCategoriesPaginated(Pageable pageable) {
        Page<ArticleCategory> categories = articleCategoryService.findRootCategories(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories by parent category ID
     */
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<ArticleCategory>> getCategoriesByParentId(@PathVariable Integer parentId) {
        List<ArticleCategory> categories = articleCategoryService.findByParentCategoryId(parentId);
        return ResponseEntity.ok(categories);
    }

    // ================ ARTICLE RELATIONSHIP QUERIES ================

    /**
     * Get categories with article count
     */
    @GetMapping("/with-article-count")
    public ResponseEntity<List<Object[]>> getCategoriesWithArticleCount() {
        List<Object[]> categories = articleCategoryService.findCategoriesWithArticleCount();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories ordered by article count
     */
    @GetMapping("/ordered-by-article-count")
    public ResponseEntity<List<ArticleCategory>> getCategoriesOrderedByArticleCount() {
        List<ArticleCategory> categories = articleCategoryService.findCategoriesOrderByArticleCount();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories ordered by article count with pagination
     */
    @GetMapping("/ordered-by-article-count/paginated")
    public ResponseEntity<Page<ArticleCategory>> getCategoriesOrderedByArticleCountPaginated(Pageable pageable) {
        Page<ArticleCategory> categories = articleCategoryService.findCategoriesOrderByArticleCount(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories with published articles
     */
    @GetMapping("/with-published-articles")
    public ResponseEntity<List<ArticleCategory>> getCategoriesWithPublishedArticles() {
        List<ArticleCategory> categories = articleCategoryService.findCategoriesWithPublishedArticles();
        return ResponseEntity.ok(categories);
    }

    /**
     * Count published articles in category
     */
    @GetMapping("/{categoryId}/published-articles/count")
    public ResponseEntity<Long> countPublishedArticlesInCategory(@PathVariable Integer categoryId) {
        Long count = articleCategoryService.countPublishedArticlesInCategory(categoryId);
        return ResponseEntity.ok(count);
    }

    // ================ TRENDING AND POPULARITY QUERIES ================

    /**
     * Get recent categories
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ArticleCategory>> getRecentCategories(Pageable pageable) {
        List<ArticleCategory> categories = articleCategoryService.findRecentCategories(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get popular categories
     */
    @GetMapping("/popular")
    public ResponseEntity<List<ArticleCategory>> getPopularCategories(Pageable pageable) {
        List<ArticleCategory> categories = articleCategoryService.findPopularCategories(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get featured categories
     */
    @GetMapping("/featured")
    public ResponseEntity<List<ArticleCategory>> getFeaturedCategories() {
        List<ArticleCategory> categories = articleCategoryService.findFeaturedCategories();
        return ResponseEntity.ok(categories);
    }

    // ================ SORTING QUERIES ================

    /**
     * Get all categories ordered by sort order
     */
    @GetMapping("/ordered-by-sort")
    public ResponseEntity<List<ArticleCategory>> getAllCategoriesOrderedBySortOrder() {
        List<ArticleCategory> categories = articleCategoryService.findAllOrderBySortOrder();
        return ResponseEntity.ok(categories);
    }
}
