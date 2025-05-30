package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "community_post")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"user", "category", "comments", "reactions", "tags", "media"})
@ToString(exclude = {"user", "category", "comments", "reactions", "tags", "media"})
public class CommunityPost extends BaseEntity {

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CommunityPostCategory category;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private Set<CommunityPostComment> comments = new HashSet<>();

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private Set<CommunityPostReaction> reactions = new HashSet<>();

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private Set<CommunityPostCommunityPostTag> tags = new HashSet<>();

    @OneToMany(mappedBy = "communityPost", fetch = FetchType.LAZY)
    private Set<Media> media = new HashSet<>();
}
