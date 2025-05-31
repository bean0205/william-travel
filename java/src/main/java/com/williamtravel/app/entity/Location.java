package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Stores tourist locations and points of interest
 */
@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    /**
     * Unique identifier for each location
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Location name
     */
    @Column(name = "name", length = 255, nullable = false)
    private String name;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 255)
    private String nameCode;

    /**
     * Description of the location
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    /**
     * GPS latitude coordinate
     */
    @Column(name = "latitude")
    private Double latitude;

    /**
     * GPS longitude coordinate
     */
    @Column(name = "longitude")
    private Double longitude;

    /**
     * Geospatial data
     */
    @Column(name = "geom", columnDefinition = "TEXT")
    private String geom;

    /**
     * Street address
     */
    @Column(name = "address", length = 255)
    private String address;

    /**
     * City name
     */
    @Column(name = "city", length = 100)
    private String city;

    /**
     * Reference to the country
     */
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    /**
     * Reference to the region
     */
    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    /**
     * Reference to the district
     */
    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    /**
     * Reference to the ward
     */
    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    /**
     * Reference to the location category
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private LocationCategory category;

    /**
     * URL to thumbnail image
     */
    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    /**
     * Minimum price range
     */
    @Column(name = "price_min")
    private Double priceMin;

    /**
     * Maximum price range
     */
    @Column(name = "price_max")
    private Double priceMax;

    /**
     * Popularity score for ranking
     */
    @Column(name = "popularity_score")
    private Double popularityScore;

    /**
     * Whether the location is active/visible
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    /**
     * Timestamp when location was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when location was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
