package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "country_theme")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"country"})
@ToString(exclude = {"country"})
public class CountryTheme extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "name_code", length = 100)
    private String nameCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    @Column(name = "slider_image", columnDefinition = "TEXT")
    private String sliderImage;

    @Column(name = "slider_image_description", columnDefinition = "TEXT")
    private String sliderImageDescription;

    @Column(name = "slider_image_code", columnDefinition = "TEXT")
    private String sliderImageCode;

    @Column(name = "background_image", columnDefinition = "TEXT")
    private String backgroundImage;

    @Column(name = "logo", columnDefinition = "TEXT")
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
}
