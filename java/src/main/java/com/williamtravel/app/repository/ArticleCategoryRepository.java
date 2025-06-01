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
    
    boolean existsByName(String name);
    
    Optional<ArticleCategory> findBySlug(String slug);
    
    boolean existsBySlug(String slug);

    // Status-based queries
    List<ArticleCategory> findByStatus(Boolean status);
    
    Page<ArticleCategory> findByStatus(Boolean status, Pageable pageable);
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.name ASC")
    List<ArticleCategory> findAllActiveOrderByName();

    // Search queries
    @Query("SELECT ac FROM ArticleCategory ac WHERE " +
           "LOWER(ac.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
           "ac.status = true")
    List<ArticleCategory> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE " +
           "LOWER(ac.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
           "ac.status = true")
    Page<ArticleCategory> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Categories with article count
    @Query("SELECT ac, COUNT(a) FROM ArticleCategory ac " +
           "LEFT JOIN ac.articles a " +
           "WHERE ac.status = true AND (a.status = true OR a IS NULL) " +
           "GROUP BY ac " +
           "ORDER BY ac.name ASC")
    List<Object[]> findCategoriesWithArticleCount();

    // Categories ordered by article count
    @Query("SELECT ac FROM ArticleCategory ac " +
           "LEFT JOIN ac.articles a " +
           "WHERE ac.status = true AND (a.status = true OR a IS NULL) " +
           "GROUP BY ac " +
           "ORDER BY COUNT(a) DESC")
    List<ArticleCategory> findCategoriesOrderByArticleCount();
    
    @Query("SELECT ac FROM ArticleCategory ac " +
           "LEFT JOIN ac.articles a " +
           "WHERE ac.status = true AND (a.status = true OR a IS NULL) " +
           "GROUP BY ac " +
           "ORDER BY COUNT(a) DESC")
    Page<ArticleCategory> findCategoriesOrderByArticleCount(Pageable pageable);

    // Categories with published articles
    @Query("SELECT DISTINCT ac FROM ArticleCategory ac " +
           "JOIN ac.articles aac " +
           "WHERE ac.status = true AND aac.status = true")
    List<ArticleCategory> findCategoriesWithPublishedArticles();

    // Statistical queries
    @Query("SELECT COUNT(ac) FROM ArticleCategory ac WHERE ac.status = true")
    Long countActiveCategories();
    
    @Query("SELECT COUNT(a) FROM ArticleCategory ac " +
           "JOIN ac.articles a " +
           "WHERE ac.id = :categoryId AND ac.status = true AND a.status = true")
    Long countPublishedArticlesInCategory(@Param("categoryId") Integer categoryId);

    // Recently created categories
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.createdAt DESC")
    List<ArticleCategory> findRecentCategories(Pageable pageable);

    // Popular categories (by article count)
    @Query("SELECT ac FROM ArticleCategory ac " +
           "LEFT JOIN ac.articles a " +
           "WHERE ac.status = true AND (a.status = true OR a IS NULL) " +
           "GROUP BY ac " +
           "ORDER BY COUNT(a) DESC")
    List<ArticleCategory> findPopularCategories(Pageable pageable);

    // Categories ordered by name
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.name ASC")
    List<ArticleCategory> findAllOrderByName();
    
    // Hierarchical queries
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true AND ac.parentCategory IS NULL ORDER BY ac.sortOrder ASC, ac.name ASC")
    List<ArticleCategory> findRootCategories();
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true AND ac.parentCategory IS NULL ORDER BY ac.sortOrder ASC, ac.name ASC")
    Page<ArticleCategory> findRootCategories(Pageable pageable);
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true AND ac.parentCategory.id = :parentCategoryId ORDER BY ac.sortOrder ASC, ac.name ASC")
    List<ArticleCategory> findByParentCategoryId(@Param("parentCategoryId") Integer parentCategoryId);
    
    // Featured categories
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true AND ac.isFeatured = true ORDER BY ac.sortOrder ASC, ac.name ASC")
    List<ArticleCategory> findFeaturedCategories();
    
    // Ordered by sort order
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.sortOrder ASC, ac.name ASC")
    List<ArticleCategory> findAllOrderBySortOrder();
}
