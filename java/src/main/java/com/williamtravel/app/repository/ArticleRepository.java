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
 */
@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {

    // Basic CRUD operations are inherited from JpaRepository
    
    // Custom finder methods
    Optional<Article> findByTitleAndStatus(String title, Boolean status);
    
    List<Article> findByAuthorId(Integer authorId);
    
    Page<Article> findByAuthorId(Integer authorId, Pageable pageable);
    
    List<Article> findByAuthorIdAndStatus(Integer authorId, Boolean status);
    
    Page<Article> findByAuthorIdAndStatus(@Param("authorId") Integer authorId,
                                         @Param("status") Boolean status,
                                         Pageable pageable);

    // Status-based queries
    List<Article> findByStatus(Boolean status);
    
    Page<Article> findByStatus(Boolean status, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = true ORDER BY a.createdAt DESC")
    List<Article> findPublishedArticles();
    
    @Query("SELECT a FROM Article a WHERE a.status = true ORDER BY a.createdAt DESC")
    Page<Article> findPublishedArticles(Pageable pageable);

    // Featured articles - using published articles ordered by view count as featured
    @Query("SELECT a FROM Article a WHERE a.status = true ORDER BY a.viewCount DESC")
    List<Article> findFeaturedArticles();
    
    @Query("SELECT a FROM Article a WHERE a.status = true ORDER BY a.viewCount DESC")
    Page<Article> findFeaturedArticles(Pageable pageable);

    // Search queries
    @Query("SELECT a FROM Article a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "a.status = true")
    List<Article> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT a FROM Article a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "a.status = true")
    Page<Article> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Category-based queries
    @Query("SELECT a FROM Article a " +
           "JOIN a.categories c " +
           "WHERE c.id = :categoryId AND a.status = true")
    List<Article> findByCategoryId(@Param("categoryId") Integer categoryId);
    
    @Query("SELECT a FROM Article a " +
           "JOIN a.categories c " +
           "WHERE c.id = :categoryId AND a.status = true")
    Page<Article> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);

    // Tag-based queries
    @Query("SELECT a FROM Article a " +
           "JOIN a.tags t " +
           "WHERE t.id = :tagId AND a.status = true")
    List<Article> findByTagId(@Param("tagId") Integer tagId);
    
    @Query("SELECT a FROM Article a " +
           "JOIN a.tags t " +
           "WHERE t.id = :tagId AND a.status = true")
    Page<Article> findByTagId(@Param("tagId") Integer tagId, Pageable pageable);

    // Popular articles (by view count)
    @Query("SELECT a FROM Article a WHERE a.status = true ORDER BY a.viewCount DESC")
    List<Article> findPopularArticles(Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.status = true AND a.createdAt >= :since ORDER BY a.viewCount DESC")
    List<Article> findPopularArticlesSince(@Param("since") LocalDateTime since, Pageable pageable);

    // Recent articles
    @Query("SELECT a FROM Article a WHERE a.status = true ORDER BY a.createdAt DESC")
    List<Article> findRecentArticles(Pageable pageable);

    // Articles by date range
    @Query("SELECT a FROM Article a WHERE " +
           "a.createdAt >= :startDate AND a.createdAt <= :endDate AND " +
           "a.status = true " +
           "ORDER BY a.createdAt DESC")
    List<Article> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Article a WHERE " +
           "a.createdAt >= :startDate AND a.createdAt <= :endDate AND " +
           "a.status = true " +
           "ORDER BY a.createdAt DESC")
    Page<Article> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate,
                                 Pageable pageable);

    // Related articles (by shared categories)
    @Query("SELECT DISTINCT a FROM Article a " +
           "JOIN a.categories c " +
           "WHERE c IN (" +
           "   SELECT c2 FROM Article a2 " +
           "   JOIN a2.categories c2 " +
           "   WHERE a2.id = :articleId" +
           ") AND a.id != :articleId AND a.status = true")
    List<Article> findRelatedArticles(@Param("articleId") Integer articleId, Pageable pageable);

    // Update view count
    @Modifying
    @Query("UPDATE Article a SET a.viewCount = a.viewCount + 1 WHERE a.id = :id")
    void incrementViewCount(@Param("id") Integer id);

    // Statistical queries
    @Query("SELECT COUNT(a) FROM Article a WHERE a.status = true")
    Long countPublishedArticles();
    
    @Query("SELECT COUNT(a) FROM Article a WHERE a.author.id = :authorId AND a.status = true")
    Long countPublishedArticlesByAuthor(@Param("authorId") Integer authorId);
    
    @Query("SELECT COUNT(a) FROM Article a WHERE a.status = :status")
    Long countByStatus(@Param("status") Boolean status);

    // Complex search with filters - simplified without featured field
    @Query("SELECT a FROM Article a " +
           "LEFT JOIN a.categories c " +
           "WHERE " +
           "(:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:authorId IS NULL OR a.author.id = :authorId) AND " +
           "(:categoryId IS NULL OR c.id = :categoryId) AND " +
           "a.status = true " +
           "ORDER BY a.createdAt DESC")
    Page<Article> findWithFilters(@Param("keyword") String keyword,
                                 @Param("authorId") Integer authorId,
                                 @Param("categoryId") Integer categoryId,
                                 Pageable pageable);
}
