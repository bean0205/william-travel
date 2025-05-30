package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "community_post_community_post_tags")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"post", "tag"})
@ToString(exclude = {"post", "tag"})
public class CommunityPostCommunityPostTag extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_post_tag_id", nullable = false)
    private CommunityPostTag tag;
}
