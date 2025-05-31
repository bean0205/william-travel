package com.williamtravel.app.repository;

import com.williamtravel.app.entity.ArticleArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ArticleArticleCategory entity operations
 * Provides CRUD operations and custom queries for article-category relationships
 */
@Repository
public interface ArticleArticleCategoryRepository extends JpaRepository<ArticleArticleCategory, Integer> {

    // Find by article
    @Query("SELECT aac FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId")
    List<ArticleArticleCategory> findByArticleId(@Param("articleId") Integer articleId);

    // Find by category
    @Query("SELECT aac FROM ArticleArticleCategory aac WHERE aac.articleCategory.id = :categoryId")
    List<ArticleArticleCategory> findByCategoryId(@Param("categoryId") Integer categoryId);

    // Find specific relationship
    @Query("SELECT aac FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId AND aac.articleCategory.id = :categoryId")
    ArticleArticleCategory findByArticleIdAndCategoryId(@Param("articleId") Integer articleId, 
                                                       @Param("categoryId") Integer categoryId);

    // Check if relationship exists
    @Query("SELECT COUNT(aac) > 0 FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId AND aac.articleCategory.id = :categoryId")
    boolean existsByArticleIdAndCategoryId(@Param("articleId") Integer articleId, 
                                          @Param("categoryId") Integer categoryId);

    // Delete by article
    @Modifying
    @Query("DELETE FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId")
    void deleteByArticleId(@Param("articleId") Integer articleId);

    // Delete by category
    @Modifying
    @Query("DELETE FROM ArticleArticleCategory aac WHERE aac.articleCategory.id = :categoryId")
    void deleteByCategoryId(@Param("categoryId") Integer categoryId);

    // Delete specific relationship
    @Modifying
    @Query("DELETE FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId AND aac.articleCategory.id = :categoryId")
    void deleteByArticleIdAndCategoryId(@Param("articleId") Integer articleId, 
                                       @Param("categoryId") Integer categoryId);

    // Count articles in category
    @Query("SELECT COUNT(aac) FROM ArticleArticleCategory aac WHERE aac.articleCategory.id = :categoryId")
    Long countArticlesInCategory(@Param("categoryId") Integer categoryId);

    // Count categories for article
    @Query("SELECT COUNT(aac) FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId")
    Long countCategoriesForArticle(@Param("articleId") Integer articleId);

    // Find articles in multiple categories
    @Query("SELECT aac.article.id FROM ArticleArticleCategory aac WHERE aac.articleCategory.id IN :categoryIds GROUP BY aac.article.id HAVING COUNT(DISTINCT aac.articleCategory.id) = :categoryCount")
    List<Integer> findArticleIdsWithAllCategories(@Param("categoryIds") List<Integer> categoryIds, 
                                                  @Param("categoryCount") Long categoryCount);
}
