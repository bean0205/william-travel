package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Role entity
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    /**
     * Find role by name
     */
    Optional<Role> findByName(String name);
    
    /**
     * Find default role
     */
    Optional<Role> findByIsDefaultTrue();
    
    /**
     * Find roles by name containing (case insensitive)
     */
    List<Role> findByNameContainingIgnoreCase(String name);
    
    /**
     * Check if role name exists
     */
    boolean existsByName(String name);
    
    /**
     * Find roles with pagination and search
     */
    @Query("SELECT r FROM Role r WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Role> findRolesWithSearch(@Param("search") String search, Pageable pageable);
    
    /**
     * Find roles with their permissions
     */
    @Query("SELECT DISTINCT r FROM Role r LEFT JOIN FETCH r.rolePermissions rp LEFT JOIN FETCH rp.permission")
    List<Role> findAllWithPermissions();
}
