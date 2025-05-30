package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "article_tags")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"articles"})
@ToString(exclude = {"articles"})
public class ArticleTag extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "name_code", length = 100)
    private String nameCode;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @OneToMany(mappedBy = "tag", fetch = FetchType.LAZY)
    private Set<ArticleArticleTag> articles = new HashSet<>();
}
