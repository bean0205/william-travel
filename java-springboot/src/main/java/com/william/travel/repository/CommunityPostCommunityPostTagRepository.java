package com.william.travel.repository;

import com.william.travel.entity.CommunityPostCommunityPostTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostCommunityPostTagRepository extends JpaRepository<CommunityPostCommunityPostTag, Long> {
    
    @Query("SELECT cpcpt FROM CommunityPostCommunityPostTag cpcpt WHERE cpcpt.communityPost.id = :postId")
    List<CommunityPostCommunityPostTag> findByPostId(@Param("postId") Long postId);
    
    @Query("SELECT cpcpt FROM CommunityPostCommunityPostTag cpcpt WHERE cpcpt.tag.id = :tagId")
    List<CommunityPostCommunityPostTag> findByTagId(@Param("tagId") Long tagId);
    
    @Query("SELECT cpcpt FROM CommunityPostCommunityPostTag cpcpt WHERE cpcpt.communityPost.id = :postId AND cpcpt.tag.id = :tagId")
    CommunityPostCommunityPostTag findByPostIdAndTagId(@Param("postId") Long postId, @Param("tagId") Long tagId);
    
    void deleteByPostIdAndTagId(Long postId, Long tagId);
    
    void deleteByPostId(Long postId);
}
