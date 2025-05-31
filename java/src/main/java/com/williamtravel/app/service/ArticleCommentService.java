package com.williamtravel.app.service;

import com.williamtravel.app.entity.ArticleComment;
import com.williamtravel.app.repository.ArticleCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for ArticleComment entity operations
 */
@Service
@Transactional
public class ArticleCommentService {

    @Autowired
    private ArticleCommentRepository articleCommentRepository;

    /**
     * Find all article comments
     */
    public List<ArticleComment> findAll() {
        return articleCommentRepository.findAll();
    }

    /**
     * Find article comment by ID
     */
    public Optional<ArticleComment> findById(Integer id) {
        return articleCommentRepository.findById(id);
    }

    /**
     * Save article comment
     */
    public ArticleComment save(ArticleComment articleComment) {
        return articleCommentRepository.save(articleComment);
    }

    /**
     * Delete article comment by ID
     */
    public void deleteById(Integer id) {
        articleCommentRepository.deleteById(id);
    }

    /**
     * Find comments by article ID
     */
    public List<ArticleComment> findByArticleId(Integer articleId) {
        return articleCommentRepository.findByArticleId(articleId);
    }

    /**
     * Find comments by article ID with pagination
     */
    public Page<ArticleComment> findByArticleId(Integer articleId, Pageable pageable) {
        return articleCommentRepository.findByArticleId(articleId, pageable);
    }

    /**
     * Find comments by article ID and status
     */
    public List<ArticleComment> findByArticleIdAndStatus(Integer articleId, Boolean status) {
        return articleCommentRepository.findByArticleIdAndStatus(articleId, status);
    }

    /**
     * Find comments by article ID and status with pagination
     */
    public Page<ArticleComment> findByArticleIdAndStatus(Integer articleId, Boolean status, Pageable pageable) {
        return articleCommentRepository.findByArticleIdAndStatus(articleId, status, pageable);
    }

    /**
     * Find comments by user ID
     */
    public List<ArticleComment> findByUserId(Integer userId) {
        return articleCommentRepository.findByUserId(userId);
    }

    /**
     * Find comments by user ID with pagination
     */
    public Page<ArticleComment> findByUserId(Integer userId, Pageable pageable) {
        return articleCommentRepository.findByUserId(userId, pageable);
    }

    /**
     * Find comments by user ID and status with pagination
     */
    public Page<ArticleComment> findByUserIdAndStatus(Integer userId, Boolean status, Pageable pageable) {
        return articleCommentRepository.findByUserIdAndStatus(userId, status, pageable);
    }

    /**
     * Find comments by status
     */
    public List<ArticleComment> findByStatus(Boolean status) {
        return articleCommentRepository.findByStatus(status);
    }

    /**
     * Find comments by status with pagination
     */
    public Page<ArticleComment> findByStatus(Boolean status, Pageable pageable) {
        return articleCommentRepository.findByStatus(status, pageable);
    }

    /**
     * Find recent comments
     */
    public List<ArticleComment> findRecentComments(Pageable pageable) {
        return articleCommentRepository.findRecentComments(pageable);
    }

    /**
     * Find comments by date range
     */
    public List<ArticleComment> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return articleCommentRepository.findByDateRange(startDate, endDate);
    }

    /**
     * Find comments by date range with pagination
     */
    public Page<ArticleComment> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return articleCommentRepository.findByDateRange(startDate, endDate, pageable);
    }

    /**
     * Search comments by content
     */
    public List<ArticleComment> searchByContent(String keyword) {
        return articleCommentRepository.searchByContent(keyword);
    }

    /**
     * Search comments by content with pagination
     */
    public Page<ArticleComment> searchByContent(String keyword, Pageable pageable) {
        return articleCommentRepository.searchByContent(keyword, pageable);
    }

    /**
     * Count active comments by article
     */
    public Long countActiveCommentsByArticle(Integer articleId) {
        return articleCommentRepository.countActiveCommentsByArticle(articleId);
    }

    /**
     * Count active comments by user
     */
    public Long countActiveCommentsByUser(Integer userId) {
        return articleCommentRepository.countActiveCommentsByUser(userId);
    }

    /**
     * Count all active comments
     */
    public Long countAllActiveComments() {
        return articleCommentRepository.countAllActiveComments();
    }

    /**
     * Find most commented articles
     */
    public List<Object[]> findMostCommentedArticles(Pageable pageable) {
        return articleCommentRepository.findMostCommentedArticles(pageable);
    }

    /**
     * Find most active commenters
     */
    public List<Object[]> findMostActiveCommenters(Pageable pageable) {
        return articleCommentRepository.findMostActiveCommenters(pageable);
    }

    /**
     * Find pending comments
     */
    public List<ArticleComment> findPendingComments() {
        return articleCommentRepository.findPendingComments();
    }

    /**
     * Find pending comments with pagination
     */
    public Page<ArticleComment> findPendingComments(Pageable pageable) {
        return articleCommentRepository.findPendingComments(pageable);
    }

    /**
     * Find recent comments on published articles
     */
    public List<ArticleComment> findRecentCommentsOnPublishedArticles(Pageable pageable) {
        return articleCommentRepository.findRecentCommentsOnPublishedArticles(pageable);
    }

    /**
     * Count total article comments
     */
    public long count() {
        return articleCommentRepository.count();
    }

    /**
     * Check if article comment exists by ID
     */
    public boolean existsById(Integer id) {
        return articleCommentRepository.existsById(id);
    }
}
