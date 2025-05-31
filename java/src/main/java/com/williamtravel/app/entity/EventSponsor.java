package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Records organizations sponsoring events
 */
@Entity
@Table(name = "event_sponsor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventSponsor {

    /**
     * Unique identifier for each sponsorship record
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the sponsoring organizer
     */
    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private Organizer organizer;

    /**
     * Reference to the sponsored event
     */
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    /**
     * Whether the sponsorship is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when sponsorship was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when sponsorship was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
