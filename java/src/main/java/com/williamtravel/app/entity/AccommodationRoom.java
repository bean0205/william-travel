package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Stores individual rooms within accommodations
 */
@Entity
@Table(name = "accommodation_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationRoom {

    /**
     * Unique identifier for each room
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the accommodation
     */
    @ManyToOne
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;

    /**
     * Room name or number
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code")
    private String nameCode;

    /**
     * Description of the room
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    /**
     * Maximum number of adults
     */
    @Column(name = "adult_capacity", nullable = false)
    private Integer adultCapacity;

    /**
     * Maximum number of children
     */
    @Column(name = "child_capacity")
    private Integer childCapacity;

    /**
     * Room area in square meters
     */
    @Column(name = "room_area")
    private Integer roomArea;

    /**
     * Description of bed configuration
     */
    @Column(name = "bed_capacity", length = 100)
    private String bedCapacity;

    /**
     * Status: 1-active, 0-inactive
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * Timestamp when room was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when room was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
