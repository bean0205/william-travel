package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores tags for categorizing and labeling articles
 */
@Entity
@Table(name = "article_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleTag {

    /**
     * Unique identifier for each article tag
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Tag name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 100)
    private String nameCode;

    /**
     * Whether the tag is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when tag was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when tag was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Articles using this tag
     */
    @ManyToMany(mappedBy = "tags")
    private Set<Article> articles = new HashSet<>();
}
