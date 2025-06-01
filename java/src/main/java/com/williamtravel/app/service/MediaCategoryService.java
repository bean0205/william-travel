package com.williamtravel.app.service;

import com.williamtravel.app.entity.MediaCategory;
import com.williamtravel.app.repository.MediaCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for MediaCategory entity operations
 */
@Service
@Transactional
public class MediaCategoryService {

    @Autowired
    private MediaCategoryRepository mediaCategoryRepository;

    /**
     * Find all media categories
     */
    public List<MediaCategory> findAll() {
        return mediaCategoryRepository.findAll();
    }

    /**
     * Find media category by ID
     */
    public Optional<MediaCategory> findById(Integer id) {
        return mediaCategoryRepository.findById(id);
    }

    /**
     * Save media category
     */
    public MediaCategory save(MediaCategory mediaCategory) {
        return mediaCategoryRepository.save(mediaCategory);
    }

    /**
     * Delete media category by ID
     */
    public void deleteById(Integer id) {
        mediaCategoryRepository.deleteById(id);
    }

    /**
     * Find media category by name
     */
    public Optional<MediaCategory> findByName(String name) {
        return mediaCategoryRepository.findByName(name);
    }

    /**
     * Check if media category exists by name
     */
    public boolean existsByName(String name) {
        return mediaCategoryRepository.existsByName(name);
    }

    /**
     * Find media categories by status
     */
    public List<MediaCategory> findByStatus(Integer status) {
        return mediaCategoryRepository.findByStatus(status);
    }

    /**
     * Find media categories by status with pagination
     */
    public Page<MediaCategory> findByStatus(Integer status, Pageable pageable) {
        return mediaCategoryRepository.findByStatus(status, pageable);
    }

    /**
     * Find all active media categories ordered by name
     */
    public List<MediaCategory> findAllActiveOrderByName() {
        return mediaCategoryRepository.findAllActiveOrderByName();
    }

    /**
     * Search media categories by keyword
     */
    public List<MediaCategory> searchByKeyword(String keyword) {
        return mediaCategoryRepository.searchByKeyword(keyword);
    }

    /**
     * Search media categories by keyword with pagination
     */
    public Page<MediaCategory> searchByKeyword(String keyword, Pageable pageable) {
        return mediaCategoryRepository.searchByKeyword(keyword, pageable);
    }

    /**
     * Find media categories with media count
     */
    public List<Object[]> findCategoriesWithMediaCount() {
        return mediaCategoryRepository.findCategoriesWithMediaCount();
    }

    /**
     * Find media categories ordered by media count
     */
    public List<MediaCategory> findCategoriesOrderByMediaCount() {
        return mediaCategoryRepository.findCategoriesOrderByMediaCount();
    }

    /**
     * Find media categories ordered by media count with pagination
     */
    public Page<MediaCategory> findCategoriesOrderByMediaCount(Pageable pageable) {
        return mediaCategoryRepository.findCategoriesOrderByMediaCount(pageable);
    }

    /**
     * Find media categories with media
     */
    public List<MediaCategory> findCategoriesWithMedia() {
        return mediaCategoryRepository.findCategoriesWithMedia();
    }

    /**
     * Find categories usage by reference type
     */
    public List<Object[]> findCategoriesUsageByReferenceType(String referenceType) {
        return mediaCategoryRepository.findCategoriesUsageByReferenceType(referenceType);
    }

    /**
     * Count active media categories
     */
    public Long countActiveCategories() {
        return mediaCategoryRepository.countActiveCategories();
    }

    /**
     * Count media in specific category
     */
    public Long countMediaInCategory(Integer categoryId) {
        return mediaCategoryRepository.countMediaInCategory(categoryId);
    }

    /**
     * Find recent media categories
     */
    public List<MediaCategory> findRecentCategories(Pageable pageable) {
        return mediaCategoryRepository.findRecentCategories(pageable);
    }

    /**
     * Find media categories by date range
     */
    public List<MediaCategory> findCategoriesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return mediaCategoryRepository.findCategoriesByDateRange(startDate, endDate);
    }

    /**
     * Find media categories by total file size
     */
    public List<MediaCategory> findCategoriesByTotalFileSize(Pageable pageable) {
        return mediaCategoryRepository.findCategoriesByTotalFileSize(pageable);
    }

    /**
     * Find media categories with specific media type
     */
    public List<MediaCategory> findCategoriesWithMediaType(Integer mediaTypeId) {
        return mediaCategoryRepository.findCategoriesWithMediaType(mediaTypeId);
    }

    /**
     * Find media categories used for specific reference type
     */
    public List<MediaCategory> findCategoriesUsedForReferenceType(String referenceType) {
        return mediaCategoryRepository.findCategoriesUsedForReferenceType(referenceType);
    }

    /**
     * Find empty media categories (no media)
     */
    public List<MediaCategory> findEmptyCategories() {
        return mediaCategoryRepository.findEmptyCategories();
    }

    /**
     * Count total media categories
     */
    public long count() {
        return mediaCategoryRepository.count();
    }

    /**
     * Check if media category exists by ID
     */
    public boolean existsById(Integer id) {
        return mediaCategoryRepository.existsById(id);
    }
}
