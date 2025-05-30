package com.william.travel.repository;

import com.william.travel.entity.Media;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    
    @Query("SELECT m FROM Media m WHERE m.status = 1 ORDER BY m.createdAt DESC")
    Page<Media> findActiveMedia(Pageable pageable);
    
    @Query("SELECT m FROM Media m WHERE m.type.id = :typeId AND m.status = 1 ORDER BY m.createdAt DESC")
    Page<Media> findActiveByTypeId(@Param("typeId") Long typeId, Pageable pageable);
    
    @Query("SELECT m FROM Media m WHERE m.category.id = :categoryId AND m.status = 1 ORDER BY m.createdAt DESC")
    Page<Media> findActiveByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT m FROM Media m WHERE m.referenceId = :referenceId AND m.referenceType = :referenceType AND m.status = 1 ORDER BY m.createdAt DESC")
    List<Media> findActiveByReference(@Param("referenceId") Long referenceId, @Param("referenceType") String referenceType);
    
    @Query("SELECT m FROM Media m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%')) AND m.status = 1 ORDER BY m.createdAt DESC")
    Page<Media> findActiveByTitleContaining(@Param("title") String title, Pageable pageable);
    
    @Query("SELECT m FROM Media m WHERE m.type.name = :typeName AND m.status = 1 ORDER BY m.createdAt DESC")
    Page<Media> findActiveByTypeName(@Param("typeName") String typeName, Pageable pageable);
}
