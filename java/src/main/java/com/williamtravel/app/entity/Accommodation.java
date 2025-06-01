package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "accommodations")
@Data
public class Accommodation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "name_code", length = 255)
    private String nameCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "geom", columnDefinition = "TEXT")
    private String geom;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private AccommodationCategory category;

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @Column(name = "price_min")
    private Double priceMin;

    @Column(name = "price_max")
    private Double priceMax;

    @Column(name = "popularity_score")
    private Double popularityScore;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "checkin_time")
    private LocalTime checkinTime;

    @Column(name = "checkout_time")
    private LocalTime checkoutTime;

    @Column(name = "cancel_policy", columnDefinition = "TEXT")
    private String cancelPolicy;

    @Column(name = "pet_policy", columnDefinition = "TEXT")
    private String petPolicy;

    @Column(name = "child_policy", columnDefinition = "TEXT")
    private String childPolicy;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "accommodation")
    private Set<AccommodationRoom> rooms = new HashSet<>();

    @OneToMany
    @JoinColumn(name = "reference_id")
    @Where(clause = "reference_type = 'accommodation'")
    private Set<Media> media = new HashSet<>();
}
