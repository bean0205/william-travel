package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Media entity operations
 * Provides CRUD operations and custom queries for media management
 */
@Repository
public interface MediaRepository extends JpaRepository<Media, Integer> {

    // Find by reference (entity this media belongs to)
    @Query("SELECT m FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType")
    List<Media> findByReference(@Param("referenceId") Integer referenceId, 
                               @Param("referenceType") String referenceType);
    
    @Query("SELECT m FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType ORDER BY m.sortOrder ASC, m.uploadedAt DESC")
    Page<Media> findByReference(@Param("referenceId") Integer referenceId, 
                               @Param("referenceType") String referenceType, 
                               Pageable pageable);

    // Find by reference type
    @Query("SELECT m FROM Media m WHERE m.referenceType = :referenceType ORDER BY m.uploadedAt DESC")
    List<Media> findByReferenceType(@Param("referenceType") String referenceType);
    
    @Query("SELECT m FROM Media m WHERE m.referenceType = :referenceType ORDER BY m.uploadedAt DESC")
    Page<Media> findByReferenceType(@Param("referenceType") String referenceType, Pageable pageable);

    // Find by media type
    @Query("SELECT m FROM Media m WHERE m.type.id = :typeId")
    List<Media> findByTypeId(@Param("typeId") Integer typeId);
    
    @Query("SELECT m FROM Media m WHERE m.type.id = :typeId ORDER BY m.uploadedAt DESC")
    Page<Media> findByTypeId(@Param("typeId") Integer typeId, Pageable pageable);

    // Find by media category
    @Query("SELECT m FROM Media m WHERE m.category.id = :categoryId")
    List<Media> findByCategoryId(@Param("categoryId") Integer categoryId);
    
    @Query("SELECT m FROM Media m WHERE m.category.id = :categoryId ORDER BY m.uploadedAt DESC")
    Page<Media> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);

    // Find by file path
    Optional<Media> findByFilePath(String filePath);
    
    boolean existsByFilePath(String filePath);

    // Find by original filename
    @Query("SELECT m FROM Media m WHERE LOWER(m.originalFileName) LIKE LOWER(CONCAT('%', :filename, '%'))")
    List<Media> findByOriginalFileNameContaining(@Param("filename") String filename);

    // Find by alt text
    @Query("SELECT m FROM Media m WHERE LOWER(m.altText) LIKE LOWER(CONCAT('%', :altText, '%'))")
    List<Media> findByAltTextContaining(@Param("altText") String altText);

    // Find main/featured media for entities
    @Query("SELECT m FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType AND m.isMain = true")
    Optional<Media> findMainMediaByReference(@Param("referenceId") Integer referenceId, 
                                            @Param("referenceType") String referenceType);

    @Query("SELECT m FROM Media m WHERE m.isMain = true ORDER BY m.uploadedAt DESC")
    List<Media> findAllMainMedia();

    // Find by file size range
    @Query("SELECT m FROM Media m WHERE m.fileSize >= :minSize AND m.fileSize <= :maxSize ORDER BY m.uploadedAt DESC")
    List<Media> findByFileSizeRange(@Param("minSize") Long minSize, @Param("maxSize") Long maxSize);

    // Find by upload date range
    @Query("SELECT m FROM Media m WHERE m.uploadedAt >= :startDate AND m.uploadedAt <= :endDate ORDER BY m.uploadedAt DESC")
    List<Media> findByUploadDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT m FROM Media m WHERE m.uploadedAt >= :startDate AND m.uploadedAt <= :endDate ORDER BY m.uploadedAt DESC")
    Page<Media> findByUploadDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, Pageable pageable);

    // Recent uploads
    @Query("SELECT m FROM Media m ORDER BY m.uploadedAt DESC")
    List<Media> findRecentUploads(Pageable pageable);

    // Find by dimensions (for images)
    @Query("SELECT m FROM Media m WHERE m.width = :width AND m.height = :height")
    List<Media> findByDimensions(@Param("width") Integer width, @Param("height") Integer height);

    @Query("SELECT m FROM Media m WHERE m.width >= :minWidth AND m.height >= :minHeight")
    List<Media> findByMinDimensions(@Param("minWidth") Integer minWidth, @Param("minHeight") Integer minHeight);

    // Statistical queries
    @Query("SELECT COUNT(m) FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType")
    Long countMediaByReference(@Param("referenceId") Integer referenceId, @Param("referenceType") String referenceType);

    @Query("SELECT COUNT(m) FROM Media m WHERE m.referenceType = :referenceType")
    Long countMediaByType(@Param("referenceType") String referenceType);

    @Query("SELECT COUNT(m) FROM Media m WHERE m.type.id = :typeId")
    Long countMediaByMediaType(@Param("typeId") Integer typeId);

    @Query("SELECT COUNT(m) FROM Media m WHERE m.category.id = :categoryId")
    Long countMediaByCategory(@Param("categoryId") Integer categoryId);

    @Query("SELECT SUM(m.fileSize) FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType")
    Long getTotalFileSizeByReference(@Param("referenceId") Integer referenceId, @Param("referenceType") String referenceType);

    @Query("SELECT SUM(m.fileSize) FROM Media m")
    Long getTotalFileSize();

    // Find media by type and reference combination
    @Query("SELECT m FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType AND m.type.id = :typeId ORDER BY m.sortOrder ASC")
    List<Media> findByReferenceAndType(@Param("referenceId") Integer referenceId, 
                                      @Param("referenceType") String referenceType, 
                                      @Param("typeId") Integer typeId);

    // Find media by category and reference combination
    @Query("SELECT m FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType AND m.category.id = :categoryId ORDER BY m.sortOrder ASC")
    List<Media> findByReferenceAndCategory(@Param("referenceId") Integer referenceId, 
                                          @Param("referenceType") String referenceType, 
                                          @Param("categoryId") Integer categoryId);

    // Most used media types
    @Query("SELECT m.type.name, COUNT(m) FROM Media m GROUP BY m.type.name ORDER BY COUNT(m) DESC")
    List<Object[]> findMostUsedMediaTypes();

    // Most used media categories
    @Query("SELECT m.category.name, COUNT(m) FROM Media m GROUP BY m.category.name ORDER BY COUNT(m) DESC")
    List<Object[]> findMostUsedMediaCategories();

    // Entities with most media
    @Query("SELECT m.referenceType, m.referenceId, COUNT(m) FROM Media m GROUP BY m.referenceType, m.referenceId ORDER BY COUNT(m) DESC")
    List<Object[]> findEntitiesWithMostMedia(Pageable pageable);

    // Search media by filename and alt text
    @Query("SELECT m FROM Media m WHERE " +
           "LOWER(m.originalFileName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.altText) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY m.uploadedAt DESC")
    List<Media> searchMedia(@Param("keyword") String keyword);
    
    @Query("SELECT m FROM Media m WHERE " +
           "LOWER(m.originalFileName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.altText) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY m.uploadedAt DESC")
    Page<Media> searchMedia(@Param("keyword") String keyword, Pageable pageable);

    // Find orphaned media (media without valid reference)
    @Query("SELECT m FROM Media m WHERE m.referenceId IS NULL OR m.referenceType IS NULL")
    List<Media> findOrphanedMedia();
}
