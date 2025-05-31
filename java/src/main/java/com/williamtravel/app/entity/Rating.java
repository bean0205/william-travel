package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Stores user ratings and reviews for different entities
 */
@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {

    /**
     * Unique identifier for each rating
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * ID of the item being rated
     */
    @Column(name = "reference_id", nullable = false)
    private Integer referenceId;

    /**
     * Type of item being rated (location, accommodation, food, etc.)
     */
    @Column(name = "reference_type", length = 50, nullable = false)
    private String referenceType;

    /**
     * Reference to the user who created the rating
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Rating value (usually 1-5)
     */
    @Column(name = "rating", nullable = false)
    private Double rating;

    /**
     * Review comment
     */
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    /**
     * Timestamp when rating was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
