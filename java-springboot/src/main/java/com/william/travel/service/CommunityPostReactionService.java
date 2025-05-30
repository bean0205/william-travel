package com.william.travel.service;

import com.william.travel.entity.CommunityPostReaction;
import com.william.travel.entity.CommunityPost;
import com.william.travel.entity.CommunityPostComment;
import com.william.travel.entity.User;
import com.william.travel.repository.CommunityPostReactionRepository;
import com.william.travel.repository.CommunityPostRepository;
import com.william.travel.repository.CommunityPostCommentRepository;
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
public class CommunityPostReactionService {

    private final CommunityPostReactionRepository reactionRepository;
    private final CommunityPostRepository postRepository;
    private final CommunityPostCommentRepository commentRepository;
    private final UserRepository userRepository;

    /**
     * Add or update a reaction to a community post
     */
    public CommunityPostReaction addOrUpdatePostReaction(Long postId, Long userId, String reactionType) {
        log.info("Adding/updating reaction for community post: {} by user: {} with type: {}", 
                postId, userId, reactionType);
        
        // Validate post exists and is active
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Community post not found with ID: " + postId));
        
        if (post.getStatus() != 1) {
            throw new IllegalArgumentException("Cannot react to inactive community post");
        }
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        // Validate reaction type
        validateReactionType(reactionType);
        
        // Check if user already reacted to this post
        Optional<CommunityPostReaction> existingReaction = reactionRepository.findByUserIdAndPostId(userId, postId);
        
        CommunityPostReaction reaction;
        if (existingReaction.isPresent()) {
            // Update existing reaction
            reaction = existingReaction.get();
            reaction.setReactionType(reactionType);
            reaction.setUpdatedAt(LocalDateTime.now());
            log.info("Updated existing post reaction with ID: {}", reaction.getId());
        } else {
            // Create new reaction
            reaction = new CommunityPostReaction();
            reaction.setPost(post);
            reaction.setUser(user);
            reaction.setReactionType(reactionType);
            reaction.setStatus(true);
            reaction.setCreatedAt(LocalDateTime.now());
            log.info("Created new post reaction");
        }
        
        return reactionRepository.save(reaction);
    }

    /**
     * Add or update a reaction to a community post comment
     */
    public CommunityPostReaction addOrUpdateCommentReaction(Long commentId, Long userId, String reactionType) {
        log.info("Adding/updating reaction for community post comment: {} by user: {} with type: {}", 
                commentId, userId, reactionType);
        
        // Validate comment exists and is active
        CommunityPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Community post comment not found with ID: " + commentId));
        
        if (comment.getStatus() != 1) {
            throw new IllegalArgumentException("Cannot react to inactive community post comment");
        }
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        // Validate reaction type
        validateReactionType(reactionType);
        
        // Check if user already reacted to this comment
        Optional<CommunityPostReaction> existingReaction = reactionRepository.findByUserIdAndCommentId(userId, commentId);
        
        CommunityPostReaction reaction;
        if (existingReaction.isPresent()) {
            // Update existing reaction
            reaction = existingReaction.get();
            reaction.setReactionType(reactionType);
            reaction.setUpdatedAt(LocalDateTime.now());
            log.info("Updated existing comment reaction with ID: {}", reaction.getId());
        } else {
            // Create new reaction
            reaction = new CommunityPostReaction();
            reaction.setPost(comment.getPost()); // Set the post from comment
            reaction.setComment(comment);
            reaction.setUser(user);
            reaction.setReactionType(reactionType);
            reaction.setStatus(true);
            reaction.setCreatedAt(LocalDateTime.now());
            log.info("Created new comment reaction");
        }
        
        return reactionRepository.save(reaction);
    }

    /**
     * Remove a reaction from a community post
     */
    public void removePostReaction(Long postId, Long userId) {
        log.info("Removing reaction for community post: {} by user: {}", postId, userId);
        
        CommunityPostReaction reaction = reactionRepository.findByUserIdAndPostId(userId, postId)
                .orElseThrow(() -> new IllegalArgumentException("Reaction not found for user " + userId + " on post " + postId));
        
        // Soft delete by setting status to false
        reaction.setStatus(false);
        reaction.setUpdatedAt(LocalDateTime.now());
        reactionRepository.save(reaction);
    }

