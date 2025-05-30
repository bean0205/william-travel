package com.william.travel.service;

import com.william.travel.entity.ArticleReaction;
import com.william.travel.entity.Article;
import com.william.travel.entity.User;
import com.william.travel.repository.ArticleReactionRepository;
import com.william.travel.repository.ArticleRepository;
import com.william.travel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ArticleReactionService {

    private final ArticleReactionRepository reactionRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    /**
     * Add or update a reaction to an article
     */
    public ArticleReaction addOrUpdateReaction(Long articleId, Long userId, String reactionType) {
        log.info("Adding/updating reaction for article: {} by user: {} with type: {}", 
                articleId, userId, reactionType);
        
        // Validate article exists
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with ID: " + articleId));
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        // Validate reaction type
        validateReactionType(reactionType);
        
        // Check if user already reacted to this article
        Optional<ArticleReaction> existingReaction = reactionRepository.findByUserIdAndArticleId(userId, articleId);
        
        ArticleReaction reaction;
        if (existingReaction.isPresent()) {
            // Update existing reaction
            reaction = existingReaction.get();
            reaction.setReactionType(reactionType);
            reaction.setUpdatedAt(LocalDateTime.now());
            log.info("Updated existing reaction with ID: {}", reaction.getId());
        } else {
            // Create new reaction
            reaction = new ArticleReaction();
            reaction.setArticle(article);
            reaction.setUser(user);
            reaction.setReactionType(reactionType);
            reaction.setCreatedAt(LocalDateTime.now());
            log.info("Created new reaction");
        }
        
        return reactionRepository.save(reaction);
    }

    /**
     * Remove a reaction from an article
     */
    public void removeReaction(Long articleId, Long userId) {
        log.info("Removing reaction for article: {} by user: {}", articleId, userId);
        
        ArticleReaction reaction = reactionRepository.findByUserIdAndArticleId(userId, articleId)
                .orElseThrow(() -> new IllegalArgumentException("Reaction not found for user " + userId + " on article " + articleId));
        
        reactionRepository.delete(reaction);
    }

    /**
     * Get user's reaction to an article
     */
    @Transactional(readOnly = true)
    public Optional<ArticleReaction> getUserReactionToArticle(Long articleId, Long userId) {
        return reactionRepository.findByUserIdAndArticleId(userId, articleId);
    }

    /**
     * Get all reactions for an article
     */
    @Transactional(readOnly = true)
    public List<ArticleReaction> getReactionsForArticle(Long articleId) {
        return reactionRepository.findByArticleId(articleId);
    }

    /**
     * Get all reactions by a user
     */
    @Transactional(readOnly = true)
    public List<ArticleReaction> getReactionsByUser(Long userId) {
        return reactionRepository.findByUserId(userId);
    }

    /**
     * Count reactions for an article
     */
    @Transactional(readOnly = true)
    public Long countReactionsForArticle(Long articleId) {
        return reactionRepository.countByArticleId(articleId);
    }

    /**
     * Count reactions by type for an article
     */
    @Transactional(readOnly = true)
    public Long countReactionsByTypeForArticle(Long articleId, String reactionType) {
        validateReactionType(reactionType);
        return reactionRepository.countByArticleIdAndReactionType(articleId, reactionType);
    }

    /**
     * Get reaction count summary for an article
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getReactionSummaryForArticle(Long articleId) {
        List<Object[]> results = reactionRepository.countReactionsByTypeForArticle(articleId);
        
        Map<String, Long> summary = new HashMap<>();
        for (Object[] result : results) {
            String reactionType = (String) result[0];
            Long count = (Long) result[1];
            summary.put(reactionType, count);
        }
        
        return summary;
    }

    /**
     * Check if user has reacted to an article
     */
    @Transactional(readOnly = true)
    public boolean hasUserReactedToArticle(Long articleId, Long userId) {
        return reactionRepository.findByUserIdAndArticleId(userId, articleId).isPresent();
    }

    /**
     * Get user's reaction type for an article
     */
    @Transactional(readOnly = true)
    public Optional<String> getUserReactionTypeForArticle(Long articleId, Long userId) {
        return reactionRepository.findByUserIdAndArticleId(userId, articleId)
                .map(ArticleReaction::getReactionType);
    }

    /**
     * Toggle reaction (add if not exists, remove if exists with same type, update if exists with different type)
     */
    public Optional<ArticleReaction> toggleReaction(Long articleId, Long userId, String reactionType) {
        log.info("Toggling reaction for article: {} by user: {} with type: {}", 
                articleId, userId, reactionType);
        
        validateReactionType(reactionType);
        
        Optional<ArticleReaction> existingReaction = reactionRepository.findByUserIdAndArticleId(userId, articleId);
        
        if (existingReaction.isPresent()) {
            ArticleReaction reaction = existingReaction.get();
            if (reaction.getReactionType().equals(reactionType)) {
                // Same reaction type, remove it
                reactionRepository.delete(reaction);
                return Optional.empty();
            } else {
                // Different reaction type, update it
                reaction.setReactionType(reactionType);
                reaction.setUpdatedAt(LocalDateTime.now());
                return Optional.of(reactionRepository.save(reaction));
            }
        } else {
            // No existing reaction, create new one
            return Optional.of(addOrUpdateReaction(articleId, userId, reactionType));
        }
    }

    /**
     * Validate reaction type
     */
    private void validateReactionType(String reactionType) {
        if (reactionType == null || reactionType.trim().isEmpty()) {
            throw new IllegalArgumentException("Reaction type cannot be null or empty");
        }
        
        // Define allowed reaction types
        List<String> allowedTypes = List.of("like", "love", "laugh", "angry", "sad", "wow");
        
        if (!allowedTypes.contains(reactionType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid reaction type: " + reactionType + 
                    ". Allowed types: " + String.join(", ", allowedTypes));
        }
    }
}
