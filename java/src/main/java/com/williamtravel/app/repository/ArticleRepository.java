package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Article;
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
 * Repository interface for Article entity operations
 * Provides CRUD operations and custom queries for article management
 */
@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {

    // Basic finder methods
    Optional<Article> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    boolean existsByTitle(String title);

    // Author-based queries
    @Query("SELECT a FROM Article a WHERE a.author.id = :authorId")
    List<Article> findByAuthorId(@Param("authorId") Integer authorId);
    
    @Query("SELECT a FROM Article a WHERE a.author.id = :authorId")
    Page<Article> findByAuthorId(@Param("authorId") Integer authorId, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.author.id = :authorId AND a.status = :status")
    Page<Article> findByAuthorIdAndStatus(@Param("authorId") Integer authorId, 
                                         @Param("status") String status, 
                                         Pageable pageable);

    // Status-based queries
    List<Article> findByStatus(String status);
    
    Page<Article> findByStatus(String status, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = 'published' ORDER BY a.publishedAt DESC")
    List<Article> findPublishedArticles();
    
    @Query("SELECT a FROM Article a WHERE a.status = 'published' ORDER BY a.publishedAt DESC")
    Page<Article> findPublishedArticles(Pageable pageable);

    // Featured articles
    @Query("SELECT a FROM Article a WHERE a.featured = true AND a.status = 'published' ORDER BY a.publishedAt DESC")
    List<Article> findFeaturedArticles();
    
    @Query("SELECT a FROM Article a WHERE a.featured = true AND a.status = 'published' ORDER BY a.publishedAt DESC")
    Page<Article> findFeaturedArticles(Pageable pageable);

    // Search queries
    @Query("SELECT a FROM Article a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.excerpt) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "a.status = 'published'")
    List<Article> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT a FROM Article a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.excerpt) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "a.status = 'published'")
    Page<Article> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Category-based queries
    @Query("SELECT a FROM Article a " +
           "JOIN a.articleCategories aac " +
           "JOIN aac.category c " +
           "WHERE c.id = :categoryId AND a.status = 'published'")
    List<Article> findByCategoryId(@Param("categoryId") Integer categoryId);
    
    @Query("SELECT a FROM Article a " +
           "JOIN a.articleCategories aac " +
           "JOIN aac.category c " +
           "WHERE c.id = :categoryId AND a.status = 'published'")
    Page<Article> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);

    // Tag-based queries
    @Query("SELECT a FROM Article a " +
           "JOIN a.articleTags aat " +
           "JOIN aat.tag t " +
           "WHERE t.id = :tagId AND a.status = 'published'")
    List<Article> findByTagId(@Param("tagId") Integer tagId);
    
    @Query("SELECT a FROM Article a " +
           "JOIN a.articleTags aat " +
           "JOIN aat.tag t " +
           "WHERE t.id = :tagId AND a.status = 'published'")
    Page<Article> findByTagId(@Param("tagId") Integer tagId, Pageable pageable);

    // Popular articles (by view count)
    @Query("SELECT a FROM Article a WHERE a.status = 'published' ORDER BY a.viewCount DESC")
    List<Article> findPopularArticles(Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = 'published' AND a.publishedAt >= :since ORDER BY a.viewCount DESC")
    List<Article> findPopularArticlesSince(@Param("since") LocalDateTime since, Pageable pageable);

    // Recent articles
    @Query("SELECT a FROM Article a WHERE a.status = 'published' ORDER BY a.publishedAt DESC")
    List<Article> findRecentArticles(Pageable pageable);

    // Articles by date range
    @Query("SELECT a FROM Article a WHERE " +
           "a.publishedAt >= :startDate AND a.publishedAt <= :endDate AND " +
           "a.status = 'published' " +
           "ORDER BY a.publishedAt DESC")
    List<Article> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Article a WHERE " +
           "a.publishedAt >= :startDate AND a.publishedAt <= :endDate AND " +
           "a.status = 'published' " +
           "ORDER BY a.publishedAt DESC")
    Page<Article> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate,
                                 Pageable pageable);

    // Related articles (by shared categories)
    @Query("SELECT DISTINCT a FROM Article a " +
           "JOIN a.articleCategories aac1 " +
           "JOIN aac1.category c " +
           "WHERE c.id IN (" +
           "   SELECT c2.id FROM Article a2 " +
           "   JOIN a2.articleCategories aac2 " +
           "   JOIN aac2.category c2 " +
           "   WHERE a2.id = :articleId" +
           ") AND a.id != :articleId AND a.status = 'published'")
    List<Article> findRelatedArticles(@Param("articleId") Integer articleId, Pageable pageable);

    // Update view count
    @Modifying
    @Query("UPDATE Article a SET a.viewCount = a.viewCount + 1 WHERE a.id = :id")
    void incrementViewCount(@Param("id") Integer id);

    // Statistical queries
    @Query("SELECT COUNT(a) FROM Article a WHERE a.status = 'published'")
    Long countPublishedArticles();
    
    @Query("SELECT COUNT(a) FROM Article a WHERE a.author.id = :authorId AND a.status = 'published'")
    Long countPublishedArticlesByAuthor(@Param("authorId") Integer authorId);
    
    @Query("SELECT COUNT(a) FROM Article a WHERE a.status = :status")
    Long countByStatus(@Param("status") String status);

    // Complex search with filters
    @Query("SELECT a FROM Article a " +
           "LEFT JOIN a.articleCategories aac " +
           "LEFT JOIN aac.category c " +
           "WHERE " +
           "(:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.excerpt) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:authorId IS NULL OR a.author.id = :authorId) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "(:featured IS NULL OR a.featured = :featured) AND " +
           "a.status = 'published' " +
           "ORDER BY a.publishedAt DESC")
    Page<Article> findWithFilters(@Param("keyword") String keyword,
                                 @Param("authorId") Integer authorId,
                                 @Param("categoryId") Integer categoryId,
                                 @Param("featured") Boolean featured,
                                 Pageable pageable);
}
