package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores continent information for geographic organization
 */
@Entity
@Table(name = "continents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Continent {

    /**
     * Unique identifier for each continent
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Continent name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Continent code (e.g. AS, EU, NA)
     */
    @Column(name = "code", length = 10, nullable = false, unique = true)
    private String code;

    /**
     * Code for translation purposes
     */
    @Column(name = "name_code", length = 100)
    private String nameCode;

    /**
     * URL to background image
     */
    @Column(name = "background_image", length = 500)
    private String backgroundImage;

    /**
     * URL to logo image
     */
    @Column(name = "logo", length = 500)
    private String logo;

    /**
     * Description of the continent
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Description code for translation
     */
    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

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
    
    @OneToMany(mappedBy = "continent")
    private Set<Country> countries = new HashSet<>();
}
