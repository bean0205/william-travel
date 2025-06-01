package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores travel articles and blog posts
 */
@Entity
@Table(name = "article")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {

    /**
     * Unique identifier for each article
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Reference to the user who authored this article
     */
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    /**
     * Article title
     */
    @Column(name = "title", length = 255, nullable = false)
    private String title;

    /**
     * URL-friendly slug for the article
     */
    @Column(name = "slug", length = 255, unique = true)
    private String slug;

    /**
     * Code for translation purposes
     */
    @Column(name = "title_code", length = 255)
    private String titleCode;

    /**
     * Short description or excerpt of the article
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    /**
     * Full article content
     */
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * Reference to the country the article is about
     */
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    /**
     * Reference to the region the article is about
     */
    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    /**
     * Reference to the district the article is about
     */
    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    /**
     * Reference to the ward the article is about
     */
    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    /**
     * URL to the thumbnail image
     */
    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    /**
     * Number of times the article has been viewed
     */
    @Column(name = "view_count")
    private Integer viewCount;

    /**
     * Whether the article is active/published
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when article was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when article was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Categories associated with this article
     */
    @ManyToMany
    @JoinTable(
        name = "article_article_categories",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "article_categories_id")
    )
    private Set<ArticleCategory> categories = new HashSet<>();
    
    /**
     * Tags associated with this article
     */
    @ManyToMany
    @JoinTable(
        name = "article_article_tags",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "article_tags_id")
    )
    private Set<ArticleTag> tags = new HashSet<>();
    
    /**
     * Comments on this article
     */
    @OneToMany(mappedBy = "article")
    private Set<ArticleComment> comments = new HashSet<>();
    
    /**
     * Reactions (likes, dislikes) to this article
     */
    @OneToMany(mappedBy = "article")
    private Set<ArticleReaction> reactions = new HashSet<>();
}
