package com.william.travel.repository;

import com.william.travel.entity.CommunityPostReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityPostReactionRepository extends JpaRepository<CommunityPostReaction, Long> {
    
    @Query("SELECT cpr FROM CommunityPostReaction cpr WHERE cpr.post.id = :postId AND cpr.status = true")
    List<CommunityPostReaction> findByPostId(@Param("postId") Long postId);
    
    @Query("SELECT cpr FROM CommunityPostReaction cpr WHERE cpr.user.id = :userId AND cpr.post.id = :postId AND cpr.status = true")
    Optional<CommunityPostReaction> findByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);
    
    @Query("SELECT cpr FROM CommunityPostReaction cpr WHERE cpr.comment.id = :commentId AND cpr.status = true")
    List<CommunityPostReaction> findByCommentId(@Param("commentId") Long commentId);
    
    @Query("SELECT cpr FROM CommunityPostReaction cpr WHERE cpr.user.id = :userId AND cpr.comment.id = :commentId AND cpr.status = true")
    Optional<CommunityPostReaction> findByUserIdAndCommentId(@Param("userId") Long userId, @Param("commentId") Long commentId);
    
    @Query("SELECT cpr FROM CommunityPostReaction cpr WHERE cpr.user.id = :userId AND cpr.status = true")
    List<CommunityPostReaction> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(cpr) FROM CommunityPostReaction cpr WHERE cpr.post.id = :postId AND cpr.reactionType = :reactionType AND cpr.status = true")
    Long countByPostIdAndReactionType(@Param("postId") Long postId, @Param("reactionType") String reactionType);
    
    @Query("SELECT COUNT(cpr) FROM CommunityPostReaction cpr WHERE cpr.comment.id = :commentId AND cpr.reactionType = :reactionType AND cpr.status = true")
    Long countByCommentIdAndReactionType(@Param("commentId") Long commentId, @Param("reactionType") String reactionType);
    
    @Query("SELECT COUNT(cpr) FROM CommunityPostReaction cpr WHERE cpr.post.id = :postId AND cpr.status = true")
    Long countByPostId(@Param("postId") Long postId);
    
    @Query("SELECT COUNT(cpr) FROM CommunityPostReaction cpr WHERE cpr.comment.id = :commentId AND cpr.status = true")
    Long countByCommentId(@Param("commentId") Long commentId);
    
    @Query("SELECT cpr.reactionType, COUNT(cpr) FROM CommunityPostReaction cpr WHERE cpr.post.id = :postId AND cpr.status = true GROUP BY cpr.reactionType")
    List<Object[]> countReactionsByTypeForPost(@Param("postId") Long postId);
    
    @Query("SELECT cpr.reactionType, COUNT(cpr) FROM CommunityPostReaction cpr WHERE cpr.comment.id = :commentId AND cpr.status = true GROUP BY cpr.reactionType")
    List<Object[]> countReactionsByTypeForComment(@Param("commentId") Long commentId);
}
