package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "accommodations")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"user", "country", "region", "district", "ward", "category", "rooms", "media", "ratings"})
@ToString(exclude = {"user", "country", "region", "district", "ward", "category", "rooms", "media", "ratings"})
public class Accommodation extends BaseEntity {

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

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @Column(name = "price_min", precision = 10, scale = 2)
    private BigDecimal priceMin;

    @Column(name = "price_max", precision = 10, scale = 2)
    private BigDecimal priceMax;

    @Column(name = "popularity_score")
    private Double popularityScore = 0.0;

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
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id")
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private AccommodationCategory category;

    @OneToMany(mappedBy = "accommodation", fetch = FetchType.LAZY)
    private Set<AccommodationRoom> rooms = new HashSet<>();

    @OneToMany(mappedBy = "accommodation", fetch = FetchType.LAZY)
    private Set<Media> media = new HashSet<>();

    @OneToMany(mappedBy = "accommodation", fetch = FetchType.LAZY)
    private Set<Rating> ratings = new HashSet<>();
}
