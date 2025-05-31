package com.williamtravel.app.repository;

import com.williamtravel.app.entity.ArticleArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for ArticleArticleTag entity operations
 * Provides CRUD operations and custom queries for article-tag relationships
 */
@Repository
public interface ArticleArticleTagRepository extends JpaRepository<ArticleArticleTag, Integer> {

    // Find by article
    @Query("SELECT aat FROM ArticleArticleTag aat WHERE aat.article.id = :articleId")
    List<ArticleArticleTag> findByArticleId(@Param("articleId") Integer articleId);

    // Find by tag
    @Query("SELECT aat FROM ArticleArticleTag aat WHERE aat.articleTag.id = :tagId")
    List<ArticleArticleTag> findByTagId(@Param("tagId") Integer tagId);

    // Find specific relationship
    @Query("SELECT aat FROM ArticleArticleTag aat WHERE aat.article.id = :articleId AND aat.articleTag.id = :tagId")
    ArticleArticleTag findByArticleIdAndTagId(@Param("articleId") Integer articleId, 
                                            @Param("tagId") Integer tagId);

    // Check if relationship exists
    @Query("SELECT COUNT(aat) > 0 FROM ArticleArticleTag aat WHERE aat.article.id = :articleId AND aat.articleTag.id = :tagId")
    boolean existsByArticleIdAndTagId(@Param("articleId") Integer articleId, 
                                     @Param("tagId") Integer tagId);

    // Delete by article
    @Modifying
    @Query("DELETE FROM ArticleArticleTag aat WHERE aat.article.id = :articleId")
    void deleteByArticleId(@Param("articleId") Integer articleId);

    // Delete by tag
    @Modifying
    @Query("DELETE FROM ArticleArticleTag aat WHERE aat.articleTag.id = :tagId")
    void deleteByTagId(@Param("tagId") Integer tagId);

    // Delete specific relationship
    @Modifying
    @Query("DELETE FROM ArticleArticleTag aat WHERE aat.article.id = :articleId AND aat.articleTag.id = :tagId")
    void deleteByArticleIdAndTagId(@Param("articleId") Integer articleId, 
                                  @Param("tagId") Integer tagId);

    // Count articles with tag
    @Query("SELECT COUNT(aat) FROM ArticleArticleTag aat WHERE aat.articleTag.id = :tagId")
    Long countArticlesWithTag(@Param("tagId") Integer tagId);

    // Count tags for article
    @Query("SELECT COUNT(aat) FROM ArticleArticleTag aat WHERE aat.article.id = :articleId")
    Long countTagsForArticle(@Param("articleId") Integer articleId);

    // Find articles with multiple tags
    @Query("SELECT aat.article.id FROM ArticleArticleTag aat WHERE aat.articleTag.id IN :tagIds GROUP BY aat.article.id HAVING COUNT(DISTINCT aat.articleTag.id) = :tagCount")
    List<Integer> findArticleIdsWithAllTags(@Param("tagIds") List<Integer> tagIds, 
                                           @Param("tagCount") Long tagCount);

    // Find tag usage statistics
    @Query("SELECT aat.articleTag.id, aat.articleTag.name, COUNT(aat.article) FROM ArticleArticleTag aat GROUP BY aat.articleTag.id, aat.articleTag.name ORDER BY COUNT(aat.article) DESC")
    List<Object[]> findTagUsageStatistics();
}
