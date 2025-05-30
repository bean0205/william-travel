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
@Table(name = "continents")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"countries", "continentThemes"})
@ToString(exclude = {"countries", "continentThemes"})
public class Continent extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "code", length = 10, nullable = false, unique = true)
    private String code;

    @Column(name = "name_code", length = 100)
    private String nameCode;

    @Column(name = "background_image", length = 255)
    private String backgroundImage;

    @Column(name = "logo", length = 255)
    private String logo;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate = LocalDate.now();

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    @OneToMany(mappedBy = "continent", fetch = FetchType.LAZY)
    private Set<Country> countries = new HashSet<>();

    @OneToMany(mappedBy = "continent", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ContinentTheme> continentThemes = new HashSet<>();
}
