package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores information about event organizers and hosts
 */
@Entity
@Table(name = "organizer")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organizer {

    /**
     * Unique identifier for each organizer
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the user who manages this organizer profile
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Name of the organizing person or company
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code")
    private String nameCode;

    /**
     * Description of the organizer
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    /**
     * Contact email for the organizer
     */
    @Column(name = "email")
    private String email;

    /**
     * Contact phone number for the organizer
     */
    @Column(name = "phone", length = 20)
    private String phone;

    /**
     * Website URL of the organizer
     */
    @Column(name = "website")
    private String website;

    /**
     * Whether the organizer profile is active
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when organizer was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when organizer was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "organizer")
    private Set<Event> events = new HashSet<>();

    @OneToMany(mappedBy = "organizer")
    private Set<EventSponsor> sponsorships = new HashSet<>();
}
