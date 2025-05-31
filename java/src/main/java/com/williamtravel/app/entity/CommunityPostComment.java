package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores user comments on community posts
 */
@Entity
@Table(name = "community_post_comment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostComment {

    /**
     * Unique identifier for each comment
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Reference to the user who created the comment
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the community post being commented on
     */
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    /**
     * Comment text content
     */
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * Reference to parent comment for nested replies
     */
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private CommunityPostComment parent;

    /**
     * Replies to this comment
     */
    @OneToMany(mappedBy = "parent")
    private Set<CommunityPostComment> replies = new HashSet<>();

    /**
     * Whether the comment is active/visible
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when comment was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when comment was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Reactions to this comment
     */
    @OneToMany(mappedBy = "comment")
    private Set<CommunityPostReaction> reactions = new HashSet<>();
}