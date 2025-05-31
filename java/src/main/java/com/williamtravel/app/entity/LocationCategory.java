package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Categories for different types of locations (beach, mountain, historical site, etc.)
 */
@Entity
@Table(name = "location_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationCategory {

    /**
     * Unique identifier for each location category
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Category name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Whether the category is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when category was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when category was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "category")
    private Set<Location> locations = new HashSet<>();
}
