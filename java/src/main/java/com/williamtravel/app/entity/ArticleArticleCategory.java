package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Junction table linking articles to their categories
 */
@Entity
@Table(name = "article_article_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleArticleCategory {

    /**
     * Unique identifier for each article-category relationship
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the article
     */
    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    /**
     * Reference to the article category
     */
    @ManyToOne
    @JoinColumn(name = "article_categories_id", nullable = false)
    private ArticleCategory articleCategory;
}