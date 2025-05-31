package com.williamtravel.app.repository;

import com.williamtravel.app.entity.ArticleReaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ArticleReaction entity operations
 * Provides CRUD operations and custom queries for article reaction management
 */
@Repository
public interface ArticleReactionRepository extends JpaRepository<ArticleReaction, Integer> {

    // Find by article
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.article.id = :articleId")
    List<ArticleReaction> findByArticleId(@Param("articleId") Integer articleId);
    
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.article.id = :articleId ORDER BY ar.createdAt DESC")
    Page<ArticleReaction> findByArticleId(@Param("articleId") Integer articleId, Pageable pageable);

    // Find by article with status filter
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.article.id = :articleId AND ar.status = :status")
    List<ArticleReaction> findByArticleIdAndStatus(@Param("articleId") Integer articleId, 
                                                  @Param("status") Boolean status);

    // Find by user
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.user.id = :userId ORDER BY ar.createdAt DESC")
    List<ArticleReaction> findByUserId(@Param("userId") Integer userId);
    
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.user.id = :userId ORDER BY ar.createdAt DESC")
    Page<ArticleReaction> findByUserId(@Param("userId") Integer userId, Pageable pageable);

    // Find by user with status filter
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.user.id = :userId AND ar.status = :status ORDER BY ar.createdAt DESC")
    Page<ArticleReaction> findByUserIdAndStatus(@Param("userId") Integer userId, 
                                               @Param("status") Boolean status, 
                                               Pageable pageable);

    // Find specific user reaction to article
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.user.id = :userId AND ar.article.id = :articleId")
    Optional<ArticleReaction> findByUserIdAndArticleId(@Param("userId") Integer userId, 
                                                       @Param("articleId") Integer articleId);

    // Check if user has reacted to article
    @Query("SELECT COUNT(ar) > 0 FROM ArticleReaction ar WHERE ar.user.id = :userId AND ar.article.id = :articleId")
    boolean existsByUserIdAndArticleId(@Param("userId") Integer userId, 
                                      @Param("articleId") Integer articleId);

    // Check if user has active reaction to article
    @Query("SELECT COUNT(ar) > 0 FROM ArticleReaction ar WHERE ar.user.id = :userId AND ar.article.id = :articleId AND ar.status = true")
    boolean existsActiveReactionByUserAndArticle(@Param("userId") Integer userId, 
                                                @Param("articleId") Integer articleId);

    // Status-based queries
    List<ArticleReaction> findByStatus(Boolean status);
    
    Page<ArticleReaction> findByStatus(Boolean status, Pageable pageable);

    // Recent reactions
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.status = true ORDER BY ar.createdAt DESC")
    List<ArticleReaction> findRecentReactions(Pageable pageable);

    // Reactions by date range
    @Query("SELECT ar FROM ArticleReaction ar WHERE " +
           "ar.createdAt >= :startDate AND ar.createdAt <= :endDate AND " +
           "ar.status = true " +
           "ORDER BY ar.createdAt DESC")
    List<ArticleReaction> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    // Statistical queries
    @Query("SELECT COUNT(ar) FROM ArticleReaction ar WHERE ar.article.id = :articleId AND ar.status = true")
    Long countActiveReactionsByArticle(@Param("articleId") Integer articleId);
    
    @Query("SELECT COUNT(ar) FROM ArticleReaction ar WHERE ar.user.id = :userId AND ar.status = true")
    Long countActiveReactionsByUser(@Param("userId") Integer userId);
    
    @Query("SELECT COUNT(ar) FROM ArticleReaction ar WHERE ar.status = true")
    Long countAllActiveReactions();

    // Most liked articles
    @Query("SELECT ar.article.id, ar.article.title, COUNT(ar) FROM ArticleReaction ar " +
           "JOIN ar.article a " +
           "WHERE ar.status = true AND a.status = 'published' " +
           "GROUP BY ar.article.id, ar.article.title " +
           "ORDER BY COUNT(ar) DESC")
    List<Object[]> findMostLikedArticles(Pageable pageable);

    // Most active users (by reactions given)
    @Query("SELECT ar.user.id, ar.user.username, COUNT(ar) FROM ArticleReaction ar " +
           "WHERE ar.status = true " +
           "GROUP BY ar.user.id, ar.user.username " +
           "ORDER BY COUNT(ar) DESC")
    List<Object[]> findMostActiveReactors(Pageable pageable);

    // Toggle reaction (for like/unlike functionality)
    @Modifying
    @Query("UPDATE ArticleReaction ar SET ar.status = :status, ar.updatedAt = :updatedAt WHERE ar.user.id = :userId AND ar.article.id = :articleId")
    int updateReactionStatus(@Param("userId") Integer userId, 
                            @Param("articleId") Integer articleId, 
                            @Param("status") Boolean status,
                            @Param("updatedAt") LocalDateTime updatedAt);

    // Articles liked by user
    @Query("SELECT ar.article FROM ArticleReaction ar " +
           "WHERE ar.user.id = :userId AND ar.status = true " +
           "ORDER BY ar.createdAt DESC")
    List<Object> findLikedArticlesByUser(@Param("userId") Integer userId);
    
    @Query("SELECT ar.article FROM ArticleReaction ar " +
           "WHERE ar.user.id = :userId AND ar.status = true " +
           "ORDER BY ar.createdAt DESC")
    Page<Object> findLikedArticlesByUser(@Param("userId") Integer userId, Pageable pageable);

    // Recent reactions on published articles
    @Query("SELECT ar FROM ArticleReaction ar " +
           "JOIN ar.article a " +
           "WHERE ar.status = true AND a.status = 'published' " +
           "ORDER BY ar.createdAt DESC")
    List<ArticleReaction> findRecentReactionsOnPublishedArticles(Pageable pageable);

    // Trending articles (by recent likes)
    @Query("SELECT ar.article.id, COUNT(ar) FROM ArticleReaction ar " +
           "JOIN ar.article a " +
           "WHERE ar.status = true AND a.status = 'published' " +
           "AND ar.createdAt >= :since " +
           "GROUP BY ar.article.id " +
           "ORDER BY COUNT(ar) DESC")
    List<Object[]> findTrendingArticles(@Param("since") LocalDateTime since, Pageable pageable);
}
