package com.williamtravel.app.service;

import com.williamtravel.app.entity.ArticleTag;
import com.williamtravel.app.repository.ArticleTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for ArticleTag entity operations
 */
@Service
@Transactional
public class ArticleTagService {

    @Autowired
    private ArticleTagRepository articleTagRepository;

    /**
     * Find all article tags
     */
    public List<ArticleTag> findAll() {
        return articleTagRepository.findAll();
    }

    /**
     * Find article tag by ID
     */
    public Optional<ArticleTag> findById(Integer id) {
        return articleTagRepository.findById(id);
    }

    /**
     * Save article tag
     */
    public ArticleTag save(ArticleTag articleTag) {
        return articleTagRepository.save(articleTag);
    }

    /**
     * Delete article tag by ID
     */
    public void deleteById(Integer id) {
        articleTagRepository.deleteById(id);
    }

    /**
     * Find article tag by name
     */
    public Optional<ArticleTag> findByName(String name) {
        return articleTagRepository.findByName(name);
    }

    /**
     * Find article tag by slug
     */
    public Optional<ArticleTag> findBySlug(String slug) {
        return articleTagRepository.findBySlug(slug);
    }

    /**
     * Check if article tag exists by name
     */
    public boolean existsByName(String name) {
        return articleTagRepository.existsByName(name);
    }

    /**
     * Check if article tag exists by slug
     */
    public boolean existsBySlug(String slug) {
        return articleTagRepository.existsBySlug(slug);
    }

    /**
     * Find article tags by status
     */
    public List<ArticleTag> findByStatus(Boolean status) {
        return articleTagRepository.findByStatus(status);
    }

    /**
     * Find article tags by status with pagination
     */
    public Page<ArticleTag> findByStatus(Boolean status, Pageable pageable) {
        return articleTagRepository.findByStatus(status, pageable);
    }

    /**
     * Find all active article tags ordered by name
     */
    public List<ArticleTag> findAllActiveOrderByName() {
        return articleTagRepository.findAllActiveOrderByName();
    }

    /**
     * Search article tags by keyword
     */
    public List<ArticleTag> searchByKeyword(String keyword) {
        return articleTagRepository.searchByKeyword(keyword);
    }

    /**
     * Search article tags by keyword with pagination
     */
    public Page<ArticleTag> searchByKeyword(String keyword, Pageable pageable) {
        return articleTagRepository.searchByKeyword(keyword, pageable);
    }

    /**
     * Find article tags with article count
     */
    public List<Object[]> findTagsWithArticleCount() {
        return articleTagRepository.findTagsWithArticleCount();
    }

    /**
     * Find article tags ordered by article count
     */
    public List<ArticleTag> findTagsOrderByArticleCount() {
        return articleTagRepository.findTagsOrderByArticleCount();
    }

    /**
     * Find article tags ordered by article count with pagination
     */
    public Page<ArticleTag> findTagsOrderByArticleCount(Pageable pageable) {
        return articleTagRepository.findTagsOrderByArticleCount(pageable);
    }

    /**
     * Find article tags with published articles
     */
    public List<ArticleTag> findTagsWithPublishedArticles() {
        return articleTagRepository.findTagsWithPublishedArticles();
    }

    /**
     * Find popular article tags
     */
    public List<ArticleTag> findPopularTags(Pageable pageable) {
        return articleTagRepository.findPopularTags(pageable);
    }

    /**
     * Find tag cloud data
     */
    public List<Object[]> findTagCloudData() {
        return articleTagRepository.findTagCloudData();
    }

    /**
     * Find related article tags
     */
    public List<ArticleTag> findRelatedTags(Integer tagId) {
        return articleTagRepository.findRelatedTags(tagId);
    }

    /**
     * Count active article tags
     */
    public Long countActiveTags() {
        return articleTagRepository.countActiveTags();
    }

    /**
     * Count published articles with specific tag
     */
    public Long countPublishedArticlesWithTag(Integer tagId) {
        return articleTagRepository.countPublishedArticlesWithTag(tagId);
    }

    /**
     * Find recent article tags
     */
    public List<ArticleTag> findRecentTags(Pageable pageable) {
        return articleTagRepository.findRecentTags(pageable);
    }

    /**
     * Find article tags starting with specific letter
     */
    public List<ArticleTag> findTagsStartingWith(String letter) {
        return articleTagRepository.findTagsStartingWith(letter);
    }

    /**
     * Find trending article tags since date
     */
    public List<ArticleTag> findTrendingTags(LocalDateTime since, Pageable pageable) {
        return articleTagRepository.findTrendingTags(since, pageable);
    }

    /**
     * Count total article tags
     */
    public long count() {
        return articleTagRepository.count();
    }

    /**
     * Check if article tag exists by ID
     */
    public boolean existsById(Integer id) {
        return articleTagRepository.existsById(id);
    }
}
