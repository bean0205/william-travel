package com.william.travel.repository;

import com.william.travel.entity.ArticleReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleReactionRepository extends JpaRepository<ArticleReaction, Long> {
    
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.article.id = :articleId")
    List<ArticleReaction> findByArticleId(@Param("articleId") Long articleId);
    
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.user.id = :userId AND ar.article.id = :articleId")
    Optional<ArticleReaction> findByUserIdAndArticleId(@Param("userId") Long userId, @Param("articleId") Long articleId);
    
    @Query("SELECT ar FROM ArticleReaction ar WHERE ar.user.id = :userId")
    List<ArticleReaction> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(ar) FROM ArticleReaction ar WHERE ar.article.id = :articleId AND ar.reactionType = :reactionType")
    Long countByArticleIdAndReactionType(@Param("articleId") Long articleId, @Param("reactionType") String reactionType);
    
    @Query("SELECT COUNT(ar) FROM ArticleReaction ar WHERE ar.article.id = :articleId")
    Long countByArticleId(@Param("articleId") Long articleId);
    
    @Query("SELECT ar.reactionType, COUNT(ar) FROM ArticleReaction ar WHERE ar.article.id = :articleId GROUP BY ar.reactionType")
    List<Object[]> countReactionsByTypeForArticle(@Param("articleId") Long articleId);
}
