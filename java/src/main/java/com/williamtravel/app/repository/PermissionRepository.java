package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Permission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Permission entity
 */
@Repository
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    
    /**
     * Find permission by name
     */
    Optional<Permission> findByName(String name);
    
    /**
     * Find permission by code
     */
    Optional<Permission> findByCode(String code);
    
    /**
     * Find permissions by name containing (case insensitive)
     */
    List<Permission> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find permissions by code containing (case insensitive)
     */
    List<Permission> findByCodeContainingIgnoreCase(String code);
    
    /**
     * Check if permission name exists
     */
    boolean existsByName(String name);
    
    /**
     * Check if permission code exists
     */
    boolean existsByCode(String code);
    
    /**
     * Find permissions with pagination and search
     */
    @Query("SELECT p FROM Permission p WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Permission> findPermissionsWithSearch(@Param("search") String search, Pageable pageable);
}
