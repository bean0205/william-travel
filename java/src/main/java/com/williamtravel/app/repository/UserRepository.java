package com.williamtravel.app.repository;

import com.williamtravel.app.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find users by role
     */
    List<User> findByRoleId(Integer roleId);
    
    /**
     * Find active users
     */
    List<User> findByIsActiveTrue();
    
    /**
     * Find users by active status
     */
    List<User> findByIsActive(Boolean isActive);
    
    /**
     * Find superusers
     */
    List<User> findByIsSuperuserTrue();
    
    /**
     * Find users created between dates
     */
    List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find users by full name containing (case insensitive)
     */
    List<User> findByFullNameContainingIgnoreCase(String fullName);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Count active users
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();
    
    /**
     * Count users by role
     */
    long countByRoleId(Integer roleId);
    
    /**
     * Find users with pagination and search
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive) AND " +
           "(:roleId IS NULL OR u.role.id = :roleId)")
    Page<User> findUsersWithFilters(@Param("search") String search,
                                   @Param("isActive") Boolean isActive,
                                   @Param("roleId") Integer roleId,
                                   Pageable pageable);
}
