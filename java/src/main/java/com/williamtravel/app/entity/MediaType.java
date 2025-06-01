package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores media file types (image, video, etc.)
 */
@Entity
@Table(name = "media_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaType {

    /**
     * Unique identifier for each media type
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Media type name (e.g. Image, Video)
     */
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    /**
     * Description of the media type
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * File extension for this media type (e.g. jpg, mp4, pdf)
     */
    @Column(name = "extension", length = 10)
    private String extension;

    /**
     * MIME type for this media type (e.g. image/jpeg, video/mp4)
     */
    @Column(name = "mime_type", length = 100)
    private String mimeType;

    /**
     * Maximum file size allowed for this media type (in bytes)
     */
    @Column(name = "max_file_size")
    private Long maxFileSize;

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

    @OneToMany(mappedBy = "type")
    private Set<Media> media = new HashSet<>();
}
