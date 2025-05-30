package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "community_post_comment")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"user", "post", "parent", "replies", "reactions"})
@ToString(exclude = {"user", "post", "parent", "replies", "reactions"})
public class CommunityPostComment extends BaseEntity {

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private CommunityPostComment parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private Set<CommunityPostComment> replies = new HashSet<>();

    @OneToMany(mappedBy = "comment", fetch = FetchType.LAZY)
    private Set<CommunityPostReaction> reactions = new HashSet<>();
}
