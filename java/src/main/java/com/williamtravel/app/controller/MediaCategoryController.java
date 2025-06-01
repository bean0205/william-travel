package com.williamtravel.app.controller;

import com.williamtravel.app.entity.MediaCategory;
import com.williamtravel.app.service.MediaCategoryService;
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
 * REST Controller for MediaCategory operations
 */
@RestController
@RequestMapping("/api/media-categories")
@CrossOrigin(origins = "*")
public class MediaCategoryController {

    @Autowired
    private MediaCategoryService mediaCategoryService;

    // ===== EXISTING ENDPOINTS =====

    /**
     * Get all media categories
     */
    @GetMapping
    public ResponseEntity<List<MediaCategory>> getAllMediaCategories() {
        List<MediaCategory> categories = mediaCategoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MediaCategory> getMediaCategoryById(@PathVariable Integer id) {
        Optional<MediaCategory> category = mediaCategoryService.findById(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new media category
     */
    @PostMapping
    public ResponseEntity<MediaCategory> createMediaCategory(@RequestBody MediaCategory category) {
        MediaCategory savedCategory = mediaCategoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    /**
     * Update media category
     */
    @PutMapping("/{id}")
    public ResponseEntity<MediaCategory> updateMediaCategory(@PathVariable Integer id, @RequestBody MediaCategory category) {
        if (!mediaCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        category.setId(id);
        MediaCategory updatedCategory = mediaCategoryService.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Delete media category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMediaCategory(@PathVariable Integer id) {
        if (!mediaCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        mediaCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total media categories
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countMediaCategories() {
        long count = mediaCategoryService.count();
        return ResponseEntity.ok(count);
    }

    // ===== NEW ENDPOINTS =====

    /**
     * Get media category by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<MediaCategory> getMediaCategoryByName(@PathVariable String name) {
        Optional<MediaCategory> category = mediaCategoryService.findByName(name);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if media category exists by name
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = mediaCategoryService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get media categories by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MediaCategory>> getMediaCategoriesByStatus(@PathVariable Integer status) {
        List<MediaCategory> categories = mediaCategoryService.findByStatus(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories by status with pagination
     */
    @GetMapping("/status/{status}/paged")
    public ResponseEntity<Page<MediaCategory>> getMediaCategoriesByStatusPaged(
            @PathVariable Integer status, 
            Pageable pageable) {
        Page<MediaCategory> categories = mediaCategoryService.findByStatus(status, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get all active media categories ordered by name
     */
    @GetMapping("/active/ordered")
    public ResponseEntity<List<MediaCategory>> getActiveMediaCategoriesOrderedByName() {
        List<MediaCategory> categories = mediaCategoryService.findAllActiveOrderByName();
        return ResponseEntity.ok(categories);
    }

    /**
     * Search media categories by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<MediaCategory>> searchMediaCategories(@RequestParam String keyword) {
        List<MediaCategory> categories = mediaCategoryService.searchByKeyword(keyword);
        return ResponseEntity.ok(categories);
    }

    /**
     * Search media categories by keyword with pagination
     */
    @GetMapping("/search/paged")
    public ResponseEntity<Page<MediaCategory>> searchMediaCategoriesPaged(
            @RequestParam String keyword, 
            Pageable pageable) {
        Page<MediaCategory> categories = mediaCategoryService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories with media count
     */
    @GetMapping("/with-media-count")
    public ResponseEntity<List<Object[]>> getCategoriesWithMediaCount() {
        List<Object[]> categoriesWithCount = mediaCategoryService.findCategoriesWithMediaCount();
        return ResponseEntity.ok(categoriesWithCount);
    }

    /**
     * Get media categories ordered by media count
     */
    @GetMapping("/ordered-by-media-count")
    public ResponseEntity<List<MediaCategory>> getCategoriesOrderedByMediaCount() {
        List<MediaCategory> categories = mediaCategoryService.findCategoriesOrderByMediaCount();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories ordered by media count with pagination
     */
    @GetMapping("/ordered-by-media-count/paged")
    public ResponseEntity<Page<MediaCategory>> getCategoriesOrderedByMediaCountPaged(Pageable pageable) {
        Page<MediaCategory> categories = mediaCategoryService.findCategoriesOrderByMediaCount(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories that have media
     */
    @GetMapping("/with-media")
    public ResponseEntity<List<MediaCategory>> getCategoriesWithMedia() {
        List<MediaCategory> categories = mediaCategoryService.findCategoriesWithMedia();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get categories usage by reference type
     */
    @GetMapping("/usage/reference-type/{referenceType}")
    public ResponseEntity<List<Object[]>> getCategoriesUsageByReferenceType(@PathVariable String referenceType) {
        List<Object[]> usage = mediaCategoryService.findCategoriesUsageByReferenceType(referenceType);
        return ResponseEntity.ok(usage);
    }

    /**
     * Count active media categories
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveCategories() {
        Long count = mediaCategoryService.countActiveCategories();
        return ResponseEntity.ok(count);
    }

    /**
     * Count media in specific category
     */
    @GetMapping("/{categoryId}/media/count")
    public ResponseEntity<Long> countMediaInCategory(@PathVariable Integer categoryId) {
        Long count = mediaCategoryService.countMediaInCategory(categoryId);
        return ResponseEntity.ok(count);
    }

    /**
     * Get recent media categories
     */
    @GetMapping("/recent")
    public ResponseEntity<List<MediaCategory>> getRecentCategories(Pageable pageable) {
        List<MediaCategory> categories = mediaCategoryService.findRecentCategories(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<MediaCategory>> getCategoriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<MediaCategory> categories = mediaCategoryService.findCategoriesByDateRange(startDate, endDate);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories by total file size
     */
    @GetMapping("/by-total-file-size")
    public ResponseEntity<List<MediaCategory>> getCategoriesByTotalFileSize(Pageable pageable) {
        List<MediaCategory> categories = mediaCategoryService.findCategoriesByTotalFileSize(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories with specific media type
     */
    @GetMapping("/media-type/{mediaTypeId}")
    public ResponseEntity<List<MediaCategory>> getCategoriesWithMediaType(@PathVariable Integer mediaTypeId) {
        List<MediaCategory> categories = mediaCategoryService.findCategoriesWithMediaType(mediaTypeId);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get media categories used for specific reference type
     */
    @GetMapping("/used-for-reference-type/{referenceType}")
    public ResponseEntity<List<MediaCategory>> getCategoriesUsedForReferenceType(@PathVariable String referenceType) {
        List<MediaCategory> categories = mediaCategoryService.findCategoriesUsedForReferenceType(referenceType);
        return ResponseEntity.ok(categories);
    }

    /**
     * Get empty media categories (no media)
     */
    @GetMapping("/empty")
    public ResponseEntity<List<MediaCategory>> getEmptyCategories() {
        List<MediaCategory> categories = mediaCategoryService.findEmptyCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Check if media category exists by ID
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        boolean exists = mediaCategoryService.existsById(id);
        return ResponseEntity.ok(exists);
    }
}
