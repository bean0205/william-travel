package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "community_post_reaction")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"user", "post", "comment"})
@ToString(exclude = {"user", "post", "comment"})
public class CommunityPostReaction extends BaseEntity {

    @Column(name = "reaction_type", length = 20, nullable = false)
    private String reactionType;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private CommunityPostComment comment;
}
