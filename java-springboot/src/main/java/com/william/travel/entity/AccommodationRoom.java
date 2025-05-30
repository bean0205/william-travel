package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "accommodation_rooms")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"accommodation"})
@ToString(exclude = {"accommodation"})
public class AccommodationRoom extends BaseEntity {

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "name_code", length = 255)
    private String nameCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    @Column(name = "adult_capacity", nullable = false)
    private Integer adultCapacity = 1;

    @Column(name = "child_capacity")
    private Integer childCapacity = 0;

    @Column(name = "room_area")
    private Integer roomArea;

    @Column(name = "bed_capacity", length = 100)
    private String bedCapacity;

    @Column(name = "status", nullable = false)
    private Integer status = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;
}
