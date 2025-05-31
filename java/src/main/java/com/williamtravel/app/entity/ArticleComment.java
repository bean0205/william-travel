package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Stores user comments on articles
 */
@Entity
@Table(name = "article_comment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleComment {

    /**
     * Unique identifier for each article comment
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the user who created the comment
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the article being commented on
     */
    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    /**
     * Comment text content
     */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

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
}
