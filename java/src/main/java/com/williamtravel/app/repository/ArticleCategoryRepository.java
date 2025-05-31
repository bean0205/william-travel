package com.williamtravel.app.repository;

import com.williamtravel.app.entity.ArticleCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ArticleCategory entity operations
 * Provides CRUD operations and custom queries for article category management
 */
@Repository
public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Integer> {

    // Basic finder methods
    Optional<ArticleCategory> findByName(String name);
    
    Optional<ArticleCategory> findBySlug(String slug);
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);

    // Status-based queries
    List<ArticleCategory> findByStatus(Boolean status);
    
    Page<ArticleCategory> findByStatus(Boolean status, Pageable pageable);
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.name ASC")
    List<ArticleCategory> findAllActiveOrderByName();

    // Search queries
    @Query("SELECT ac FROM ArticleCategory ac WHERE " +
           "(LOWER(ac.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(ac.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "ac.status = true")
    List<ArticleCategory> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE " +
           "(LOWER(ac.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(ac.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "ac.status = true")
    Page<ArticleCategory> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Categories with article count
    @Query("SELECT ac, COUNT(aac.article) FROM ArticleCategory ac " +
           "LEFT JOIN ac.articleCategories aac " +
           "LEFT JOIN aac.article a ON a.status = 'published' " +
           "WHERE ac.status = true " +
           "GROUP BY ac " +
           "ORDER BY ac.name ASC")
    List<Object[]> findCategoriesWithArticleCount();

    // Categories ordered by article count
    @Query("SELECT ac FROM ArticleCategory ac " +
           "LEFT JOIN ac.articleCategories aac " +
           "LEFT JOIN aac.article a ON a.status = 'published' " +
           "WHERE ac.status = true " +
           "GROUP BY ac " +
           "ORDER BY COUNT(a) DESC")
    List<ArticleCategory> findCategoriesOrderByArticleCount();
    
    @Query("SELECT ac FROM ArticleCategory ac " +
           "LEFT JOIN ac.articleCategories aac " +
           "LEFT JOIN aac.article a ON a.status = 'published' " +
           "WHERE ac.status = true " +
           "GROUP BY ac " +
           "ORDER BY COUNT(a) DESC")
    Page<ArticleCategory> findCategoriesOrderByArticleCount(Pageable pageable);

    // Categories with published articles
    @Query("SELECT DISTINCT ac FROM ArticleCategory ac " +
           "JOIN ac.articleCategories aac " +
           "JOIN aac.article a " +
           "WHERE ac.status = true AND a.status = 'published'")
    List<ArticleCategory> findCategoriesWithPublishedArticles();

    // Parent-child relationship queries
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.parentCategory IS NULL AND ac.status = true")
    List<ArticleCategory> findRootCategories();
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.parentCategory.id = :parentId AND ac.status = true")
    List<ArticleCategory> findByParentCategoryId(@Param("parentId") Integer parentId);
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.parentCategory IS NULL AND ac.status = true ORDER BY ac.name ASC")
    Page<ArticleCategory> findRootCategories(Pageable pageable);

    // Statistical queries
    @Query("SELECT COUNT(ac) FROM ArticleCategory ac WHERE ac.status = true")
    Long countActiveCategories();
    
    @Query("SELECT COUNT(a) FROM ArticleCategory ac " +
           "JOIN ac.articleCategories aac " +
           "JOIN aac.article a " +
           "WHERE ac.id = :categoryId AND ac.status = true AND a.status = 'published'")
    Long countPublishedArticlesInCategory(@Param("categoryId") Integer categoryId);

    // Recently created categories
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.createdAt DESC")
    List<ArticleCategory> findRecentCategories(Pageable pageable);

    // Popular categories (by total article views)
    @Query("SELECT ac FROM ArticleCategory ac " +
           "LEFT JOIN ac.articleCategories aac " +
           "LEFT JOIN aac.article a ON a.status = 'published' " +
           "WHERE ac.status = true " +
           "GROUP BY ac " +
           "ORDER BY COALESCE(SUM(a.viewCount), 0) DESC")
    List<ArticleCategory> findPopularCategories(Pageable pageable);

    // Featured categories
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.featured = true AND ac.status = true ORDER BY ac.sortOrder ASC, ac.name ASC")
    List<ArticleCategory> findFeaturedCategories();

    // Categories by sort order
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.sortOrder ASC, ac.name ASC")
    List<ArticleCategory> findAllOrderBySortOrder();
}
