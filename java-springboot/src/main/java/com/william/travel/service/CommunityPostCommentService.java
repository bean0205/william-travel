package com.william.travel.service;

import com.william.travel.entity.CommunityPostComment;
import com.william.travel.entity.CommunityPost;
import com.william.travel.entity.User;
import com.william.travel.repository.CommunityPostCommentRepository;
import com.william.travel.repository.CommunityPostRepository;
import com.william.travel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CommunityPostCommentService {

    private final CommunityPostCommentRepository commentRepository;
    private final CommunityPostRepository communityPostRepository;
    private final UserRepository userRepository;

    /**
     * Create a new community post comment
     */
    public CommunityPostComment createComment(CommunityPostComment comment) {
        log.info("Creating new comment for community post: {} by user: {}", 
                comment.getCommunityPost().getId(), comment.getUser().getId());
        
        // Validate community post exists
        if (comment.getCommunityPost() == null || comment.getCommunityPost().getId() == null) {
            throw new IllegalArgumentException("Community post is required for comment");
        }
        
        CommunityPost communityPost = communityPostRepository.findById(comment.getCommunityPost().getId())
                .orElseThrow(() -> new IllegalArgumentException("Community post not found with ID: " + comment.getCommunityPost().getId()));
        
        // Validate user exists
        if (comment.getUser() == null || comment.getUser().getId() == null) {
            throw new IllegalArgumentException("User is required for comment");
        }
        
        User user = userRepository.findById(comment.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + comment.getUser().getId()));
        
        // Validate parent comment if provided
        if (comment.getParentComment() != null && comment.getParentComment().getId() != null) {
            CommunityPostComment parentComment = commentRepository.findById(comment.getParentComment().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found with ID: " + comment.getParentComment().getId()));
            
            // Ensure parent comment belongs to the same community post
            if (!parentComment.getCommunityPost().getId().equals(communityPost.getId())) {
                throw new IllegalArgumentException("Parent comment must belong to the same community post");
            }
            
            comment.setParentComment(parentComment);
        }
        
        comment.setCommunityPost(communityPost);
        comment.setUser(user);
        comment.setStatus(1); // Active
        comment.setCreatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    /**
     * Get comment by ID
     */
    @Transactional(readOnly = true)
    public Optional<CommunityPostComment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    /**
     * Get comments for a community post with pagination
     */
    @Transactional(readOnly = true)
    public Page<CommunityPostComment> getCommentsForPost(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable);
    }

    /**
     * Get top-level comments for a community post (no parent comments) with pagination
     */
    @Transactional(readOnly = true)
    public Page<CommunityPostComment> getTopLevelCommentsForPost(Long postId, Pageable pageable) {
        return commentRepository.findTopLevelByPostId(postId, pageable);
    }

    /**
     * Get replies to a comment
     */
    @Transactional(readOnly = true)
    public List<CommunityPostComment> getRepliesForComment(Long parentCommentId) {
        return commentRepository.findRepliesByParentCommentId(parentCommentId);
    }

    /**
     * Get comments by user with pagination
     */
    @Transactional(readOnly = true)
    public Page<CommunityPostComment> getCommentsByUser(Long userId, Pageable pageable) {
        return commentRepository.findByUserId(userId, pageable);
    }

    /**
     * Update comment
     */
    public CommunityPostComment updateComment(Long id, String content) {
        log.info("Updating community post comment with ID: {}", id);
        
        CommunityPostComment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + id));

        // Update content
        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }

    /**
     * Delete comment (soft delete)
     */
    public void deleteComment(Long id) {
        log.info("Deleting community post comment with ID: {}", id);
        
        CommunityPostComment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + id));
        
        comment.setStatus(0); // Deleted
        comment.setUpdatedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    /**
     * Count comments for a community post
     */
    @Transactional(readOnly = true)
    public Long countCommentsForPost(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    /**
     * Count replies for a comment
     */
    @Transactional(readOnly = true)
    public Long countRepliesForComment(Long parentCommentId) {
        return commentRepository.countRepliesByParentCommentId(parentCommentId);
    }

    /**
     * Validate comment ownership by user
     */
    @Transactional(readOnly = true)
    public boolean isCommentOwnedByUser(Long commentId, Long userId) {
        CommunityPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));
        
        return comment.getUser().getId().equals(userId);
    }

    /**
     * Get comment thread (comment with all its replies)
     */
    @Transactional(readOnly = true)
    public CommunityPostComment getCommentThread(Long commentId) {
        CommunityPostComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));
        
        // Load replies
        List<CommunityPostComment> replies = commentRepository.findRepliesByParentCommentId(commentId);
        
        // Note: In a real implementation, you might want to set the replies on the comment entity
        // if it has a replies field, or return a DTO that includes the replies
        
        return comment;
    }

    /**
     * Moderate comment (approve/reject)
     */
    public CommunityPostComment moderateComment(Long id, Integer status) {
        log.info("Moderating community post comment with ID: {} to status: {}", id, status);
        
        CommunityPostComment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + id));
        
        if (status != 0 && status != 1 && status != -1) {
            throw new IllegalArgumentException("Status must be 0 (deleted), 1 (active), or -1 (rejected)");
        }
        
        comment.setStatus(status);
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }
}
