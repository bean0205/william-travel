package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Media;
import com.williamtravel.app.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Media operations
 */
@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all media
     */
    @GetMapping
    public ResponseEntity<List<Media>> getAllMedia() {
        List<Media> media = mediaService.findAll();
        return ResponseEntity.ok(media);
    }

    /**
     * Get media by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Media> getMediaById(@PathVariable Integer id) {
        Optional<Media> media = mediaService.findById(id);
        return media.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new media
     */
    @PostMapping
    public ResponseEntity<Media> createMedia(@RequestBody Media media) {
        Media savedMedia = mediaService.save(media);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMedia);
    }

    /**
     * Update media
     */
    @PutMapping("/{id}")
    public ResponseEntity<Media> updateMedia(@PathVariable Integer id, @RequestBody Media media) {
        if (!mediaService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        media.setId(id);
        Media updatedMedia = mediaService.save(media);
        return ResponseEntity.ok(updatedMedia);
    }

    /**
     * Delete media
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Integer id) {
        if (!mediaService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        mediaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total media
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countMedia() {
        long count = mediaService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    // Pagination
    /**
     * Get all media with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Media>> getMediaPage(Pageable pageable) {
        Page<Media> media = mediaService.findAll(pageable);
        return ResponseEntity.ok(media);
    }

    // Find by reference (entity this media belongs to)
    /**
     * Find media by reference
     */
    @GetMapping("/reference/{referenceId}/{referenceType}")
    public ResponseEntity<List<Media>> getMediaByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        List<Media> media = mediaService.findByReference(referenceId, referenceType);
        return ResponseEntity.ok(media);
    }

    /**
     * Find media by reference with pagination
     */
    @GetMapping("/reference/{referenceId}/{referenceType}/page")
    public ResponseEntity<Page<Media>> getMediaByReferencePage(@PathVariable Integer referenceId, @PathVariable String referenceType, Pageable pageable) {
        Page<Media> media = mediaService.findByReference(referenceId, referenceType, pageable);
        return ResponseEntity.ok(media);
    }

    // Find by reference type
    /**
     * Find media by reference type
     */
    @GetMapping("/reference-type/{referenceType}")
    public ResponseEntity<List<Media>> getMediaByReferenceType(@PathVariable String referenceType) {
        List<Media> media = mediaService.findByReferenceType(referenceType);
        return ResponseEntity.ok(media);
    }

    /**
     * Find media by reference type with pagination
     */
    @GetMapping("/reference-type/{referenceType}/page")
    public ResponseEntity<Page<Media>> getMediaByReferenceTypePage(@PathVariable String referenceType, Pageable pageable) {
        Page<Media> media = mediaService.findByReferenceType(referenceType, pageable);
        return ResponseEntity.ok(media);
    }

    // Find by media type
    /**
     * Find media by type ID
     */
    @GetMapping("/type/{typeId}")
    public ResponseEntity<List<Media>> getMediaByTypeId(@PathVariable Integer typeId) {
        List<Media> media = mediaService.findByTypeId(typeId);
        return ResponseEntity.ok(media);
    }

    /**
     * Find media by type ID with pagination
     */
    @GetMapping("/type/{typeId}/page")
    public ResponseEntity<Page<Media>> getMediaByTypeIdPage(@PathVariable Integer typeId, Pageable pageable) {
        Page<Media> media = mediaService.findByTypeId(typeId, pageable);
        return ResponseEntity.ok(media);
    }

    // Find by media category
    /**
     * Find media by category ID
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Media>> getMediaByCategoryId(@PathVariable Integer categoryId) {
        List<Media> media = mediaService.findByCategoryId(categoryId);
        return ResponseEntity.ok(media);
    }

    /**
     * Find media by category ID with pagination
     */
    @GetMapping("/category/{categoryId}/page")
    public ResponseEntity<Page<Media>> getMediaByCategoryIdPage(@PathVariable Integer categoryId, Pageable pageable) {
        Page<Media> media = mediaService.findByCategoryId(categoryId, pageable);
        return ResponseEntity.ok(media);
    }

    // Find by file path
    /**
     * Find media by file path
     */
    @GetMapping("/file-path")
    public ResponseEntity<Media> getMediaByFilePath(@RequestParam String filePath) {
        Optional<Media> media = mediaService.findByFilePath(filePath);
        return media.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if media exists by file path
     */
    @GetMapping("/exists/file-path")
    public ResponseEntity<Boolean> existsByFilePath(@RequestParam String filePath) {
        boolean exists = mediaService.existsByFilePath(filePath);
        return ResponseEntity.ok(exists);
    }

    // Find by original filename
    /**
     * Find media by original filename containing
     */
    @GetMapping("/search/filename")
    public ResponseEntity<List<Media>> getMediaByOriginalFileNameContaining(@RequestParam String filename) {
        List<Media> media = mediaService.findByOriginalFileNameContaining(filename);
        return ResponseEntity.ok(media);
    }

    // Find by alt text
    /**
     * Find media by alt text containing
     */
    @GetMapping("/search/alt-text")
    public ResponseEntity<List<Media>> getMediaByAltTextContaining(@RequestParam String altText) {
        List<Media> media = mediaService.findByAltTextContaining(altText);
        return ResponseEntity.ok(media);
    }

    // Find main/featured media for entities
    /**
     * Find main media by reference
     */
    @GetMapping("/main/reference/{referenceId}/{referenceType}")
    public ResponseEntity<Media> getMainMediaByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        Optional<Media> media = mediaService.findMainMediaByReference(referenceId, referenceType);
        return media.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Find all main media
     */
    @GetMapping("/main")
    public ResponseEntity<List<Media>> getAllMainMedia() {
        List<Media> media = mediaService.findAllMainMedia();
        return ResponseEntity.ok(media);
    }

    // Find by file size range
    /**
     * Find media by file size range
     */
    @GetMapping("/file-size-range")
    public ResponseEntity<List<Media>> getMediaByFileSizeRange(@RequestParam Long minSize, @RequestParam Long maxSize) {
        List<Media> media = mediaService.findByFileSizeRange(minSize, maxSize);
        return ResponseEntity.ok(media);
    }

    // Find by upload date range
    /**
     * Find media by upload date range
     */
    @GetMapping("/upload-date-range")
    public ResponseEntity<List<Media>> getMediaByUploadDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Media> media = mediaService.findByUploadDateRange(startDate, endDate);
        return ResponseEntity.ok(media);
    }

    /**
     * Find media by upload date range with pagination
     */
    @GetMapping("/upload-date-range/page")
    public ResponseEntity<Page<Media>> getMediaByUploadDateRangePage(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        Page<Media> media = mediaService.findByUploadDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(media);
    }

    // Recent uploads
    /**
     * Find recent uploads
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Media>> getRecentUploads(Pageable pageable) {
        List<Media> media = mediaService.findRecentUploads(pageable);
        return ResponseEntity.ok(media);
    }

    // Find by dimensions (for images)
    /**
     * Find media by dimensions
     */
    @GetMapping("/dimensions")
    public ResponseEntity<List<Media>> getMediaByDimensions(@RequestParam Integer width, @RequestParam Integer height) {
        List<Media> media = mediaService.findByDimensions(width, height);
        return ResponseEntity.ok(media);
    }

    /**
     * Find media by minimum dimensions
     */
    @GetMapping("/min-dimensions")
    public ResponseEntity<List<Media>> getMediaByMinDimensions(@RequestParam Integer minWidth, @RequestParam Integer minHeight) {
        List<Media> media = mediaService.findByMinDimensions(minWidth, minHeight);
        return ResponseEntity.ok(media);
    }

    // Statistical queries
    /**
     * Count media by reference
     */
    @GetMapping("/count/reference/{referenceId}/{referenceType}")
    public ResponseEntity<Long> countMediaByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        Long count = mediaService.countMediaByReference(referenceId, referenceType);
        return ResponseEntity.ok(count);
    }

    /**
     * Count media by type
     */
    @GetMapping("/count/type/{referenceType}")
    public ResponseEntity<Long> countMediaByType(@PathVariable String referenceType) {
        Long count = mediaService.countMediaByType(referenceType);
        return ResponseEntity.ok(count);
    }

    /**
     * Count media by media type
     */
    @GetMapping("/count/media-type/{typeId}")
    public ResponseEntity<Long> countMediaByMediaType(@PathVariable Integer typeId) {
        Long count = mediaService.countMediaByMediaType(typeId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count media by category
     */
    @GetMapping("/count/category/{categoryId}")
    public ResponseEntity<Long> countMediaByCategory(@PathVariable Integer categoryId) {
        Long count = mediaService.countMediaByCategory(categoryId);
        return ResponseEntity.ok(count);
    }

    /**
     * Get total file size by reference
     */
    @GetMapping("/total-size/reference/{referenceId}/{referenceType}")
    public ResponseEntity<Long> getTotalFileSizeByReference(@PathVariable Integer referenceId, @PathVariable String referenceType) {
        Long totalSize = mediaService.getTotalFileSizeByReference(referenceId, referenceType);
        return ResponseEntity.ok(totalSize);
    }

    /**
     * Get total file size
     */
    @GetMapping("/total-size")
    public ResponseEntity<Long> getTotalFileSize() {
        Long totalSize = mediaService.getTotalFileSize();
        return ResponseEntity.ok(totalSize);
    }

    // Find media by type and reference combination
    /**
     * Find media by reference and type
     */
    @GetMapping("/reference/{referenceId}/{referenceType}/type/{typeId}")
    public ResponseEntity<List<Media>> getMediaByReferenceAndType(@PathVariable Integer referenceId, @PathVariable String referenceType, @PathVariable Integer typeId) {
        List<Media> media = mediaService.findByReferenceAndType(referenceId, referenceType, typeId);
        return ResponseEntity.ok(media);
    }

    // Find media by category and reference combination
    /**
     * Find media by reference and category
     */
    @GetMapping("/reference/{referenceId}/{referenceType}/category/{categoryId}")
    public ResponseEntity<List<Media>> getMediaByReferenceAndCategory(@PathVariable Integer referenceId, @PathVariable String referenceType, @PathVariable Integer categoryId) {
        List<Media> media = mediaService.findByReferenceAndCategory(referenceId, referenceType, categoryId);
        return ResponseEntity.ok(media);
    }

    // Statistics
    /**
     * Find most used media types
     */
    @GetMapping("/statistics/most-used-types")
    public ResponseEntity<List<Object[]>> getMostUsedMediaTypes() {
        List<Object[]> statistics = mediaService.findMostUsedMediaTypes();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Find most used media categories
     */
    @GetMapping("/statistics/most-used-categories")
    public ResponseEntity<List<Object[]>> getMostUsedMediaCategories() {
        List<Object[]> statistics = mediaService.findMostUsedMediaCategories();
        return ResponseEntity.ok(statistics);
    }

    /**
     * Find entities with most media
     */
    @GetMapping("/statistics/entities-with-most-media")
    public ResponseEntity<List<Object[]>> getEntitiesWithMostMedia(Pageable pageable) {
        List<Object[]> statistics = mediaService.findEntitiesWithMostMedia(pageable);
        return ResponseEntity.ok(statistics);
    }

    // Search media by filename and alt text
    /**
     * Search media
     */
    @GetMapping("/search")
    public ResponseEntity<List<Media>> searchMedia(@RequestParam String keyword) {
        List<Media> media = mediaService.searchMedia(keyword);
        return ResponseEntity.ok(media);
    }

    /**
     * Search media with pagination
     */
    @GetMapping("/search/page")
    public ResponseEntity<Page<Media>> searchMediaPage(@RequestParam String keyword, Pageable pageable) {
        Page<Media> media = mediaService.searchMedia(keyword, pageable);
        return ResponseEntity.ok(media);
    }

    // Find orphaned media
    /**
     * Find orphaned media
     */
    @GetMapping("/orphaned")
    public ResponseEntity<List<Media>> getOrphanedMedia() {
        List<Media> media = mediaService.findOrphanedMedia();
        return ResponseEntity.ok(media);
    }
}
