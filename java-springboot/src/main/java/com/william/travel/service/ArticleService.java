package com.william.travel.service;

import com.william.travel.entity.Article;
import com.william.travel.entity.ArticleCategory;
import com.william.travel.entity.ArticleTag;
import com.william.travel.entity.ArticleComment;
import com.william.travel.entity.ArticleReaction;
import com.william.travel.entity.ArticleArticleCategory;
import com.william.travel.entity.ArticleArticleTag;
import com.william.travel.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class ArticleService {
    
    @Autowired
    private ArticleRepository articleRepository;
    
    @Autowired
    private ArticleCategoryRepository categoryRepository;
    
    @Autowired
    private ArticleTagRepository tagRepository;
    
    @Autowired
    private ArticleCommentRepository commentRepository;
    
    @Autowired
    private ArticleReactionRepository reactionRepository;
    
    @Autowired
    private ArticleArticleCategoryRepository articleCategoryRepository;
    
    @Autowired
    private ArticleArticleTagRepository articleTagRepository;
    
    @Autowired
    private UserService userService;
    
    // Article CRUD Operations
    public Article createArticle(Article article) {
        article.setIsActive(true);
        article.setIsPublished(false);
        article.setViewCount(0);
        article.setSlug(generateSlug(article.getTitle()));
        
        return articleRepository.save(article);
    }
    
    public Optional<Article> findById(Long id) {
        return articleRepository.findById(id);
    }
    
    public Article findBySlug(String slug) {
        return articleRepository.findBySlug(slug);
    }
    
    public Page<Article> findPublishedArticles(Pageable pageable) {
        return articleRepository.findPublishedArticles(pageable);
    }
    
    public Page<Article> findArticlesByAuthor(Long authorId, Pageable pageable) {
        return articleRepository.findByAuthorId(authorId, pageable);
    }
    
    public Page<Article> findPublishedArticlesByAuthor(Long authorId, Pageable pageable) {
        return articleRepository.findPublishedByAuthorId(authorId, pageable);
    }
    
    public Page<Article> findPublishedArticlesByCategory(Long categoryId, Pageable pageable) {
        return articleRepository.findPublishedByCategoryId(categoryId, pageable);
    }
    
    public Page<Article> findPublishedArticlesByTag(Long tagId, Pageable pageable) {
        return articleRepository.findPublishedByTagId(tagId, pageable);
    }
    
    public Page<Article> searchPublishedArticles(String searchTerm, Pageable pageable) {
        return articleRepository.findPublishedBySearchTerm(searchTerm, pageable);
    }
    
    public List<Article> findFeaturedArticles() {
        return articleRepository.findFeaturedArticles();
    }
    
    public Page<Article> findMostViewedArticles(Pageable pageable) {
        return articleRepository.findMostViewedArticles(pageable);
    }
    
    public Article updateArticle(Long id, Article articleDetails) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        
        article.setTitle(articleDetails.getTitle());
        article.setContent(articleDetails.getContent());
        article.setSummary(articleDetails.getSummary());
        article.setFeaturedImage(articleDetails.getFeaturedImage());
        article.setSlug(generateSlug(articleDetails.getTitle()));
        article.setIsFeatured(articleDetails.getIsFeatured());
        
        return articleRepository.save(article);
    }
    
    public Article publishArticle(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        
        article.setIsPublished(true);
        article.setPublishedAt(LocalDateTime.now());
        
        return articleRepository.save(article);
    }
    
    public Article unpublishArticle(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        
        article.setIsPublished(false);
        article.setPublishedAt(null);
        
        return articleRepository.save(article);
    }
    
    public void deleteArticle(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        article.setIsActive(false);
        articleRepository.save(article);
    }
    
    public Article incrementViewCount(Long id) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        article.setViewCount(article.getViewCount() + 1);
        return articleRepository.save(article);
    }
    
    // Article Categories Management
    public Article assignCategories(Long articleId, Set<Long> categoryIds) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        
        // Remove existing categories
        articleCategoryRepository.deleteByArticleId(articleId);
        
        // Add new categories
        for (Long categoryId : categoryIds) {
            ArticleCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));
            
            ArticleArticleCategory articleCategory = new ArticleArticleCategory();
            articleCategory.setArticle(article);
            articleCategory.setCategory(category);
            articleCategoryRepository.save(articleCategory);
        }
        
        return article;
    }
    
    // Article Tags Management
    public Article assignTags(Long articleId, Set<Long> tagIds) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        
        // Remove existing tags
        articleTagRepository.deleteByArticleId(articleId);
        
        // Add new tags
        for (Long tagId : tagIds) {
            ArticleTag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found: " + tagId));
            
            ArticleArticleTag articleTag = new ArticleArticleTag();
            articleTag.setArticle(article);
            articleTag.setTag(tag);
            articleTagRepository.save(articleTag);
        }
        
        return article;
    }
    
    // Article Comments
    public ArticleComment addComment(Long articleId, Long userId, String content, Long parentCommentId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        
        ArticleComment comment = new ArticleComment();
        comment.setArticle(article);
        comment.setUser(userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found")));
        comment.setContent(content);
        comment.setIsActive(true);
        
        if (parentCommentId != null) {
            ArticleComment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }
        
        return commentRepository.save(comment);
    }
    
    public Page<ArticleComment> findCommentsByArticle(Long articleId, Pageable pageable) {
        return commentRepository.findByArticleId(articleId, pageable);
    }
    
    public Page<ArticleComment> findTopLevelCommentsByArticle(Long articleId, Pageable pageable) {
        return commentRepository.findTopLevelByArticleId(articleId, pageable);
    }
    
    public List<ArticleComment> findRepliesByParentComment(Long parentCommentId) {
        return commentRepository.findRepliesByParentCommentId(parentCommentId);
    }
    
    public void deleteComment(Long commentId) {
        ArticleComment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setIsActive(false);
        commentRepository.save(comment);
    }
    
    // Article Reactions
    public ArticleReaction addOrUpdateReaction(Long articleId, Long userId, String reactionType) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));
        
        Optional<ArticleReaction> existingReaction = reactionRepository.findByUserIdAndArticleId(userId, articleId);
        
        ArticleReaction reaction;
        if (existingReaction.isPresent()) {
            reaction = existingReaction.get();
            reaction.setReactionType(reactionType);
        } else {
            reaction = new ArticleReaction();
            reaction.setArticle(article);
            reaction.setUser(userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
            reaction.setReactionType(reactionType);
        }
        
        return reactionRepository.save(reaction);
    }
    
    public void removeReaction(Long articleId, Long userId) {
        ArticleReaction reaction = reactionRepository.findByUserIdAndArticleId(userId, articleId)
            .orElseThrow(() -> new RuntimeException("Reaction not found"));
        reactionRepository.delete(reaction);
    }
    
    public Long countReactionsByType(Long articleId, String reactionType) {
        return reactionRepository.countByArticleIdAndReactionType(articleId, reactionType);
    }
    
    public List<Object[]> getReactionStatistics(Long articleId) {
        return reactionRepository.countReactionsByTypeForArticle(articleId);
    }
    
    // Utility Methods
    private String generateSlug(String title) {
        return title.toLowerCase()
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
    }
    
    public Long countArticlesByAuthor(Long authorId) {
        return articleRepository.countPublishedByAuthorId(authorId);
    }
}
