package com.williamtravel.app.repository;

import com.williamtravel.app.entity.ArticleTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ArticleTag entity operations
 * Provides CRUD operations and custom queries for article tag management
 */
@Repository
public interface ArticleTagRepository extends JpaRepository<ArticleTag, Integer> {

    // Basic finder methods
    Optional<ArticleTag> findByName(String name);
    
    Optional<ArticleTag> findBySlug(String slug);
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);

    // Status-based queries
    List<ArticleTag> findByStatus(Boolean status);
    
    Page<ArticleTag> findByStatus(Boolean status, Pageable pageable);
    
    @Query("SELECT at FROM ArticleTag at WHERE at.status = true ORDER BY at.name ASC")
    List<ArticleTag> findAllActiveOrderByName();

    // Search queries
    @Query("SELECT at FROM ArticleTag at WHERE " +
           "(LOWER(at.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(at.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "at.status = true")
    List<ArticleTag> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT at FROM ArticleTag at WHERE " +
           "(LOWER(at.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(at.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "at.status = true")
    Page<ArticleTag> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Tags with article count
    @Query("SELECT at, COUNT(aat.article) FROM ArticleTag at " +
           "LEFT JOIN at.articleTags aat " +
           "LEFT JOIN aat.article a ON a.status = 'published' " +
           "WHERE at.status = true " +
           "GROUP BY at " +
           "ORDER BY at.name ASC")
    List<Object[]> findTagsWithArticleCount();

    // Tags ordered by article count
    @Query("SELECT at FROM ArticleTag at " +
           "LEFT JOIN at.articleTags aat " +
           "LEFT JOIN aat.article a ON a.status = 'published' " +
           "WHERE at.status = true " +
           "GROUP BY at " +
           "ORDER BY COUNT(a) DESC")
    List<ArticleTag> findTagsOrderByArticleCount();
    
    @Query("SELECT at FROM ArticleTag at " +
           "LEFT JOIN at.articleTags aat " +
           "LEFT JOIN aat.article a ON a.status = 'published' " +
           "WHERE at.status = true " +
           "GROUP BY at " +
           "ORDER BY COUNT(a) DESC")
    Page<ArticleTag> findTagsOrderByArticleCount(Pageable pageable);

    // Tags with published articles
    @Query("SELECT DISTINCT at FROM ArticleTag at " +
           "JOIN at.articleTags aat " +
           "JOIN aat.article a " +
           "WHERE at.status = true AND a.status = 'published'")
    List<ArticleTag> findTagsWithPublishedArticles();

    // Popular tags (by usage count)
    @Query("SELECT at FROM ArticleTag at " +
           "JOIN at.articleTags aat " +
           "JOIN aat.article a " +
           "WHERE at.status = true AND a.status = 'published' " +
           "GROUP BY at " +
           "ORDER BY COUNT(a) DESC")
    List<ArticleTag> findPopularTags(Pageable pageable);

    // Tag cloud data (name and count)
    @Query("SELECT at.name, COUNT(a) FROM ArticleTag at " +
           "LEFT JOIN at.articleTags aat " +
           "LEFT JOIN aat.article a ON a.status = 'published' " +
           "WHERE at.status = true " +
           "GROUP BY at.name " +
           "ORDER BY COUNT(a) DESC")
    List<Object[]> findTagCloudData();

    // Related tags (tags used together with a specific tag)
    @Query("SELECT DISTINCT at FROM ArticleTag at " +
           "JOIN at.articleTags aat1 " +
           "JOIN aat1.article a " +
           "WHERE a.id IN (" +
           "   SELECT a2.id FROM ArticleTag at2 " +
           "   JOIN at2.articleTags aat2 " +
           "   JOIN aat2.article a2 " +
           "   WHERE at2.id = :tagId AND a2.status = 'published'" +
           ") AND at.id != :tagId AND at.status = true")
    List<ArticleTag> findRelatedTags(@Param("tagId") Integer tagId);

    // Statistical queries
    @Query("SELECT COUNT(at) FROM ArticleTag at WHERE at.status = true")
    Long countActiveTags();
    
    @Query("SELECT COUNT(a) FROM ArticleTag at " +
           "JOIN at.articleTags aat " +
           "JOIN aat.article a " +
           "WHERE at.id = :tagId AND at.status = true AND a.status = 'published'")
    Long countPublishedArticlesWithTag(@Param("tagId") Integer tagId);

    // Recently created tags
    @Query("SELECT at FROM ArticleTag at WHERE at.status = true ORDER BY at.createdAt DESC")
    List<ArticleTag> findRecentTags(Pageable pageable);

    // Tags by name starting with letter
    @Query("SELECT at FROM ArticleTag at WHERE " +
           "UPPER(at.name) LIKE UPPER(CONCAT(:letter, '%')) AND " +
           "at.status = true " +
           "ORDER BY at.name ASC")
    List<ArticleTag> findTagsStartingWith(@Param("letter") String letter);

    // Trending tags (based on recent article usage)
    @Query("SELECT at FROM ArticleTag at " +
           "JOIN at.articleTags aat " +
           "JOIN aat.article a " +
           "WHERE at.status = true AND a.status = 'published' " +
           "AND a.publishedAt >= :since " +
           "GROUP BY at " +
           "ORDER BY COUNT(a) DESC")
    List<ArticleTag> findTrendingTags(@Param("since") java.time.LocalDateTime since, Pageable pageable);
}
