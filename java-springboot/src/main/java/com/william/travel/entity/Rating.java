package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "ratings")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"user", "location", "accommodation", "food"})
@ToString(exclude = {"user", "location", "accommodation", "food"})
public class Rating extends BaseEntity {

    @Column(name = "reference_id", nullable = false)
    private Long referenceId;

    @Column(name = "reference_type", length = 50, nullable = false)
    private String referenceType;

    @Column(name = "rating", nullable = false)
    private Double rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // These relationships are managed through referenceId and referenceType
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id", insertable = false, updatable = false)
    private Location location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id", insertable = false, updatable = false)
    private Accommodation accommodation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id", insertable = false, updatable = false)
    private Food food;
}
