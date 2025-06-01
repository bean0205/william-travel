package com.williamtravel.app.controller;

import com.williamtravel.app.entity.ArticleTag;
import com.williamtravel.app.service.ArticleTagService;
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
 * REST Controller for ArticleTag operations
 */
@RestController
@RequestMapping("/api/article-tags")
@CrossOrigin(origins = "*")
public class ArticleTagController {

    @Autowired
    private ArticleTagService articleTagService;

    /**
     * Get all article tags
     */
    @GetMapping
    public ResponseEntity<List<ArticleTag>> getAllArticleTags() {
        List<ArticleTag> tags = articleTagService.findAll();
        return ResponseEntity.ok(tags);
    }

    /**
     * Get all article tags with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<ArticleTag>> getAllArticleTagsPaginated(Pageable pageable) {
        Page<ArticleTag> tags = articleTagService.findAll(pageable);
        return ResponseEntity.ok(tags);
    }

    /**
     * Get article tag by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArticleTag> getArticleTagById(@PathVariable Integer id) {
        Optional<ArticleTag> tag = articleTagService.findById(id);
        return tag.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new article tag
     */
    @PostMapping
    public ResponseEntity<ArticleTag> createArticleTag(@RequestBody ArticleTag tag) {
        ArticleTag savedTag = articleTagService.save(tag);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTag);
    }

    /**
     * Update article tag
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArticleTag> updateArticleTag(@PathVariable Integer id, @RequestBody ArticleTag tag) {
        if (!articleTagService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tag.setId(id);
        ArticleTag updatedTag = articleTagService.save(tag);
        return ResponseEntity.ok(updatedTag);
    }

    /**
     * Delete article tag
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticleTag(@PathVariable Integer id) {
        if (!articleTagService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        articleTagService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total article tags
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countArticleTags() {
        long count = articleTagService.count();
        return ResponseEntity.ok(count);
    }

    // ================ NAME AND SLUG BASED QUERIES ================

    /**
     * Get article tag by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<ArticleTag> getArticleTagByName(@PathVariable String name) {
        Optional<ArticleTag> tag = articleTagService.findByName(name);
        return tag.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get article tag by slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ArticleTag> getArticleTagBySlug(@PathVariable String slug) {
        Optional<ArticleTag> tag = articleTagService.findBySlug(slug);
        return tag.map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if article tag exists by name
     */
    @GetMapping("/name/{name}/exists")
    public ResponseEntity<Boolean> checkTagExistsByName(@PathVariable String name) {
        boolean exists = articleTagService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if article tag exists by slug
     */
    @GetMapping("/slug/{slug}/exists")
    public ResponseEntity<Boolean> checkTagExistsBySlug(@PathVariable String slug) {
        boolean exists = articleTagService.existsBySlug(slug);
        return ResponseEntity.ok(exists);
    }

    // ================ STATUS-BASED QUERIES ================

    /**
     * Get article tags by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ArticleTag>> getArticleTagsByStatus(@PathVariable Boolean status) {
        List<ArticleTag> tags = articleTagService.findByStatus(status);
        return ResponseEntity.ok(tags);
    }

    /**
     * Get article tags by status with pagination
     */
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<Page<ArticleTag>> getArticleTagsByStatusPaginated(
            @PathVariable Boolean status, Pageable pageable) {
        Page<ArticleTag> tags = articleTagService.findByStatus(status, pageable);
        return ResponseEntity.ok(tags);
    }

    /**
     * Get all active tags ordered by name
     */
    @GetMapping("/active/ordered-by-name")
    public ResponseEntity<List<ArticleTag>> getAllActiveTagsOrderedByName() {
        List<ArticleTag> tags = articleTagService.findAllActiveOrderByName();
        return ResponseEntity.ok(tags);
    }

    // ================ SEARCH FUNCTIONALITY ================

    /**
     * Search tags by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<ArticleTag>> searchTagsByKeyword(@RequestParam String keyword) {
        List<ArticleTag> tags = articleTagService.searchByKeyword(keyword);
        return ResponseEntity.ok(tags);
    }

    /**
     * Search tags by keyword with pagination
     */
    @GetMapping("/search/paginated")
    public ResponseEntity<Page<ArticleTag>> searchTagsByKeywordPaginated(
            @RequestParam String keyword, Pageable pageable) {
        Page<ArticleTag> tags = articleTagService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(tags);
    }

    // ================ ARTICLE RELATIONSHIP QUERIES ================

    /**
     * Get tags with article count
     */
    @GetMapping("/with-article-count")
    public ResponseEntity<List<Object[]>> getTagsWithArticleCount() {
        List<Object[]> tags = articleTagService.findTagsWithArticleCount();
        return ResponseEntity.ok(tags);
    }

    /**
     * Get tags ordered by article count
     */
    @GetMapping("/ordered-by-article-count")
    public ResponseEntity<List<ArticleTag>> getTagsOrderedByArticleCount() {
        List<ArticleTag> tags = articleTagService.findTagsOrderByArticleCount();
        return ResponseEntity.ok(tags);
    }

    /**
     * Get tags ordered by article count with pagination
     */
    @GetMapping("/ordered-by-article-count/paginated")
    public ResponseEntity<Page<ArticleTag>> getTagsOrderedByArticleCountPaginated(Pageable pageable) {
        Page<ArticleTag> tags = articleTagService.findTagsOrderByArticleCount(pageable);
        return ResponseEntity.ok(tags);
    }

    /**
     * Get tags with published articles
     */
    @GetMapping("/with-published-articles")
    public ResponseEntity<List<ArticleTag>> getTagsWithPublishedArticles() {
        List<ArticleTag> tags = articleTagService.findTagsWithPublishedArticles();
        return ResponseEntity.ok(tags);
    }

    // ================ POPULAR AND TRENDING QUERIES ================

    /**
     * Get popular tags
     */
    @GetMapping("/popular")
    public ResponseEntity<List<ArticleTag>> getPopularTags(Pageable pageable) {
        List<ArticleTag> tags = articleTagService.findPopularTags(pageable);
        return ResponseEntity.ok(tags);
    }

    /**
     * Get tag cloud data
     */
    @GetMapping("/tag-cloud")
    public ResponseEntity<List<Object[]>> getTagCloudData() {
        List<Object[]> tagCloudData = articleTagService.findTagCloudData();
        return ResponseEntity.ok(tagCloudData);
    }

    /**
     * Get related tags
     */
    @GetMapping("/{tagId}/related")
    public ResponseEntity<List<ArticleTag>> getRelatedTags(@PathVariable Integer tagId) {
        List<ArticleTag> relatedTags = articleTagService.findRelatedTags(tagId);
        return ResponseEntity.ok(relatedTags);
    }

    /**
     * Get recent tags
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ArticleTag>> getRecentTags(Pageable pageable) {
        List<ArticleTag> tags = articleTagService.findRecentTags(pageable);
        return ResponseEntity.ok(tags);
    }

    /**
     * Get tags starting with specific letter
     */
    @GetMapping("/starting-with/{letter}")
    public ResponseEntity<List<ArticleTag>> getTagsStartingWith(@PathVariable String letter) {
        List<ArticleTag> tags = articleTagService.findTagsStartingWith(letter);
        return ResponseEntity.ok(tags);
    }

    /**
     * Get trending tags since date
     */
    @GetMapping("/trending/since")
    public ResponseEntity<List<ArticleTag>> getTrendingTagsSince(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since,
            Pageable pageable) {
        List<ArticleTag> tags = articleTagService.findTrendingTags(since, pageable);
        return ResponseEntity.ok(tags);
    }

    // ================ STATISTICS AND ANALYTICS ================

    /**
     * Count active tags
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveTags() {
        Long count = articleTagService.countActiveTags();
        return ResponseEntity.ok(count);
    }

    /**
     * Count published articles with specific tag
     */
    @GetMapping("/{tagId}/published-articles/count")
    public ResponseEntity<Long> countPublishedArticlesWithTag(@PathVariable Integer tagId) {
        Long count = articleTagService.countPublishedArticlesWithTag(tagId);
        return ResponseEntity.ok(count);
    }
}
