package com.williamtravel.app.service;

import com.williamtravel.app.entity.MediaType;
import com.williamtravel.app.repository.MediaTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for MediaType entity operations
 */
@Service
@Transactional
public class MediaTypeService {

    @Autowired
    private MediaTypeRepository mediaTypeRepository;

    /**
     * Find all media types
     */
    public List<MediaType> findAll() {
        return mediaTypeRepository.findAll();
    }

    /**
     * Find media type by ID
     */
    public Optional<MediaType> findById(Integer id) {
        return mediaTypeRepository.findById(id);
    }

    /**
     * Save media type
     */
    public MediaType save(MediaType mediaType) {
        return mediaTypeRepository.save(mediaType);
    }

    /**
     * Delete media type by ID
     */
    public void deleteById(Integer id) {
        mediaTypeRepository.deleteById(id);
    }

    /**
     * Count total media types
     */
    public long count() {
        return mediaTypeRepository.count();
    }

    /**
     * Check if media type exists by ID
     */
    public boolean existsById(Integer id) {
        return mediaTypeRepository.existsById(id);
    }

    /**
     * Find all media types with pagination
     */
    public Page<MediaType> findAll(Pageable pageable) {
        return mediaTypeRepository.findAll(pageable);
    }

    // Basic finder methods
    public Optional<MediaType> findByName(String name) {
        return mediaTypeRepository.findByName(name);
    }

    public Optional<MediaType> findByExtension(String extension) {
        return mediaTypeRepository.findByExtension(extension);
    }

    public boolean existsByName(String name) {
        return mediaTypeRepository.existsByName(name);
    }

    public boolean existsByExtension(String extension) {
        return mediaTypeRepository.existsByExtension(extension);
    }

    // Status-based queries
    public List<MediaType> findByStatus(Integer status) {
        return mediaTypeRepository.findByStatus(status);
    }

    public Page<MediaType> findByStatus(Integer status, Pageable pageable) {
        return mediaTypeRepository.findByStatus(status, pageable);
    }

    public List<MediaType> findAllActiveOrderByName() {
        return mediaTypeRepository.findAllActiveOrderByName();
    }

    // MIME type queries
    public List<MediaType> findByMimeType(String mimeType) {
        return mediaTypeRepository.findByMimeType(mimeType);
    }

    public List<MediaType> findByMimeTypeStartingWith(String mimeTypePrefix) {
        return mediaTypeRepository.findByMimeTypeStartingWith(mimeTypePrefix);
    }

    // Search queries
    public List<MediaType> searchByKeyword(String keyword) {
        return mediaTypeRepository.searchByKeyword(keyword);
    }

    // Types with media count
    public List<Object[]> findTypesWithMediaCount() {
        return mediaTypeRepository.findTypesWithMediaCount();
    }

    public List<MediaType> findTypesOrderByMediaCount() {
        return mediaTypeRepository.findTypesOrderByMediaCount();
    }

    public Page<MediaType> findTypesOrderByMediaCount(Pageable pageable) {
        return mediaTypeRepository.findTypesOrderByMediaCount(pageable);
    }

    public List<MediaType> findTypesWithMedia() {
        return mediaTypeRepository.findTypesWithMedia();
    }

    // Media type categories
    public List<MediaType> findImageTypes() {
        return mediaTypeRepository.findImageTypes();
    }

    public List<MediaType> findVideoTypes() {
        return mediaTypeRepository.findVideoTypes();
    }

    public List<MediaType> findAudioTypes() {
        return mediaTypeRepository.findAudioTypes();
    }

    public List<MediaType> findDocumentTypes() {
        return mediaTypeRepository.findDocumentTypes();
    }

    // File size queries
    public List<MediaType> findByFileSizeRange(Long minSize, Long maxSize) {
        return mediaTypeRepository.findByFileSizeRange(minSize, maxSize);
    }

    // Statistical queries
    public Long countActiveTypes() {
        return mediaTypeRepository.countActiveTypes();
    }

    public Long countMediaOfType(Integer typeId) {
        return mediaTypeRepository.countMediaOfType(typeId);
    }

    // Recent and date-based queries
    public List<MediaType> findRecentTypes(Pageable pageable) {
        return mediaTypeRepository.findRecentTypes(pageable);
    }

    public List<MediaType> findTypesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return mediaTypeRepository.findTypesByDateRange(startDate.toLocalDate(), endDate.toLocalDate());
    }

    public List<MediaType> findTypesByTotalFileSize(Pageable pageable) {
        return mediaTypeRepository.findTypesByTotalFileSize(pageable);
    }

    // Reference type queries
    public List<MediaType> findTypesUsedForReferenceType(String referenceType) {
        return mediaTypeRepository.findTypesUsedForReferenceType(referenceType);
    }

    public List<MediaType> findUnusedTypes() {
        return mediaTypeRepository.findUnusedTypes();
    }

    // Utility queries
    public List<String> findAllValidExtensions() {
        return mediaTypeRepository.findAllValidExtensions();
    }

    public List<String> findAllValidMimeTypes() {
        return mediaTypeRepository.findAllValidMimeTypes();
    }
}
