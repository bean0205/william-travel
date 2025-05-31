package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Stores information about food and restaurant items
 */
@Entity
@Table(name = "food")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {

    /**
     * Unique identifier for each food item
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Food name
     */
    @Column(name = "name", length = 255, nullable = false)
    private String name;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 255)
    private String nameCode;

    /**
     * Description of the food
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

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
     * Reference to the food category
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private FoodCategory category;

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
     * Whether the food item is active/available
     */
    @Column(name = "status", nullable = false)
    private Boolean status;

    /**
     * Timestamp when food was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when food was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
