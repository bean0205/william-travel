package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores categories for organizing accommodations
 */
@Entity
@Table(name = "accommodations_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationCategory {

    /**
     * Unique identifier for each accommodation category
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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
    
    /**
     * Accommodations belonging to this category
     */
    @OneToMany(mappedBy = "category")
    private Set<Accommodation> accommodations = new HashSet<>();
}
