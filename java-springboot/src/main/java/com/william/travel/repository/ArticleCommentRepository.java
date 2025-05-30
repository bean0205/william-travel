package com.william.travel.repository;

import com.william.travel.entity.ArticleComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleCommentRepository extends JpaRepository<ArticleComment, Long> {
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.article.id = :articleId AND ac.status = 1 ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findByArticleId(@Param("articleId") Long articleId, Pageable pageable);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.article.id = :articleId AND ac.parentComment IS NULL AND ac.status = 1 ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findTopLevelByArticleId(@Param("articleId") Long articleId, Pageable pageable);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.parentComment.id = :parentCommentId AND ac.status = 1 ORDER BY ac.createdAt ASC")
    List<ArticleComment> findRepliesByParentCommentId(@Param("parentCommentId") Long parentCommentId);
    
    @Query("SELECT ac FROM ArticleComment ac WHERE ac.user.id = :userId AND ac.status = 1 ORDER BY ac.createdAt DESC")
    Page<ArticleComment> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT COUNT(ac) FROM ArticleComment ac WHERE ac.article.id = :articleId AND ac.status = 1")
    Long countByArticleId(@Param("articleId") Long articleId);
    
    @Query("SELECT COUNT(ac) FROM ArticleComment ac WHERE ac.parentComment.id = :parentCommentId AND ac.status = 1")
    Long countRepliesByParentCommentId(@Param("parentCommentId") Long parentCommentId);
}
