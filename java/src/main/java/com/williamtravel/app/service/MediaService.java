package com.williamtravel.app.service;

import com.williamtravel.app.entity.Media;
import com.williamtravel.app.repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Media entity operations
 */
@Service
@Transactional
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    /**
     * Find all media
     */
    public List<Media> findAll() {
        return mediaRepository.findAll();
    }

    /**
     * Find media by ID
     */
    public Optional<Media> findById(Integer id) {
        return mediaRepository.findById(id);
    }

    /**
     * Save media
     */
    public Media save(Media media) {
        return mediaRepository.save(media);
    }

    /**
     * Delete media by ID
     */
    public void deleteById(Integer id) {
        mediaRepository.deleteById(id);
    }

    /**
     * Count total media
     */
    public long count() {
        return mediaRepository.count();
    }

    /**
     * Check if media exists by ID
     */
    public boolean existsById(Integer id) {
        return mediaRepository.existsById(id);
    }

    /**
     * Find media with pagination
     */
    public Page<Media> findAll(Pageable pageable) {
        return mediaRepository.findAll(pageable);
    }

    // Find by reference (entity this media belongs to)
    /**
     * Find media by reference
     */
    public List<Media> findByReference(Integer referenceId, String referenceType) {
        return mediaRepository.findByReference(referenceId, referenceType);
    }

    /**
     * Find media by reference with pagination
     */
    public Page<Media> findByReference(Integer referenceId, String referenceType, Pageable pageable) {
        return mediaRepository.findByReference(referenceId, referenceType, pageable);
    }

    // Find by reference type
    /**
     * Find media by reference type
     */
    public List<Media> findByReferenceType(String referenceType) {
        return mediaRepository.findByReferenceType(referenceType);
    }

    /**
     * Find media by reference type with pagination
     */
    public Page<Media> findByReferenceType(String referenceType, Pageable pageable) {
        return mediaRepository.findByReferenceType(referenceType, pageable);
    }

    // Find by media type
    /**
     * Find media by type ID
     */
    public List<Media> findByTypeId(Integer typeId) {
        return mediaRepository.findByTypeId(typeId);
    }

    /**
     * Find media by type ID with pagination
     */
    public Page<Media> findByTypeId(Integer typeId, Pageable pageable) {
        return mediaRepository.findByTypeId(typeId, pageable);
    }

    // Find by media category
    /**
     * Find media by category ID
     */
    public List<Media> findByCategoryId(Integer categoryId) {
        return mediaRepository.findByCategoryId(categoryId);
    }

    /**
     * Find media by category ID with pagination
     */
    public Page<Media> findByCategoryId(Integer categoryId, Pageable pageable) {
        return mediaRepository.findByCategoryId(categoryId, pageable);
    }

    // Find by file path
    /**
     * Find media by file path
     */
    public Optional<Media> findByFilePath(String filePath) {
        return mediaRepository.findByFilePath(filePath);
    }

    /**
     * Check if media exists by file path
     */
    public boolean existsByFilePath(String filePath) {
        return mediaRepository.existsByFilePath(filePath);
    }

    // Find by original filename
    /**
     * Find media by original filename containing
     */
    public List<Media> findByOriginalFileNameContaining(String filename) {
        return mediaRepository.findByOriginalFileNameContaining(filename);
    }

    // Find by alt text
    /**
     * Find media by alt text containing
     */
    public List<Media> findByAltTextContaining(String altText) {
        return mediaRepository.findByAltTextContaining(altText);
    }

    // Find main/featured media for entities
    /**
     * Find main media by reference
     */
    public Optional<Media> findMainMediaByReference(Integer referenceId, String referenceType) {
        return mediaRepository.findMainMediaByReference(referenceId, referenceType);
    }

    /**
     * Find all main media
     */
    public List<Media> findAllMainMedia() {
        return mediaRepository.findAllMainMedia();
    }

    // Find by file size range
    /**
     * Find media by file size range
     */
    public List<Media> findByFileSizeRange(Long minSize, Long maxSize) {
        return mediaRepository.findByFileSizeRange(minSize, maxSize);
    }

    // Find by upload date range
    /**
     * Find media by upload date range
     */
    public List<Media> findByUploadDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        return mediaRepository.findByUploadDateRange(startDate, endDate);
    }

    /**
     * Find media by upload date range with pagination
     */
    public Page<Media> findByUploadDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate, Pageable pageable) {
        return mediaRepository.findByUploadDateRange(startDate, endDate, pageable);
    }

    // Recent uploads
    /**
     * Find recent uploads
     */
    public List<Media> findRecentUploads(Pageable pageable) {
        return mediaRepository.findRecentUploads(pageable);
    }

    // Find by dimensions (for images)
    /**
     * Find media by dimensions
     */
    public List<Media> findByDimensions(Integer width, Integer height) {
        return mediaRepository.findByDimensions(width, height);
    }

    /**
     * Find media by minimum dimensions
     */
    public List<Media> findByMinDimensions(Integer minWidth, Integer minHeight) {
        return mediaRepository.findByMinDimensions(minWidth, minHeight);
    }

    // Statistical queries
    /**
     * Count media by reference
     */
    public Long countMediaByReference(Integer referenceId, String referenceType) {
        return mediaRepository.countMediaByReference(referenceId, referenceType);
    }

    /**
     * Count media by type
     */
    public Long countMediaByType(String referenceType) {
        return mediaRepository.countMediaByType(referenceType);
    }

    /**
     * Count media by media type
     */
    public Long countMediaByMediaType(Integer typeId) {
        return mediaRepository.countMediaByMediaType(typeId);
    }

    /**
     * Count media by category
     */
    public Long countMediaByCategory(Integer categoryId) {
        return mediaRepository.countMediaByCategory(categoryId);
    }

    /**
     * Get total file size by reference
     */
    public Long getTotalFileSizeByReference(Integer referenceId, String referenceType) {
        return mediaRepository.getTotalFileSizeByReference(referenceId, referenceType);
    }

    /**
     * Get total file size
     */
    public Long getTotalFileSize() {
        return mediaRepository.getTotalFileSize();
    }

    // Find media by type and reference combination
    /**
     * Find media by reference and type
     */
    public List<Media> findByReferenceAndType(Integer referenceId, String referenceType, Integer typeId) {
        return mediaRepository.findByReferenceAndType(referenceId, referenceType, typeId);
    }

    // Find media by category and reference combination
    /**
     * Find media by reference and category
     */
    public List<Media> findByReferenceAndCategory(Integer referenceId, String referenceType, Integer categoryId) {
        return mediaRepository.findByReferenceAndCategory(referenceId, referenceType, categoryId);
    }

    // Most used media types
    /**
     * Find most used media types
     */
    public List<Object[]> findMostUsedMediaTypes() {
        return mediaRepository.findMostUsedMediaTypes();
    }

    // Most used media categories
    /**
     * Find most used media categories
     */
    public List<Object[]> findMostUsedMediaCategories() {
        return mediaRepository.findMostUsedMediaCategories();
    }

    // Entities with most media
    /**
     * Find entities with most media
     */
    public List<Object[]> findEntitiesWithMostMedia(Pageable pageable) {
        return mediaRepository.findEntitiesWithMostMedia(pageable);
    }

    // Search media by filename and alt text
    /**
     * Search media
     */
    public List<Media> searchMedia(String keyword) {
        return mediaRepository.searchMedia(keyword);
    }

    /**
     * Search media with pagination
     */
    public Page<Media> searchMedia(String keyword, Pageable pageable) {
        return mediaRepository.searchMedia(keyword, pageable);
    }

    // Find orphaned media
    /**
     * Find orphaned media
     */
    public List<Media> findOrphanedMedia() {
        return mediaRepository.findOrphanedMedia();
    }
}
