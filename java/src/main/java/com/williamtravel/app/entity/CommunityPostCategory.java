package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores categories for organizing community posts
 */
@Entity
@Table(name = "community_post_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostCategory {

    /**
     * Unique identifier for each community post category
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Category name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;
    
    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 100)
    private String nameCode;
    
    /**
     * Category description
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    /**
     * Whether the category is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when category was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when category was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Posts belonging to this category
     */
    @OneToMany(mappedBy = "category")
    private Set<CommunityPost> posts = new HashSet<>();
}