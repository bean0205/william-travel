package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores information about events, festivals, and activities
 */
@Entity
@Table(name = "event")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    /**
     * Unique identifier for each event
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to the user who created this event
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Reference to the event organizer
     */
    @ManyToOne
    @JoinColumn(name = "organizer_id", nullable = false)
    private Organizer organizer;

    /**
     * Reference to the event category
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private EventCategory category;

    /**
     * Event name
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code")
    private String nameCode;

    /**
     * Short description of the event
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    /**
     * Full event details and information
     */
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    /**
     * Reference to the country where event takes place
     */
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    /**
     * Reference to the region where event takes place
     */
    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    /**
     * Reference to the district where event takes place
     */
    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    /**
     * Reference to the ward where event takes place
     */
    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    /**
     * URL to the thumbnail image
     */
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    /**
     * Number of times the event has been viewed
     */
    @Column(name = "view_count")
    private Integer viewCount;

    /**
     * Starting time of the event
     */
    @Column(name = "start_time")
    private LocalTime startTime;

    /**
     * Starting date of the event
     */
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /**
     * Ending date of the event
     */
    @Column(name = "end_date")
    private LocalDate endDate;

    /**
     * Ticket or entrance price
     */
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * Maximum number of attendees allowed
     */
    @Column(name = "max_attendees")
    private Integer maxAttendees;

    /**
     * Whether the event is active/published
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when event was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when event was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "event")
    private Set<EventAttendee> attendees = new HashSet<>();

    @OneToMany(mappedBy = "event")
    private Set<EventSponsor> sponsors = new HashSet<>();
}
