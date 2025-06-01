package com.williamtravel.app.service;

import com.williamtravel.app.entity.Article;
import com.williamtravel.app.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Article entity operations
 */
@Service
@Transactional
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    /**
     * Find all articles
     */
    public List<Article> findAll() {
        return articleRepository.findAll();
    }

    /**
     * Find article by ID
     */
    public Optional<Article> findById(Integer id) {
        return articleRepository.findById(id);
    }

    /**
     * Save article
     */
    public Article save(Article article) {
        return articleRepository.save(article);
    }

    /**
     * Delete article by ID
     */
    public void deleteById(Integer id) {
        articleRepository.deleteById(id);
    }

    /**
     * Find article by slug
     */
    public Optional<Article> findBySlug(String slug) {
        return articleRepository.findBySlug(slug);
    }

    /**
     * Check if article exists by slug
     */
    public boolean existsBySlug(String slug) {
        return articleRepository.existsBySlug(slug);
    }

    /**
     * Check if article exists by title
     */
    public boolean existsByTitle(String title) {
        return articleRepository.existsByTitle(title);
    }

    /**
     * Find articles by author ID
     */
    public List<Article> findByAuthorId(Integer authorId) {
        return articleRepository.findByAuthorId(authorId);
    }

    /**
     * Find articles by author ID with pagination
     */
    public Page<Article> findByAuthorId(Integer authorId, Pageable pageable) {
        return articleRepository.findByAuthorId(authorId, pageable);
    }

    /**
     * Find articles by author ID and status
     */
    public Page<Article> findByAuthorIdAndStatus(Integer authorId, String status, Pageable pageable) {
        return articleRepository.findByAuthorIdAndStatus(authorId, status, pageable);
    }

    /**
     * Find articles by status
     */
    public List<Article> findByStatus(String status) {
        return articleRepository.findByStatus(status);
    }

    /**
     * Find articles by status with pagination
     */
    public Page<Article> findByStatus(String status, Pageable pageable) {
        return articleRepository.findByStatus(status, pageable);
    }

    /**
     * Find published articles
     */
    public List<Article> findPublishedArticles() {
        return articleRepository.findPublishedArticles();
    }

    /**
     * Find published articles with pagination
     */
    public Page<Article> findPublishedArticles(Pageable pageable) {
        return articleRepository.findPublishedArticles(pageable);
    }

    /**
     * Count total articles
     */
    public long count() {
        return articleRepository.count();
    }

    /**
     * Check if article exists by ID
     */
    public boolean existsById(Integer id) {
        return articleRepository.existsById(id);
    }

    /**
     * Find articles with pagination
     */
    public Page<Article> findAll(Pageable pageable) {
        return articleRepository.findAll(pageable);
    }

    // Featured articles
    /**
     * Find featured articles
     */
    public List<Article> findFeaturedArticles() {
        return articleRepository.findFeaturedArticles();
    }

    /**
     * Find featured articles with pagination
     */
    public Page<Article> findFeaturedArticles(Pageable pageable) {
        return articleRepository.findFeaturedArticles(pageable);
    }

    // Search queries
    /**
     * Search articles by keyword
     */
    public List<Article> searchByKeyword(String keyword) {
        return articleRepository.searchByKeyword(keyword);
    }

    /**
     * Search articles by keyword with pagination
     */
    public Page<Article> searchByKeyword(String keyword, Pageable pageable) {
        return articleRepository.searchByKeyword(keyword, pageable);
    }

    // Category-based queries
    /**
     * Find articles by category ID
     */
    public List<Article> findByCategoryId(Integer categoryId) {
        return articleRepository.findByCategoryId(categoryId);
    }

    /**
     * Find articles by category ID with pagination
     */
    public Page<Article> findByCategoryId(Integer categoryId, Pageable pageable) {
        return articleRepository.findByCategoryId(categoryId, pageable);
    }

    // Tag-based queries
    /**
     * Find articles by tag ID
     */
    public List<Article> findByTagId(Integer tagId) {
        return articleRepository.findByTagId(tagId);
    }

    /**
     * Find articles by tag ID with pagination
     */
    public Page<Article> findByTagId(Integer tagId, Pageable pageable) {
        return articleRepository.findByTagId(tagId, pageable);
    }

    // Popular articles (by view count)
    /**
     * Find popular articles
     */
    public List<Article> findPopularArticles(Pageable pageable) {
        return articleRepository.findPopularArticles(pageable);
    }

    /**
     * Find popular articles since a specific date
     */
    public List<Article> findPopularArticlesSince(LocalDateTime since, Pageable pageable) {
        return articleRepository.findPopularArticlesSince(since, pageable);
    }

    // Recent articles
    /**
     * Find recent articles
     */
    public List<Article> findRecentArticles(Pageable pageable) {
        return articleRepository.findRecentArticles(pageable);
    }

    // Articles by date range
    /**
     * Find articles by date range
     */
    public List<Article> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return articleRepository.findByDateRange(startDate, endDate);
    }

    /**
     * Find articles by date range with pagination
     */
    public Page<Article> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return articleRepository.findByDateRange(startDate, endDate, pageable);
    }

    // Related articles
    /**
     * Find related articles by shared categories
     */
    public List<Article> findRelatedArticles(Integer articleId, Pageable pageable) {
        return articleRepository.findRelatedArticles(articleId, pageable);
    }

    // Update view count
    /**
     * Increment view count for article
     */
    public void incrementViewCount(Integer id) {
        articleRepository.incrementViewCount(id);
    }

    // Statistical queries
    /**
     * Count published articles
     */
    public Long countPublishedArticles() {
        return articleRepository.countPublishedArticles();
    }

    /**
     * Count published articles by author
     */
    public Long countPublishedArticlesByAuthor(Integer authorId) {
        return articleRepository.countPublishedArticlesByAuthor(authorId);
    }

    /**
     * Count articles by status
     */
    public Long countByStatus(String status) {
        return articleRepository.countByStatus(status);
    }

    // Complex search with filters
    /**
     * Find articles with multiple filters
     */
    public Page<Article> findWithFilters(String keyword, Integer authorId, Integer categoryId, Boolean featured, Pageable pageable) {
        return articleRepository.findWithFilters(keyword, authorId, categoryId, featured, pageable);
    }
}
