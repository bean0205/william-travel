package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "continent_theme")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"continent"})
@ToString(exclude = {"continent"})
public class ContinentTheme extends BaseEntity {

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
}
