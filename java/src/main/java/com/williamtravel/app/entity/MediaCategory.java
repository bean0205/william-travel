package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Categorizes media files (profile images, location photos, etc.)
 */
@Entity
@Table(name = "media_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaCategory {

    /**
     * Unique identifier for each media category
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Media category name
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Description of the media category
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

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

    @OneToMany(mappedBy = "category")
    private Set<Media> media = new HashSet<>();
}
