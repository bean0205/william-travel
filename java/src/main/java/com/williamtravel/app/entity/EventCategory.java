package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Categorizes events by their type
 */
@Entity
@Table(name = "event_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventCategory {

    /**
     * Unique identifier for each event category
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Category name (e.g. Festival, Concert, Workshop)
     */
    @Column(name = "name", nullable = false, length = 100)
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
    private Set<Event> events = new HashSet<>();
}
