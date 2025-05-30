package com.william.travel.repository;

import com.william.travel.entity.CommunityPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    
    @Query("SELECT cp FROM CommunityPost cp WHERE cp.status = true ORDER BY cp.createdAt DESC")
    Page<CommunityPost> findActivePosts(Pageable pageable);
    
    @Query("SELECT cp FROM CommunityPost cp WHERE cp.user.id = :userId AND cp.status = true ORDER BY cp.createdAt DESC")
    Page<CommunityPost> findActiveByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT cp FROM CommunityPost cp WHERE cp.category.id = :categoryId AND cp.status = true ORDER BY cp.createdAt DESC")
    Page<CommunityPost> findActiveByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT cp FROM CommunityPost cp JOIN cp.tags cpt WHERE cpt.tag.id = :tagId AND cp.status = true ORDER BY cp.createdAt DESC")
    Page<CommunityPost> findActiveByTagId(@Param("tagId") Long tagId, Pageable pageable);
    
    @Query("SELECT cp FROM CommunityPost cp WHERE " +
           "(LOWER(cp.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(cp.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "cp.status = true ORDER BY cp.createdAt DESC")
    Page<CommunityPost> findActiveBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT cp FROM CommunityPost cp WHERE cp.status = true ORDER BY cp.viewCount DESC")
    Page<CommunityPost> findMostViewedPosts(Pageable pageable);
    
    @Query("SELECT COUNT(cp) FROM CommunityPost cp WHERE cp.user.id = :userId AND cp.status = true")
    Long countActiveByUserId(@Param("userId") Long userId);
}