    /**
     * Remove a reaction from a community post comment
     */
    public void removeCommentReaction(Long commentId, Long userId) {
        log.info("Removing reaction for community post comment: {} by user: {}", commentId, userId);
        
        CommunityPostReaction reaction = reactionRepository.findByUserIdAndCommentId(userId, commentId)
                .orElseThrow(() -> new IllegalArgumentException("Reaction not found for user " + userId + " on comment " + commentId));
        
        // Soft delete by setting status to false
        reaction.setStatus(false);
        reaction.setUpdatedAt(LocalDateTime.now());
        reactionRepository.save(reaction);
    }

    /**
     * Toggle reaction for a community post (add if not exists, remove if exists with same type, update if exists with different type)
     */
    public Optional<CommunityPostReaction> togglePostReaction(Long postId, Long userId, String reactionType) {
        log.info("Toggling reaction for community post: {} by user: {} with type: {}", 
                postId, userId, reactionType);
        
        validateReactionType(reactionType);
        
        Optional<CommunityPostReaction> existingReaction = reactionRepository.findByUserIdAndPostId(userId, postId);
        
        if (existingReaction.isPresent()) {
            CommunityPostReaction reaction = existingReaction.get();
            if (reaction.getReactionType().equals(reactionType)) {
                // Same reaction type, remove it (soft delete)
                reaction.setStatus(false);
                reaction.setUpdatedAt(LocalDateTime.now());
                reactionRepository.save(reaction);
                return Optional.empty();
            } else {
                // Different reaction type, update it
                reaction.setReactionType(reactionType);
                reaction.setStatus(true);
                reaction.setUpdatedAt(LocalDateTime.now());
                return Optional.of(reactionRepository.save(reaction));
            }
        } else {
            // No existing reaction, create new one
            return Optional.of(addOrUpdatePostReaction(postId, userId, reactionType));
        }
    }

    /**
     * Toggle reaction for a community post comment (add if not exists, remove if exists with same type, update if exists with different type)
     */
    public Optional<CommunityPostReaction> toggleCommentReaction(Long commentId, Long userId, String reactionType) {
        log.info("Toggling reaction for community post comment: {} by user: {} with type: {}", 
                commentId, userId, reactionType);
        
        validateReactionType(reactionType);
        
        Optional<CommunityPostReaction> existingReaction = reactionRepository.findByUserIdAndCommentId(userId, commentId);
        
        if (existingReaction.isPresent()) {
            CommunityPostReaction reaction = existingReaction.get();
            if (reaction.getReactionType().equals(reactionType)) {
                // Same reaction type, remove it (soft delete)
                reaction.setStatus(false);
                reaction.setUpdatedAt(LocalDateTime.now());
                reactionRepository.save(reaction);
                return Optional.empty();
            } else {
                // Different reaction type, update it
                reaction.setReactionType(reactionType);
                reaction.setStatus(true);
                reaction.setUpdatedAt(LocalDateTime.now());
                return Optional.of(reactionRepository.save(reaction));
            }
        } else {
            // No existing reaction, create new one
            return Optional.of(addOrUpdateCommentReaction(commentId, userId, reactionType));
        }
    }

    /**
     * Get user's reaction to a community post
     */
    @Transactional(readOnly = true)
    public Optional<CommunityPostReaction> getUserReactionToPost(Long postId, Long userId) {
        return reactionRepository.findByUserIdAndPostId(userId, postId);
    }

    /**
     * Get user's reaction to a community post comment
     */
    @Transactional(readOnly = true)
    public Optional<CommunityPostReaction> getUserReactionToComment(Long commentId, Long userId) {
        return reactionRepository.findByUserIdAndCommentId(userId, commentId);
    }

    /**
     * Get all reactions for a community post
     */
    @Transactional(readOnly = true)
    public List<CommunityPostReaction> getReactionsForPost(Long postId) {
        return reactionRepository.findByPostId(postId);
    }

