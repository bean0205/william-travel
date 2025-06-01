package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Stores information about media files (images, videos, documents) related to other entities
 */
@Entity
@Table(name = "media")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    /**
     * Unique identifier for each media file
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Reference to media type (image, video, etc.)
     */
    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private MediaType type;

    /**
     * Reference to media category (profile photo, location image, etc.)
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private MediaCategory category;

    /**
     * ID of the entity this media belongs to (accommodation, food, location, etc.)
     */
    @Column(name = "reference_id", nullable = false)
    private Integer referenceId;

    /**
     * Type of entity this media belongs to (accommodation, food, location, etc.)
     */
    @Column(name = "reference_type", length = 50, nullable = false)
    private String referenceType;

    /**
     * URL to access the media file
     */
    @Column(name = "url", columnDefinition = "TEXT", nullable = false)
    private String url;

    /**
     * File path where the media is stored
     */
    @Column(name = "file_path", columnDefinition = "TEXT")
    private String filePath;

    /**
     * Original filename when uploaded
     */
    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    /**
     * Optional title for the media
     */
    @Column(name = "title", length = 255)
    private String title;

    /**
     * Optional description of the media content
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Alternative text for accessibility (mainly for images)
     */
    @Column(name = "alt_text", length = 255)
    private String altText;

    /**
     * Sort order for displaying media in a specific sequence
     */
    @Column(name = "sort_order")
    private Integer sortOrder;

    /**
     * Whether this is the main/featured media for the entity
     */
    @Column(name = "is_main")
    private Boolean isMain;

    /**
     * Width in pixels (for images and videos)
     */
    @Column(name = "width")
    private Integer width;

    /**
     * Height in pixels (for images and videos)
     */
    @Column(name = "height")
    private Integer height;

    /**
     * File size in bytes
     */
    @Column(name = "file_size")
    private Long fileSize;

    /**
     * Date when media was uploaded
     */
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    /**
     * Status: 1-active, 0-inactive
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * Date when media was added
     */
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    /**
     * Date when media was last updated
     */
    @Column(name = "updated_date")
    private LocalDate updatedDate;
}
