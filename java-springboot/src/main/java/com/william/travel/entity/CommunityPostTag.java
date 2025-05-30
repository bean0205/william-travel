package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "community_post_tags")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"posts"})
@ToString(exclude = {"posts"})
public class CommunityPostTag extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @OneToMany(mappedBy = "tag", fetch = FetchType.LAZY)
    private Set<CommunityPostCommunityPostTag> posts = new HashSet<>();
}