    /**
     * Get all reactions for a community post comment
     */
    @Transactional(readOnly = true)
    public List<CommunityPostReaction> getReactionsForComment(Long commentId) {
        return reactionRepository.findByCommentId(commentId);
    }

    /**
     * Get all reactions by a user
     */
    @Transactional(readOnly = true)
    public List<CommunityPostReaction> getReactionsByUser(Long userId) {
        return reactionRepository.findByUserId(userId);
    }

    /**
     * Count reactions for a community post
     */
    @Transactional(readOnly = true)
    public Long countReactionsForPost(Long postId) {
        return reactionRepository.countByPostId(postId);
    }

    /**
     * Count reactions for a community post comment
     */
    @Transactional(readOnly = true)
    public Long countReactionsForComment(Long commentId) {
        return reactionRepository.countByCommentId(commentId);
    }

    /**
     * Count reactions by type for a community post
     */
    @Transactional(readOnly = true)
    public Long countReactionsByTypeForPost(Long postId, String reactionType) {
        validateReactionType(reactionType);
        return reactionRepository.countByPostIdAndReactionType(postId, reactionType);
    }

    /**
     * Count reactions by type for a community post comment
     */
    @Transactional(readOnly = true)
    public Long countReactionsByTypeForComment(Long commentId, String reactionType) {
        validateReactionType(reactionType);
        return reactionRepository.countByCommentIdAndReactionType(commentId, reactionType);
    }

    /**
     * Get reaction count summary for a community post
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getReactionSummaryForPost(Long postId) {
        List<Object[]> results = reactionRepository.countReactionsByTypeForPost(postId);
        
        Map<String, Long> summary = new HashMap<>();
        for (Object[] result : results) {
            String reactionType = (String) result[0];
            Long count = (Long) result[1];
            summary.put(reactionType, count);
        }
        
        return summary;
    }

    /**
     * Get reaction count summary for a community post comment
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getReactionSummaryForComment(Long commentId) {
        List<Object[]> results = reactionRepository.countReactionsByTypeForComment(commentId);
        
        Map<String, Long> summary = new HashMap<>();
        for (Object[] result : results) {
            String reactionType = (String) result[0];
            Long count = (Long) result[1];
            summary.put(reactionType, count);
        }
        
        return summary;
    }

    /**
     * Check if user has reacted to a community post
     */
    @Transactional(readOnly = true)
    public boolean hasUserReactedToPost(Long postId, Long userId) {
        return reactionRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    /**
     * Check if user has reacted to a community post comment
     */
    @Transactional(readOnly = true)
    public boolean hasUserReactedToComment(Long commentId, Long userId) {
        return reactionRepository.findByUserIdAndCommentId(userId, commentId).isPresent();
    }

    /**
     * Get user's reaction type for a community post
     */
    @Transactional(readOnly = true)
    public Optional<String> getUserReactionTypeForPost(Long postId, Long userId) {
        return reactionRepository.findByUserIdAndPostId(userId, postId)
                .map(CommunityPostReaction::getReactionType);
    }

    /**
     * Get user's reaction type for a community post comment
     */
    @Transactional(readOnly = true)
    public Optional<String> getUserReactionTypeForComment(Long commentId, Long userId) {
        return reactionRepository.findByUserIdAndCommentId(userId, commentId)
                .map(CommunityPostReaction::getReactionType);
    }

    /**
     * Check if user can react to a post (user ownership validation)
     */
    @Transactional(readOnly = true)
    public boolean canUserReactToPost(Long postId, Long userId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Community post not found with ID: " + postId));
        
        // Users can react to their own posts and other users' posts
        return post.getStatus() == 1;
    }

    /**
     * Check if user can react to a comment (user ownership validation)
     */
    @Transactional(readOnly = true)
    public boolean canUserReactToComment(Long commentId, Long userId) {
        CommunityPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Community post comment not found with ID: " + commentId));
        
        // Users can react to their own comments and other users' comments
        return comment.getStatus() == 1;
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
