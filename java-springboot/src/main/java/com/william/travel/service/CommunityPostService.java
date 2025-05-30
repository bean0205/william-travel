package com.william.travel.service;

import com.william.travel.entity.CommunityPost;
import com.william.travel.entity.CommunityPostCategory;
import com.william.travel.entity.CommunityPostTag;
import com.william.travel.entity.CommunityPostCommunityPostTag;
import com.william.travel.entity.User;
import com.william.travel.repository.CommunityPostRepository;
import com.william.travel.repository.CommunityPostCategoryRepository;
import com.william.travel.repository.CommunityPostTagRepository;
import com.william.travel.repository.CommunityPostCommunityPostTagRepository;
import com.william.travel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityPostService {

    private final CommunityPostRepository communityPostRepository;
    private final CommunityPostCategoryRepository communityPostCategoryRepository;
    private final CommunityPostTagRepository communityPostTagRepository;
    private final CommunityPostCommunityPostTagRepository communityPostCommunityPostTagRepository;
    private final UserRepository userRepository;

    // CRUD Operations
    
    @Transactional
    public CommunityPost createCommunityPost(CommunityPost post, Long userId) {
        log.debug("Creating community post: {} for user: {}", post.getTitle(), userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        post.setUser(user);
        post.setStatus(true);
        post.setViewCount(0);
        
        return communityPostRepository.save(post);
    }

    @Transactional
    public CommunityPost createCommunityPostWithTags(CommunityPost post, Long userId, Set<Long> tagIds) {
        log.debug("Creating community post with tags: {} for user: {}", post.getTitle(), userId);
        
        CommunityPost savedPost = createCommunityPost(post, userId);
        
        // Assign tags if provided
        if (tagIds != null && !tagIds.isEmpty()) {
            assignTagsToPost(savedPost.getId(), tagIds);
        }
        
        return savedPost;
    }

    @Transactional
    public CommunityPost updateCommunityPost(Long id, CommunityPost updatedPost) {
        log.debug("Updating community post with id: {}", id);
        
        CommunityPost existingPost = communityPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + id));

        // Update fields
        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());
        existingPost.setThumbnailUrl(updatedPost.getThumbnailUrl());
        
        if (updatedPost.getCategory() != null) {
            existingPost.setCategory(updatedPost.getCategory());
        }

        return communityPostRepository.save(existingPost);
    }

    @Transactional
    public void deleteCommunityPost(Long id) {
        log.debug("Soft deleting community post with id: {}", id);
        
        CommunityPost post = communityPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + id));
        
        post.setStatus(false);
        communityPostRepository.save(post);
    }

    @Transactional
    public void hardDeleteCommunityPost(Long id) {
        log.debug("Hard deleting community post with id: {}", id);
        
        // First delete all tag associations
        List<CommunityPostCommunityPostTag> tagAssociations = 
            communityPostCommunityPostTagRepository.findByPostId(id);
        communityPostCommunityPostTagRepository.deleteAll(tagAssociations);
        
        // Then delete the post
        communityPostRepository.deleteById(id);
    }

    // Read Operations

    public Optional<CommunityPost> getCommunityPostById(Long id) {
        log.debug("Finding community post by id: {}", id);
        return communityPostRepository.findById(id);
    }

    public Page<CommunityPost> getAllActiveCommunityPosts(Pageable pageable) {
        log.debug("Finding all active community posts with pagination");
        return communityPostRepository.findActivePosts(pageable);
    }

    public Page<CommunityPost> searchCommunityPosts(String searchTerm, Pageable pageable) {
        log.debug("Searching community posts by term: {}", searchTerm);
        return communityPostRepository.findActiveBySearchTerm(searchTerm, pageable);
    }

    // User-based searches

    public Page<CommunityPost> getCommunityPostsByUser(Long userId, Pageable pageable) {
        log.debug("Finding community posts by user id: {}", userId);
        return communityPostRepository.findActiveByUserId(userId, pageable);
    }

    // Category-based searches

    public Page<CommunityPost> getCommunityPostsByCategory(Long categoryId, Pageable pageable) {
        log.debug("Finding community posts by category id: {}", categoryId);
        return communityPostRepository.findActiveByCategoryId(categoryId, pageable);
    }

    // Tag-based searches

    public Page<CommunityPost> getCommunityPostsByTag(Long tagId, Pageable pageable) {
        log.debug("Finding community posts by tag id: {}", tagId);
        return communityPostRepository.findActiveByTagId(tagId, pageable);
    }

    // Popular posts

    public Page<CommunityPost> getMostViewedCommunityPosts(Pageable pageable) {
        log.debug("Finding most viewed community posts");
        return communityPostRepository.findMostViewedPosts(pageable);
    }

    // Utility Methods

    @Transactional
    public CommunityPost incrementViewCount(Long postId) {
        log.debug("Incrementing view count for community post: {}", postId);
        
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + postId));
        
        post.setViewCount(post.getViewCount() + 1);
        return communityPostRepository.save(post);
    }

    @Transactional
    public CommunityPost assignCategory(Long postId, Long categoryId) {
        log.debug("Assigning category {} to community post {}", categoryId, postId);
        
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + postId));
        
        CommunityPostCategory category = communityPostCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Community post category not found with id: " + categoryId));
        
        post.setCategory(category);
        return communityPostRepository.save(post);
    }

    @Transactional
    public void assignTagsToPost(Long postId, Set<Long> tagIds) {
        log.debug("Assigning tags {} to community post {}", tagIds, postId);
        
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + postId));
        
        // Remove existing tag associations
        List<CommunityPostCommunityPostTag> existingTags = 
            communityPostCommunityPostTagRepository.findByPostId(postId);
        communityPostCommunityPostTagRepository.deleteAll(existingTags);
        
        // Add new tag associations
        for (Long tagId : tagIds) {
            CommunityPostTag tag = communityPostTagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Community post tag not found with id: " + tagId));
            
            CommunityPostCommunityPostTag postTag = new CommunityPostCommunityPostTag();
            postTag.setPost(post);
            postTag.setTag(tag);
            communityPostCommunityPostTagRepository.save(postTag);
        }
    }

    @Transactional
    public void removeTagFromPost(Long postId, Long tagId) {
        log.debug("Removing tag {} from community post {}", tagId, postId);
        
        CommunityPostCommunityPostTag postTag = 
            communityPostCommunityPostTagRepository.findByPostIdAndTagId(postId, tagId)
                .orElseThrow(() -> new RuntimeException("Tag association not found"));
        
        communityPostCommunityPostTagRepository.delete(postTag);
    }

    @Transactional
    public void addTagToPost(Long postId, Long tagId) {
        log.debug("Adding tag {} to community post {}", tagId, postId);
        
        CommunityPost post = communityPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + postId));
        
        CommunityPostTag tag = communityPostTagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Community post tag not found with id: " + tagId));
        
        // Check if association already exists
        Optional<CommunityPostCommunityPostTag> existingAssociation = 
            communityPostCommunityPostTagRepository.findByPostIdAndTagId(postId, tagId);
        
        if (existingAssociation.isEmpty()) {
            CommunityPostCommunityPostTag postTag = new CommunityPostCommunityPostTag();
            postTag.setPost(post);
            postTag.setTag(tag);
            communityPostCommunityPostTagRepository.save(postTag);
        }
    }

    @Transactional
    public CommunityPost activateCommunityPost(Long id) {
        log.debug("Activating community post with id: {}", id);
        
        CommunityPost post = communityPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + id));
        
        post.setStatus(true);
        return communityPostRepository.save(post);
    }

    @Transactional
    public CommunityPost deactivateCommunityPost(Long id) {
        log.debug("Deactivating community post with id: {}", id);
        
        CommunityPost post = communityPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community post not found with id: " + id));
        
        post.setStatus(false);
        return communityPostRepository.save(post);
    }

    // Post status checks

    public boolean isCommunityPostActive(Long postId) {
        Optional<CommunityPost> postOpt = communityPostRepository.findById(postId);
        return postOpt.map(CommunityPost::getStatus).orElse(false);
    }

    public boolean canUserEditPost(Long postId, Long userId) {
        Optional<CommunityPost> postOpt = communityPostRepository.findById(postId);
        return postOpt.map(post -> post.getUser().getId().equals(userId)).orElse(false);
    }

    // Statistics

    public long getActiveCommunityPostCount() {
        log.debug("Getting count of active community posts");
        return communityPostRepository.findActivePosts(Pageable.unpaged()).getTotalElements();
    }

    public long getCommunityPostCountByUser(Long userId) {
        log.debug("Getting count of community posts by user: {}", userId);
        return communityPostRepository.countActiveByUserId(userId);
    }

    public long getCommunityPostCountByCategory(Long categoryId) {
        log.debug("Getting count of community posts in category: {}", categoryId);
        return communityPostRepository.findActiveByCategoryId(categoryId, Pageable.unpaged()).getTotalElements();
    }

    public long getCommunityPostCountByTag(Long tagId) {
        log.debug("Getting count of community posts with tag: {}", tagId);
        return communityPostRepository.findActiveByTagId(tagId, Pageable.unpaged()).getTotalElements();
    }
}
