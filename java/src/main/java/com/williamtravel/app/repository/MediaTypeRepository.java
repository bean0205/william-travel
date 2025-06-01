package com.williamtravel.app.repository;

import com.williamtravel.app.entity.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for MediaType entity operations
 * Provides CRUD operations and custom queries for media type management
 */
@Repository
public interface MediaTypeRepository extends JpaRepository<MediaType, Integer> {

    // Basic finder methods
    Optional<MediaType> findByName(String name);
    
    Optional<MediaType> findByExtension(String extension);
    
    boolean existsByName(String name);
    
    boolean existsByExtension(String extension);

    // Status-based queries
    List<MediaType> findByStatus(Integer status);
    
    Page<MediaType> findByStatus(Integer status, Pageable pageable);
    
    @Query("SELECT mt FROM MediaType mt WHERE mt.status = 1 ORDER BY mt.name ASC")
    List<MediaType> findAllActiveOrderByName();

    // Find by MIME type
    @Query("SELECT mt FROM MediaType mt WHERE mt.mimeType = :mimeType")
    List<MediaType> findByMimeType(@Param("mimeType") String mimeType);
    
    @Query("SELECT mt FROM MediaType mt WHERE LOWER(mt.mimeType) LIKE LOWER(CONCAT(:mimeTypePrefix, '%'))")
    List<MediaType> findByMimeTypeStartingWith(@Param("mimeTypePrefix") String mimeTypePrefix);

    // Search queries
    @Query("SELECT mt FROM MediaType mt WHERE " +
           "(LOWER(mt.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(mt.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(mt.extension) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "mt.status = 1")
    List<MediaType> searchByKeyword(@Param("keyword") String keyword);

    // Types with media count
    @Query("SELECT mt, COUNT(m) FROM MediaType mt " +
           "LEFT JOIN mt.media m " +
           "WHERE mt.status = 1 " +
           "GROUP BY mt " +
           "ORDER BY mt.name ASC")
    List<Object[]> findTypesWithMediaCount();

    // Types ordered by media count
    @Query("SELECT mt FROM MediaType mt " +
           "LEFT JOIN mt.media m " +
           "WHERE mt.status = 1 " +
           "GROUP BY mt " +
           "ORDER BY COUNT(m) DESC")
    List<MediaType> findTypesOrderByMediaCount();
    
    @Query("SELECT mt FROM MediaType mt " +
           "LEFT JOIN mt.media m " +
           "WHERE mt.status = 1 " +
           "GROUP BY mt " +
           "ORDER BY COUNT(m) DESC")
    Page<MediaType> findTypesOrderByMediaCount(Pageable pageable);

    // Types with media
    @Query("SELECT DISTINCT mt FROM MediaType mt " +
           "JOIN mt.media m " +
           "WHERE mt.status = 1")
    List<MediaType> findTypesWithMedia();

    // Image types
    @Query("SELECT mt FROM MediaType mt WHERE " +
           "LOWER(mt.mimeType) LIKE 'image/%' AND " +
           "mt.status = 1 " +
           "ORDER BY mt.name ASC")
    List<MediaType> findImageTypes();

    // Video types
    @Query("SELECT mt FROM MediaType mt WHERE " +
           "LOWER(mt.mimeType) LIKE 'video/%' AND " +
           "mt.status = 1 " +
           "ORDER BY mt.name ASC")
    List<MediaType> findVideoTypes();

    // Audio types
    @Query("SELECT mt FROM MediaType mt WHERE " +
           "LOWER(mt.mimeType) LIKE 'audio/%' AND " +
           "mt.status = 1 " +
           "ORDER BY mt.name ASC")
    List<MediaType> findAudioTypes();

    // Document types
    @Query("SELECT mt FROM MediaType mt WHERE " +
           "LOWER(mt.mimeType) LIKE 'application/%' AND " +
           "mt.status = 1 " +
           "ORDER BY mt.name ASC")
    List<MediaType> findDocumentTypes();

    // Find by file size limits
    @Query("SELECT mt FROM MediaType mt WHERE " +
           "(:minSize IS NULL OR mt.maxFileSize >= :minSize) AND " +
           "(:maxSize IS NULL OR mt.maxFileSize <= :maxSize) AND " +
           "mt.status = 1")
    List<MediaType> findByFileSizeRange(@Param("minSize") Long minSize, @Param("maxSize") Long maxSize);

    // Statistical queries
    @Query("SELECT COUNT(mt) FROM MediaType mt WHERE mt.status = 1")
    Long countActiveTypes();
    
    @Query("SELECT COUNT(m) FROM MediaType mt " +
           "JOIN mt.media m " +
           "WHERE mt.id = :typeId AND mt.status = 1")
    Long countMediaOfType(@Param("typeId") Integer typeId);

    // Recently created types
    @Query("SELECT mt FROM MediaType mt WHERE mt.status = 1 ORDER BY mt.createdDate DESC")
    List<MediaType> findRecentTypes(Pageable pageable);

    // Types by creation date range
    @Query("SELECT mt FROM MediaType mt WHERE " +
           "mt.createdDate >= :startDate AND mt.createdDate <= :endDate AND " +
           "mt.status = 1 " +
           "ORDER BY mt.createdDate DESC")
    List<MediaType> findTypesByDateRange(@Param("startDate") java.time.LocalDate startDate,
                                        @Param("endDate") java.time.LocalDate endDate);

    // Popular types (by total file size)
    @Query("SELECT mt FROM MediaType mt " +
           "LEFT JOIN mt.media m " +
           "WHERE mt.status = 1 " +
           "GROUP BY mt " +
           "ORDER BY COALESCE(SUM(m.fileSize), 0) DESC")
    List<MediaType> findTypesByTotalFileSize(Pageable pageable);

    // Types used for specific entity type
    @Query("SELECT DISTINCT mt FROM MediaType mt " +
           "JOIN mt.media m " +
           "WHERE mt.status = 1 AND m.referenceType = :referenceType")
    List<MediaType> findTypesUsedForReferenceType(@Param("referenceType") String referenceType);

    // Unused types (no media)
    @Query("SELECT mt FROM MediaType mt " +
           "LEFT JOIN mt.media m " +
           "WHERE mt.status = 1 " +
           "GROUP BY mt " +
           "HAVING COUNT(m) = 0")
    List<MediaType> findUnusedTypes();

    // Valid file extensions
    @Query("SELECT DISTINCT mt.extension FROM MediaType mt WHERE mt.status = 1 ORDER BY mt.extension ASC")
    List<String> findAllValidExtensions();

    // Valid MIME types
    @Query("SELECT DISTINCT mt.mimeType FROM MediaType mt WHERE mt.status = 1 ORDER BY mt.mimeType ASC")
    List<String> findAllValidMimeTypes();
}
