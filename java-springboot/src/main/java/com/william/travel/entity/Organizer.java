package com.william.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "organizer")
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"user", "events", "eventSponsors", "media"})
@ToString(exclude = {"user", "events", "eventSponsors", "media"})
public class Organizer extends BaseEntity {

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "name_code", length = 255)
    private String nameCode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_code", columnDefinition = "TEXT")
    private String descriptionCode;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "organizer", fetch = FetchType.LAZY)
    private Set<Event> events = new HashSet<>();

    @OneToMany(mappedBy = "organizer", fetch = FetchType.LAZY)
    private Set<EventSponsor> eventSponsors = new HashSet<>();

    @OneToMany(mappedBy = "organizer", fetch = FetchType.LAZY)
    private Set<Media> media = new HashSet<>();
}
