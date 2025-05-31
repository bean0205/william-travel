package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores ward information within districts
 */
@Entity
@Table(name = "wards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ward {

    /**
     * Unique identifier for each ward
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Ward name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Ward code
     */
    @Column(name = "code", length = 20, nullable = false)
    private String code;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 100)
    private String nameCode;

    /**
     * Description of the ward
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
     * Reference to the district this ward belongs to
     */
    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false)
    private District district;
    
    @OneToMany(mappedBy = "ward")
    private Set<Location> locations = new HashSet<>();
    
    @OneToMany(mappedBy = "ward")
    private Set<Accommodation> accommodations = new HashSet<>();
    
    @OneToMany(mappedBy = "ward")
    private Set<Food> foods = new HashSet<>();
    
    @OneToMany(mappedBy = "ward")
    private Set<Article> articles = new HashSet<>();
    
    @OneToMany(mappedBy = "ward")
    private Set<Event> events = new HashSet<>();
}
