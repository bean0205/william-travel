package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Stores user reactions (likes, dislikes) on community posts and comments
 */
@Entity
@Table(name = "community_post_reaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostReaction {

    /**
     * Unique identifier for each reaction
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Reference to the user who reacted
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the community post being reacted to
     */
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    /**
     * Type of reaction (like, dislike, etc.)
     */
    @Column(name = "reaction_type", length = 20, nullable = false)
    private String reactionType;

    /**
     * Reference to the comment being reacted to (optional)
     */
    @ManyToOne
    @JoinColumn(name = "comment_id")
    private CommunityPostComment comment;

    /**
     * Whether the reaction is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when reaction was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when reaction was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}