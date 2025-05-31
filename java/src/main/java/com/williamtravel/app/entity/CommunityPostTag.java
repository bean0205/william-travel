package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores tags for categorizing and labeling community posts
 */
@Entity
@Table(name = "community_post_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostTag {

    /**
     * Unique identifier for each community post tag
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * Tag name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Whether the tag is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when tag was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when tag was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Posts using this tag
     */
    @ManyToMany(mappedBy = "tags")
    private Set<CommunityPost> posts = new HashSet<>();
}