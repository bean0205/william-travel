package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores country information for geographic organization
 */
@Entity
@Table(name = "countries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Country {

    /**
     * Unique identifier for each country
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Country code (e.g. VN, US, JP)
     */
    @Column(name = "code", length = 10, nullable = false, unique = true)
    private String code;

    /**
     * Country name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 100)
    private String nameCode;

    /**
     * Description of the country
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    /**
     * URL to background image
     */
    @Column(name = "background_image", length = 255)
    private String backgroundImage;

    /**
     * URL to logo image
     */
    @Column(name = "logo", length = 255)
    private String logo;

    /**
     * Status: 1-active, 0-inactive
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * Date when record was created
     */
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    /**
     * Date when record was last updated
     */
    @Column(name = "updated_date")
    private LocalDate updatedDate;

    /**
     * Reference to the continent this country belongs to
     */
    @ManyToOne
    @JoinColumn(name = "continent_id", nullable = false)
    private Continent continent;
    
    @OneToMany(mappedBy = "country")
    private Set<Region> regions = new HashSet<>();
    
    @OneToMany(mappedBy = "country")
    private Set<Location> locations = new HashSet<>();
    
    @OneToMany(mappedBy = "country")
    private Set<Accommodation> accommodations = new HashSet<>();
    
    @OneToMany(mappedBy = "country")
    private Set<Food> foods = new HashSet<>();
    
    @OneToMany(mappedBy = "country")
    private Set<Article> articles = new HashSet<>();
    
    @OneToMany(mappedBy = "country")
    private Set<Event> events = new HashSet<>();
}
