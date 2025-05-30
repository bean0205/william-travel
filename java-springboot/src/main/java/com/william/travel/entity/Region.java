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
@Table(name = "regions")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"country", "districts", "locations", "accommodations", "foods"})
@ToString(exclude = {"country", "districts", "locations", "accommodations", "foods"})
public class Region extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "code", length = 20, nullable = false)
    private String code;

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
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private Set<District> districts = new HashSet<>();

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private Set<Location> locations = new HashSet<>();

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private Set<Accommodation> accommodations = new HashSet<>();

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private Set<Food> foods = new HashSet<>();
}
