package com.william.travel.repository;

import com.william.travel.entity.ArticleArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleArticleCategoryRepository extends JpaRepository<ArticleArticleCategory, Long> {
    
    @Query("SELECT aac FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId")
    List<ArticleArticleCategory> findByArticleId(@Param("articleId") Long articleId);
    
    @Query("SELECT aac FROM ArticleArticleCategory aac WHERE aac.category.id = :categoryId")
    List<ArticleArticleCategory> findByCategoryId(@Param("categoryId") Long categoryId);
    
    @Query("SELECT aac FROM ArticleArticleCategory aac WHERE aac.article.id = :articleId AND aac.category.id = :categoryId")
    ArticleArticleCategory findByArticleIdAndCategoryId(@Param("articleId") Long articleId, @Param("categoryId") Long categoryId);
    
    void deleteByArticleIdAndCategoryId(Long articleId, Long categoryId);
    
    void deleteByArticleId(Long articleId);
}
