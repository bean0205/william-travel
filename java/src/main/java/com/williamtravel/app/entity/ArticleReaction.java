package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Stores user reactions (likes) on articles
 */
@Entity
@Table(name = "article_reaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleReaction {

    /**
     * Unique identifier for each article reaction
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the user who reacted
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the article being reacted to
     */
    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    /**
     * Whether the reaction is active (like/unlike status)
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
