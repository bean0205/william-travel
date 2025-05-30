package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "article_article_tags")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"article", "tag"})
@ToString(exclude = {"article", "tag"})
public class ArticleArticleTag extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private ArticleTag tag;
}
