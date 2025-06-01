package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores categories for organizing articles
 */
@Entity
@Table(name = "article_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleCategory {

    /**
     * Unique identifier for each article category
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
     * URL-friendly slug for the category
     */
    @Column(name = "slug", length = 100, unique = true)
    private String slug;

    /**
     * Whether the category is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Parent category for hierarchical organization
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_category_id")
    private ArticleCategory parentCategory;

    /**
     * Child categories
     */
    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ArticleCategory> childCategories = new HashSet<>();

    /**
     * Sort order for displaying categories
     */
    @Column(name = "sort_order")
    private Integer sortOrder;

    /**
     * Whether the category is featured
     */
    @Column(name = "is_featured")
    private Boolean isFeatured;

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
     * Articles belonging to this category
     */
    @ManyToMany(mappedBy = "categories")
    private Set<Article> articles = new HashSet<>();
}
