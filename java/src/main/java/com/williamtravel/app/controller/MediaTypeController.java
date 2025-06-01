package com.williamtravel.app.controller;

import com.williamtravel.app.entity.MediaType;
import com.williamtravel.app.service.MediaTypeService;
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
 * REST Controller for MediaType operations
 */
@RestController
@RequestMapping("/api/media-types")
@CrossOrigin(origins = "*")
public class MediaTypeController {

    @Autowired
    private MediaTypeService mediaTypeService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all media types
     */
    @GetMapping
    public ResponseEntity<List<MediaType>> getAllMediaTypes() {
        List<MediaType> types = mediaTypeService.findAll();
        return ResponseEntity.ok(types);
    }

    /**
     * Get media type by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MediaType> getMediaTypeById(@PathVariable Integer id) {
        Optional<MediaType> type = mediaTypeService.findById(id);
        return type.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new media type
     */
    @PostMapping
    public ResponseEntity<MediaType> createMediaType(@RequestBody MediaType type) {
        MediaType savedType = mediaTypeService.save(type);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedType);
    }

    /**
     * Update media type
     */
    @PutMapping("/{id}")
    public ResponseEntity<MediaType> updateMediaType(@PathVariable Integer id, @RequestBody MediaType type) {
        if (!mediaTypeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        type.setId(id);
        MediaType updatedType = mediaTypeService.save(type);
        return ResponseEntity.ok(updatedType);
    }

    /**
     * Delete media type
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMediaType(@PathVariable Integer id) {
        if (!mediaTypeService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        mediaTypeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total media types
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countMediaTypes() {
        long count = mediaTypeService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    // Pagination
    /**
     * Get all media types with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<MediaType>> getMediaTypesPage(Pageable pageable) {
        Page<MediaType> types = mediaTypeService.findAll(pageable);
        return ResponseEntity.ok(types);
    }

    // Basic finder methods
    /**
     * Get media type by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<MediaType> getMediaTypeByName(@PathVariable String name) {
        Optional<MediaType> type = mediaTypeService.findByName(name);
        return type.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get media type by extension
     */
    @GetMapping("/extension/{extension}")
    public ResponseEntity<MediaType> getMediaTypeByExtension(@PathVariable String extension) {
        Optional<MediaType> type = mediaTypeService.findByExtension(extension);
        return type.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if media type exists by name
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = mediaTypeService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if media type exists by extension
     */
    @GetMapping("/exists/extension/{extension}")
    public ResponseEntity<Boolean> existsByExtension(@PathVariable String extension) {
        boolean exists = mediaTypeService.existsByExtension(extension);
        return ResponseEntity.ok(exists);
    }

    // Status-based queries
    /**
     * Get media types by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MediaType>> getMediaTypesByStatus(@PathVariable Integer status) {
        List<MediaType> types = mediaTypeService.findByStatus(status);
        return ResponseEntity.ok(types);
    }

    /**
     * Get media types by status with pagination
     */
    @GetMapping("/status/{status}/page")
    public ResponseEntity<Page<MediaType>> getMediaTypesByStatusPage(@PathVariable Integer status, Pageable pageable) {
        Page<MediaType> types = mediaTypeService.findByStatus(status, pageable);
        return ResponseEntity.ok(types);
    }

    /**
     * Get all active media types ordered by name
     */
    @GetMapping("/active/ordered")
    public ResponseEntity<List<MediaType>> getAllActiveOrderByName() {
        List<MediaType> types = mediaTypeService.findAllActiveOrderByName();
        return ResponseEntity.ok(types);
    }

    // MIME type queries
    /**
     * Get media types by MIME type
     */
    @GetMapping("/mime-type/{mimeType}")
    public ResponseEntity<List<MediaType>> getMediaTypesByMimeType(@PathVariable String mimeType) {
        List<MediaType> types = mediaTypeService.findByMimeType(mimeType);
        return ResponseEntity.ok(types);
    }

    /**
     * Get media types by MIME type prefix
     */
    @GetMapping("/mime-type/starts-with/{prefix}")
    public ResponseEntity<List<MediaType>> getMediaTypesByMimeTypePrefix(@PathVariable String prefix) {
        List<MediaType> types = mediaTypeService.findByMimeTypeStartingWith(prefix);
        return ResponseEntity.ok(types);
    }

    // Search queries
    /**
     * Search media types by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<MediaType>> searchMediaTypes(@RequestParam String keyword) {
        List<MediaType> types = mediaTypeService.searchByKeyword(keyword);
        return ResponseEntity.ok(types);
    }

    // Types with media count
    /**
     * Get types with media count
     */
    @GetMapping("/with-media-count")
    public ResponseEntity<List<Object[]>> getTypesWithMediaCount() {
        List<Object[]> results = mediaTypeService.findTypesWithMediaCount();
        return ResponseEntity.ok(results);
    }

    /**
     * Get types ordered by media count
     */
    @GetMapping("/ordered-by-media-count")
    public ResponseEntity<List<MediaType>> getTypesOrderByMediaCount() {
        List<MediaType> types = mediaTypeService.findTypesOrderByMediaCount();
        return ResponseEntity.ok(types);
    }

    /**
     * Get types ordered by media count with pagination
     */
    @GetMapping("/ordered-by-media-count/page")
    public ResponseEntity<Page<MediaType>> getTypesOrderByMediaCountPage(Pageable pageable) {
        Page<MediaType> types = mediaTypeService.findTypesOrderByMediaCount(pageable);
        return ResponseEntity.ok(types);
    }

    /**
     * Get types that have media
     */
    @GetMapping("/with-media")
    public ResponseEntity<List<MediaType>> getTypesWithMedia() {
        List<MediaType> types = mediaTypeService.findTypesWithMedia();
        return ResponseEntity.ok(types);
    }

    // Media type categories
    /**
     * Get image types
     */
    @GetMapping("/categories/image")
    public ResponseEntity<List<MediaType>> getImageTypes() {
        List<MediaType> types = mediaTypeService.findImageTypes();
        return ResponseEntity.ok(types);
    }

    /**
     * Get video types
     */
    @GetMapping("/categories/video")
    public ResponseEntity<List<MediaType>> getVideoTypes() {
        List<MediaType> types = mediaTypeService.findVideoTypes();
        return ResponseEntity.ok(types);
    }

    /**
     * Get audio types
     */
    @GetMapping("/categories/audio")
    public ResponseEntity<List<MediaType>> getAudioTypes() {
        List<MediaType> types = mediaTypeService.findAudioTypes();
        return ResponseEntity.ok(types);
    }

    /**
     * Get document types
     */
    @GetMapping("/categories/document")
    public ResponseEntity<List<MediaType>> getDocumentTypes() {
        List<MediaType> types = mediaTypeService.findDocumentTypes();
        return ResponseEntity.ok(types);
    }

    // File size queries
    /**
     * Get media types by file size range
     */
    @GetMapping("/file-size-range")
    public ResponseEntity<List<MediaType>> getMediaTypesByFileSizeRange(@RequestParam Long minSize, @RequestParam Long maxSize) {
        List<MediaType> types = mediaTypeService.findByFileSizeRange(minSize, maxSize);
        return ResponseEntity.ok(types);
    }

    // Statistical queries
    /**
     * Count active types
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveTypes() {
        Long count = mediaTypeService.countActiveTypes();
        return ResponseEntity.ok(count);
    }

    /**
     * Count media of specific type
     */
    @GetMapping("/count/media/{typeId}")
    public ResponseEntity<Long> countMediaOfType(@PathVariable Integer typeId) {
        Long count = mediaTypeService.countMediaOfType(typeId);
        return ResponseEntity.ok(count);
    }

    // Recent and date-based queries
    /**
     * Get recent types
     */
    @GetMapping("/recent")
    public ResponseEntity<List<MediaType>> getRecentTypes(Pageable pageable) {
        List<MediaType> types = mediaTypeService.findRecentTypes(pageable);
        return ResponseEntity.ok(types);
    }

    /**
     * Get types by date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<MediaType>> getTypesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<MediaType> types = mediaTypeService.findTypesByDateRange(startDate, endDate);
        return ResponseEntity.ok(types);
    }

    /**
     * Get types by total file size
     */
    @GetMapping("/by-total-file-size")
    public ResponseEntity<List<MediaType>> getTypesByTotalFileSize(Pageable pageable) {
        List<MediaType> types = mediaTypeService.findTypesByTotalFileSize(pageable);
        return ResponseEntity.ok(types);
    }

    // Reference type queries
    /**
     * Get types used for reference type
     */
    @GetMapping("/reference-type/{referenceType}")
    public ResponseEntity<List<MediaType>> getTypesUsedForReferenceType(@PathVariable String referenceType) {
        List<MediaType> types = mediaTypeService.findTypesUsedForReferenceType(referenceType);
        return ResponseEntity.ok(types);
    }

    /**
     * Get unused types
     */
    @GetMapping("/unused")
    public ResponseEntity<List<MediaType>> getUnusedTypes() {
        List<MediaType> types = mediaTypeService.findUnusedTypes();
        return ResponseEntity.ok(types);
    }

    // Utility queries
    /**
     * Get all valid extensions
     */
    @GetMapping("/valid-extensions")
    public ResponseEntity<List<String>> getAllValidExtensions() {
        List<String> extensions = mediaTypeService.findAllValidExtensions();
        return ResponseEntity.ok(extensions);
    }

    /**
     * Get all valid MIME types
     */
    @GetMapping("/valid-mime-types")
    public ResponseEntity<List<String>> getAllValidMimeTypes() {
        List<String> mimeTypes = mediaTypeService.findAllValidMimeTypes();
        return ResponseEntity.ok(mimeTypes);
    }
}
