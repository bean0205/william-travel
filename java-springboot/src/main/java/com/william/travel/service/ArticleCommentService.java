package com.william.travel.service;

import com.william.travel.entity.ArticleComment;
import com.william.travel.entity.Article;
import com.william.travel.entity.User;
import com.william.travel.repository.ArticleCommentRepository;
import com.william.travel.repository.ArticleRepository;
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
public class ArticleCommentService {

    private final ArticleCommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    /**
     * Create a new article comment
     */
    public ArticleComment createComment(ArticleComment comment) {
        log.info("Creating new comment for article: {} by user: {}", 
                comment.getArticle().getId(), comment.getUser().getId());
        
        // Validate article exists
        if (comment.getArticle() == null || comment.getArticle().getId() == null) {
            throw new IllegalArgumentException("Article is required for comment");
        }
        
        Article article = articleRepository.findById(comment.getArticle().getId())
                .orElseThrow(() -> new IllegalArgumentException("Article not found with ID: " + comment.getArticle().getId()));
        
        // Validate user exists
        if (comment.getUser() == null || comment.getUser().getId() == null) {
            throw new IllegalArgumentException("User is required for comment");
        }
        
        User user = userRepository.findById(comment.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + comment.getUser().getId()));
        
        // Validate parent comment if provided
        if (comment.getParentComment() != null && comment.getParentComment().getId() != null) {
            ArticleComment parentComment = commentRepository.findById(comment.getParentComment().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found with ID: " + comment.getParentComment().getId()));
            
            // Ensure parent comment belongs to the same article
            if (!parentComment.getArticle().getId().equals(article.getId())) {
                throw new IllegalArgumentException("Parent comment must belong to the same article");
            }
            
            comment.setParentComment(parentComment);
        }
        
        comment.setArticle(article);
        comment.setUser(user);
        comment.setStatus(1); // Active
        comment.setCreatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }

    /**
     * Get comment by ID
     */
    @Transactional(readOnly = true)
    public Optional<ArticleComment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    /**
     * Get comments for an article with pagination
     */
    @Transactional(readOnly = true)
    public Page<ArticleComment> getCommentsForArticle(Long articleId, Pageable pageable) {
        return commentRepository.findByArticleId(articleId, pageable);
    }

    /**
     * Get top-level comments for an article (no parent comments) with pagination
     */
    @Transactional(readOnly = true)
    public Page<ArticleComment> getTopLevelCommentsForArticle(Long articleId, Pageable pageable) {
        return commentRepository.findTopLevelByArticleId(articleId, pageable);
    }

    /**
     * Get replies to a comment
     */
    @Transactional(readOnly = true)
    public List<ArticleComment> getRepliesForComment(Long parentCommentId) {
        return commentRepository.findRepliesByParentCommentId(parentCommentId);
    }

    /**
     * Get comments by user with pagination
     */
    @Transactional(readOnly = true)
    public Page<ArticleComment> getCommentsByUser(Long userId, Pageable pageable) {
        return commentRepository.findByUserId(userId, pageable);
    }

    /**
     * Update comment
     */
    public ArticleComment updateComment(Long id, String content) {
        log.info("Updating comment with ID: {}", id);
        
        ArticleComment comment = commentRepository.findById(id)
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
        log.info("Deleting comment with ID: {}", id);
        
        ArticleComment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + id));
        
        comment.setStatus(0); // Deleted
        comment.setUpdatedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    /**
     * Count comments for an article
     */
    @Transactional(readOnly = true)
    public Long countCommentsForArticle(Long articleId) {
        return commentRepository.countByArticleId(articleId);
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
        ArticleComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));
        
        return comment.getUser().getId().equals(userId);
    }

    /**
     * Get comment thread (comment with all its replies)
     */
    @Transactional(readOnly = true)
    public ArticleComment getCommentThread(Long commentId) {
        ArticleComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));
        
        // Load replies
        List<ArticleComment> replies = commentRepository.findRepliesByParentCommentId(commentId);
        
        // Note: In a real implementation, you might want to set the replies on the comment entity
        // if it has a replies field, or return a DTO that includes the replies
        
        return comment;
    }

    /**
     * Moderate comment (approve/reject)
     */
    public ArticleComment moderateComment(Long id, Integer status) {
        log.info("Moderating comment with ID: {} to status: {}", id, status);
        
        ArticleComment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + id));
        
        if (status != 0 && status != 1 && status != -1) {
            throw new IllegalArgumentException("Status must be 0 (deleted), 1 (active), or -1 (rejected)");
        }
        
        comment.setStatus(status);
        comment.setUpdatedAt(LocalDateTime.now());
        
        return commentRepository.save(comment);
    }
}
