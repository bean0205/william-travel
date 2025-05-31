package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Junction table linking community posts to their tags
 */
@Entity
@Table(name = "community_post_community_post_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostCommunityPostTag {

    /**
     * Unique identifier for each post-tag relationship
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the community post
     */
    @ManyToOne
    @JoinColumn(name = "community_post_id", nullable = false)
    private CommunityPost communityPost;

    /**
     * Reference to the community post tag
     */
    @ManyToOne
    @JoinColumn(name = "community_post_tag_id", nullable = false)
    private CommunityPostTag communityPostTag;
}