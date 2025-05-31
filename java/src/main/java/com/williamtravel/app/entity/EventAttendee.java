package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Records which users are attending which events
 */
@Entity
@Table(name = "event_attendee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventAttendee {

    /**
     * Unique identifier for each attendance record
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the user attending the event
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the event being attended
     */
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    /**
     * Whether the attendance is confirmed/active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when attendance was recorded
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when attendance was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
