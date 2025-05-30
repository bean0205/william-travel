package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "article_categories")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"articles"})
@ToString(exclude = {"articles"})
public class ArticleCategory extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private Set<ArticleArticleCategory> articles = new HashSet<>();
}
