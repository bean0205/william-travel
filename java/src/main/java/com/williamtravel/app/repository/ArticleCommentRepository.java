package com.williamtravel.app.repository;

import com.williamtravel.app.entity.ArticleComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for ArticleComment entity operations
 * Provides CRUD operations and custom queries for article comment management
 */
@Repository
public interface ArticleCommentRepository extends JpaRepository<ArticleComment, Integer> {

    // Find by article
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.article.id = :articleId")
    List<ArticleComment> findByArticleId(@Param("articleId") Integer articleId);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.article.id = :articleId ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findByArticleId(@Param("articleId") Integer articleId, Pageable pageable);

    // Find by article with status filter
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.article.id = :articleId AND ac.status = :status ORDER BY ac.createdAt DESC")
    List<ArticleComment> findByArticleIdAndStatus(@Param("articleId") Integer articleId, 
                                                 @Param("status") Boolean status);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.article.id = :articleId AND ac.status = :status ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findByArticleIdAndStatus(@Param("articleId") Integer articleId, 
                                                 @Param("status") Boolean status, 
                                                 Pageable pageable);

    // Find by user
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.user.id = :userId ORDER BY ac.createdAt DESC")
    List<ArticleComment> findByUserId(@Param("userId") Integer userId);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.user.id = :userId ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findByUserId(@Param("userId") Integer userId, Pageable pageable);

    // Find by user with status filter
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.user.id = :userId AND ac.status = :status ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findByUserIdAndStatus(@Param("userId") Integer userId, 
                                              @Param("status") Boolean status, 
                                              Pageable pageable);

    // Status-based queries
    List<ArticleComment> findByStatus(Boolean status);
    
    Page<ArticleComment> findByStatus(Boolean status, Pageable pageable);

    // Recent comments
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.status = true ORDER BY ac.createdAt DESC")
    List<ArticleComment> findRecentComments(Pageable pageable);

    // Comments by date range
    @Query("SELECT ac FROM ArticleComment ac WHERE " +
           "ac.createdAt >= :startDate AND ac.createdAt <= :endDate AND " +
           "ac.status = true " +
           "ORDER BY ac.createdAt DESC")
    List<ArticleComment> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE " +
           "ac.createdAt >= :startDate AND ac.createdAt <= :endDate AND " +
           "ac.status = true " +
           "ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate,
                                        Pageable pageable);

    // Search in comment content
    @Query("SELECT ac FROM ArticleComment ac WHERE " +
           "LOWER(ac.content) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
           "ac.status = true " +
           "ORDER BY ac.createdAt DESC")
    List<ArticleComment> searchByContent(@Param("keyword") String keyword);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE " +
           "LOWER(ac.content) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
           "ac.status = true " +
           "ORDER BY ac.createdAt DESC")
    Page<ArticleComment> searchByContent(@Param("keyword") String keyword, Pageable pageable);

    // Statistical queries
    @Query("SELECT COUNT(ac) FROM ArticleComment ac WHERE ac.article.id = :articleId AND ac.status = true")
    Long countActiveCommentsByArticle(@Param("articleId") Integer articleId);
    
    @Query("SELECT COUNT(ac) FROM ArticleComment ac WHERE ac.user.id = :userId AND ac.status = true")
    Long countActiveCommentsByUser(@Param("userId") Integer userId);
    
    @Query("SELECT COUNT(ac) FROM ArticleComment ac WHERE ac.status = true")
    Long countAllActiveComments();

    // Most commented articles
    @Query("SELECT ac.article.id, COUNT(ac) FROM ArticleComment ac WHERE ac.status = true GROUP BY ac.article.id ORDER BY COUNT(ac) DESC")
    List<Object[]> findMostCommentedArticles(Pageable pageable);

    // Most active commenters
    @Query("SELECT ac.user.id, ac.user.fullName, COUNT(ac) FROM ArticleComment ac WHERE ac.status = true GROUP BY ac.user.id, ac.user.fullName ORDER BY COUNT(ac) DESC")
    List<Object[]> findMostActiveCommenters(Pageable pageable);

    // Comments pending approval
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.status = false ORDER BY ac.createdAt ASC")
    List<ArticleComment> findPendingComments();
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.status = false ORDER BY ac.createdAt ASC")
    Page<ArticleComment> findPendingComments(Pageable pageable);

    // Recent comments on published articles
    @Query("SELECT ac FROM ArticleComment ac " +
           "JOIN ac.article a " +
           "WHERE ac.status = true AND a.status = true " +
           "ORDER BY ac.createdAt DESC")
    List<ArticleComment> findRecentCommentsOnPublishedArticles(Pageable pageable);
}
