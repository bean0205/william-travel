package com.william.travel.repository;

import com.william.travel.entity.CommunityPostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostCommentRepository extends JpaRepository<CommunityPostComment, Long> {
    
    @Query("SELECT cpc FROM CommunityPostComment cpc WHERE cpc.communityPost.id = :postId AND cpc.status = 1 ORDER BY cpc.createdAt DESC")
    Page<CommunityPostComment> findByPostId(@Param("postId") Long postId, Pageable pageable);
    
    @Query("SELECT cpc FROM CommunityPostComment cpc WHERE cpc.communityPost.id = :postId AND cpc.parentComment IS NULL AND cpc.status = 1 ORDER BY cpc.createdAt DESC")
    Page<CommunityPostComment> findTopLevelByPostId(@Param("postId") Long postId, Pageable pageable);
    
    @Query("SELECT cpc FROM CommunityPostComment cpc WHERE cpc.parentComment.id = :parentCommentId AND cpc.status = 1 ORDER BY cpc.createdAt ASC")
    List<CommunityPostComment> findRepliesByParentCommentId(@Param("parentCommentId") Long parentCommentId);
    
    @Query("SELECT cpc FROM CommunityPostComment cpc WHERE cpc.user.id = :userId AND cpc.status = 1 ORDER BY cpc.createdAt DESC")
    Page<CommunityPostComment> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT COUNT(cpc) FROM CommunityPostComment cpc WHERE cpc.communityPost.id = :postId AND cpc.status = 1")
    Long countByPostId(@Param("postId") Long postId);
    
    @Query("SELECT COUNT(cpc) FROM CommunityPostComment cpc WHERE cpc.parentComment.id = :parentCommentId AND cpc.status = 1")
    Long countRepliesByParentCommentId(@Param("parentCommentId") Long parentCommentId);
}
