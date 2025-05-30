package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "countries")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"continent", "regions", "locations", "accommodations", "foods", "articles", "events", "countryThemes"})
@ToString(exclude = {"continent", "regions", "locations", "accommodations", "foods", "articles", "events", "countryThemes"})
public class Country extends BaseEntity {

    @Column(name = "code", length = 10, nullable = false, unique = true)
    private String code;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "name_code", length = 100)
    private String nameCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    @Column(name = "background_image", length = 255)
    private String backgroundImage;

    @Column(name = "logo", length = 255)
    private String logo;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate = LocalDate.now();

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "continent_id", nullable = false)
    private Continent continent;

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<Region> regions = new HashSet<>();

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<Location> locations = new HashSet<>();

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<Accommodation> accommodations = new HashSet<>();

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<Food> foods = new HashSet<>();

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<Article> articles = new HashSet<>();

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<Event> events = new HashSet<>();

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<CountryTheme> countryThemes = new HashSet<>();
}
