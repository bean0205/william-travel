package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Junction table linking articles to their tags
 */
@Entity
@Table(name = "article_article_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleArticleTag {

    /**
     * Unique identifier for each article-tag relationship
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
     * Reference to the article tag
     */
    @ManyToOne
    @JoinColumn(name = "article_tags_id", nullable = false)
    private ArticleTag articleTag;
}