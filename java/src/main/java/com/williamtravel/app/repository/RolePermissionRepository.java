package com.williamtravel.app.repository;

import com.williamtravel.app.entity.RolePermission;
import com.williamtravel.app.entity.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for RolePermission entity
 */
@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {
    
    /**
     * Find role permissions by role ID
     */
    List<RolePermission> findByRoleId(Integer roleId);
    
    /**
     * Find role permissions by permission ID
     */
    List<RolePermission> findByPermissionId(Integer permissionId);
    
    /**
     * Delete by role ID
     */
    void deleteByRoleId(Integer roleId);
    
    /**
     * Delete by permission ID
     */
    void deleteByPermissionId(Integer permissionId);
    
    /**
     * Check if role has permission
     */
    boolean existsByRoleIdAndPermissionId(Integer roleId, Integer permissionId);
    
    /**
     * Find permissions for a role
     */
    @Query("SELECT rp FROM RolePermission rp JOIN FETCH rp.permission WHERE rp.role.id = :roleId")
    List<RolePermission> findPermissionsByRoleId(@Param("roleId") Integer roleId);
    
    /**
     * Find roles for a permission
     */
    @Query("SELECT rp FROM RolePermission rp JOIN FETCH rp.role WHERE rp.permission.id = :permissionId")
    List<RolePermission> findRolesByPermissionId(@Param("permissionId") Integer permissionId);
}
