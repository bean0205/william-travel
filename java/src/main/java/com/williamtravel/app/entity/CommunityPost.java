package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores community posts and user-generated content
 */
@Entity
@Table(name = "community_post")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPost {

    /**
     * Unique identifier for each community post
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Reference to the user who created this post
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the post category
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private CommunityPostCategory category;

    /**
     * Post title
     */
    @Column(name = "title", length = 255, nullable = false)
    private String title;

    /**
     * Post content
     */
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * URL to the thumbnail image
     */
    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    /**
     * Number of times the post has been viewed
     */
    @Column(name = "view_count")
    private Integer viewCount;

    /**
     * Whether the post is active/published
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when post was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when post was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Comments on this post
     */
    @OneToMany(mappedBy = "post")
    private Set<CommunityPostComment> comments = new HashSet<>();

    /**
     * Reactions (likes, dislikes) to this post
     */
    @OneToMany(mappedBy = "post")
    private Set<CommunityPostReaction> reactions = new HashSet<>();

    /**
     * Tags associated with this post
     */
    @ManyToMany
    @JoinTable(
        name = "community_post_community_post_tags",
        joinColumns = @JoinColumn(name = "community_post_id"),
        inverseJoinColumns = @JoinColumn(name = "community_post_tag_id")
    )
    private Set<CommunityPostTag> tags = new HashSet<>();
}