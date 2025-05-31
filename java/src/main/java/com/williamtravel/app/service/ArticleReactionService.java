package com.williamtravel.app.service;

import com.williamtravel.app.entity.ArticleReaction;
import com.williamtravel.app.repository.ArticleReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for ArticleReaction entity operations
 */
@Service
@Transactional
public class ArticleReactionService {

    @Autowired
    private ArticleReactionRepository articleReactionRepository;

    /**
     * Find all article reactions
     */
    public List<ArticleReaction> findAll() {
        return articleReactionRepository.findAll();
    }

    /**
     * Find article reaction by ID
     */
    public Optional<ArticleReaction> findById(Integer id) {
        return articleReactionRepository.findById(id);
    }

    /**
     * Save article reaction
     */
    public ArticleReaction save(ArticleReaction articleReaction) {
        return articleReactionRepository.save(articleReaction);
    }

    /**
     * Delete article reaction by ID
     */
    public void deleteById(Integer id) {
        articleReactionRepository.deleteById(id);
    }

    /**
     * Find reactions by article ID
     */
    public List<ArticleReaction> findByArticleId(Integer articleId) {
        return articleReactionRepository.findByArticleId(articleId);
    }

    /**
     * Find reactions by article ID with pagination
     */
    public Page<ArticleReaction> findByArticleId(Integer articleId, Pageable pageable) {
        return articleReactionRepository.findByArticleId(articleId, pageable);
    }

    /**
     * Find reactions by article ID and status
     */
    public List<ArticleReaction> findByArticleIdAndStatus(Integer articleId, Boolean status) {
        return articleReactionRepository.findByArticleIdAndStatus(articleId, status);
    }

    /**
     * Find reactions by user ID
     */
    public List<ArticleReaction> findByUserId(Integer userId) {
        return articleReactionRepository.findByUserId(userId);
    }

    /**
     * Find reactions by user ID with pagination
     */
    public Page<ArticleReaction> findByUserId(Integer userId, Pageable pageable) {
        return articleReactionRepository.findByUserId(userId, pageable);
    }

    /**
     * Find reactions by user ID and status with pagination
     */
    public Page<ArticleReaction> findByUserIdAndStatus(Integer userId, Boolean status, Pageable pageable) {
        return articleReactionRepository.findByUserIdAndStatus(userId, status, pageable);
    }

    /**
     * Find specific user reaction to article
     */
    public Optional<ArticleReaction> findByUserIdAndArticleId(Integer userId, Integer articleId) {
        return articleReactionRepository.findByUserIdAndArticleId(userId, articleId);
    }

    /**
     * Check if user has reacted to article
     */
    public boolean existsByUserIdAndArticleId(Integer userId, Integer articleId) {
        return articleReactionRepository.existsByUserIdAndArticleId(userId, articleId);
    }

    /**
     * Check if user has active reaction to article
     */
    public boolean existsActiveReactionByUserAndArticle(Integer userId, Integer articleId) {
        return articleReactionRepository.existsActiveReactionByUserAndArticle(userId, articleId);
    }

    /**
     * Find reactions by status
     */
    public List<ArticleReaction> findByStatus(Boolean status) {
        return articleReactionRepository.findByStatus(status);
    }

    /**
     * Find reactions by status with pagination
     */
    public Page<ArticleReaction> findByStatus(Boolean status, Pageable pageable) {
        return articleReactionRepository.findByStatus(status, pageable);
    }

    /**
     * Find recent reactions
     */
    public List<ArticleReaction> findRecentReactions(Pageable pageable) {
        return articleReactionRepository.findRecentReactions(pageable);
    }

    /**
     * Find reactions by date range
     */
    public List<ArticleReaction> findByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return articleReactionRepository.findByDateRange(startDate, endDate);
    }

    /**
     * Count active reactions by article
     */
    public Long countActiveReactionsByArticle(Integer articleId) {
        return articleReactionRepository.countActiveReactionsByArticle(articleId);
    }

    /**
     * Count active reactions by user
     */
    public Long countActiveReactionsByUser(Integer userId) {
        return articleReactionRepository.countActiveReactionsByUser(userId);
    }

    /**
     * Count all active reactions
     */
    public Long countAllActiveReactions() {
        return articleReactionRepository.countAllActiveReactions();
    }

    /**
     * Find most liked articles
     */
    public List<Object[]> findMostLikedArticles(Pageable pageable) {
        return articleReactionRepository.findMostLikedArticles(pageable);
    }

    /**
     * Find most active reactors
     */
    public List<Object[]> findMostActiveReactors(Pageable pageable) {
        return articleReactionRepository.findMostActiveReactors(pageable);
    }

    /**
     * Update reaction status (toggle like/unlike)
     */
    public int updateReactionStatus(Integer userId, Integer articleId, Boolean status, LocalDateTime updatedAt) {
        return articleReactionRepository.updateReactionStatus(userId, articleId, status, updatedAt);
    }

    /**
     * Find liked articles by user
     */
    public List<Object> findLikedArticlesByUser(Integer userId) {
        return articleReactionRepository.findLikedArticlesByUser(userId);
    }

    /**
     * Find liked articles by user with pagination
     */
    public Page<Object> findLikedArticlesByUser(Integer userId, Pageable pageable) {
        return articleReactionRepository.findLikedArticlesByUser(userId, pageable);
    }

    /**
     * Find recent reactions on published articles
     */
    public List<ArticleReaction> findRecentReactionsOnPublishedArticles(Pageable pageable) {
        return articleReactionRepository.findRecentReactionsOnPublishedArticles(pageable);
    }

    /**
     * Find trending articles by recent likes
     */
    public List<Object[]> findTrendingArticles(LocalDateTime since, Pageable pageable) {
        return articleReactionRepository.findTrendingArticles(since, pageable);
    }

    /**
     * Count total article reactions
     */
    public long count() {
        return articleReactionRepository.count();
    }

    /**
     * Check if article reaction exists by ID
     */
    public boolean existsById(Integer id) {
        return articleReactionRepository.existsById(id);
    }
}
