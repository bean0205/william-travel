package com.william.travel.repository;

import com.william.travel.entity.ArticleArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleArticleTagRepository extends JpaRepository<ArticleArticleTag, Long> {
    
    @Query("SELECT aat FROM ArticleArticleTag aat WHERE aat.article.id = :articleId")
    List<ArticleArticleTag> findByArticleId(@Param("articleId") Long articleId);
    
    @Query("SELECT aat FROM ArticleArticleTag aat WHERE aat.tag.id = :tagId")
    List<ArticleArticleTag> findByTagId(@Param("tagId") Long tagId);
    
    @Query("SELECT aat FROM ArticleArticleTag aat WHERE aat.article.id = :articleId AND aat.tag.id = :tagId")
    ArticleArticleTag findByArticleIdAndTagId(@Param("articleId") Long articleId, @Param("tagId") Long tagId);
    
    void deleteByArticleIdAndTagId(Long articleId, Long tagId);
    
    void deleteByArticleId(Long articleId);
}
