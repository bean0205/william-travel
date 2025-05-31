package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores region/state information within countries
 */
@Entity
@Table(name = "regions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    /**
     * Unique identifier for each region
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Region name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Region code
     */
    @Column(name = "code", length = 20, nullable = false)
    private String code;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 100)
    private String nameCode;

    /**
     * Description of the region
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
     * Reference to the country this region belongs to
     */
    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;
    
    @OneToMany(mappedBy = "region")
    private Set<District> districts = new HashSet<>();
    
    @OneToMany(mappedBy = "region")
    private Set<Location> locations = new HashSet<>();
    
    @OneToMany(mappedBy = "region")
    private Set<Accommodation> accommodations = new HashSet<>();
    
    @OneToMany(mappedBy = "region")
    private Set<Food> foods = new HashSet<>();
    
    @OneToMany(mappedBy = "region")
    private Set<Article> articles = new HashSet<>();
    
    @OneToMany(mappedBy = "region")
    private Set<Event> events = new HashSet<>();
}
