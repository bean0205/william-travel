package com.williamtravel.app.service;

import com.williamtravel.app.entity.RolePermission;
import com.williamtravel.app.entity.RolePermissionId;
import com.williamtravel.app.repository.RolePermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for RolePermission entity operations
 */
@Service
@Transactional
public class RolePermissionService {

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    /**
     * Find all role permissions
     */
    public List<RolePermission> findAll() {
        return rolePermissionRepository.findAll();
    }

    /**
     * Find role permission by ID
     */
    public Optional<RolePermission> findById(RolePermissionId id) {
        return rolePermissionRepository.findById(id);
    }

    /**
     * Save role permission
     */
    public RolePermission save(RolePermission rolePermission) {
        return rolePermissionRepository.save(rolePermission);
    }

    /**
     * Delete role permission by ID
     */
    public void deleteById(RolePermissionId id) {
        rolePermissionRepository.deleteById(id);
    }

    /**
     * Count total role permissions
     */
    public long count() {
        return rolePermissionRepository.count();
    }

    /**
     * Check if role permission exists by ID
     */
    public boolean existsById(RolePermissionId id) {
        return rolePermissionRepository.existsById(id);
    }

    /**
     * Find all role permissions with pagination
     */
    public Page<RolePermission> findAll(Pageable pageable) {
        return rolePermissionRepository.findAll(pageable);
    }

    /**
     * Find role permissions by role ID
     */
    public List<RolePermission> findByRoleId(Integer roleId) {
        return rolePermissionRepository.findByRoleId(roleId);
    }

    /**
     * Find role permissions by permission ID
     */
    public List<RolePermission> findByPermissionId(Integer permissionId) {
        return rolePermissionRepository.findByPermissionId(permissionId);
    }

    /**
     * Delete by role ID
     */
    public void deleteByRoleId(Integer roleId) {
        rolePermissionRepository.deleteByRoleId(roleId);
    }

    /**
     * Delete by permission ID
     */
    public void deleteByPermissionId(Integer permissionId) {
        rolePermissionRepository.deleteByPermissionId(permissionId);
    }

    /**
     * Check if role has permission
     */
    public boolean existsByRoleIdAndPermissionId(Integer roleId, Integer permissionId) {
        return rolePermissionRepository.existsByRoleIdAndPermissionId(roleId, permissionId);
    }

    /**
     * Find permissions for a role
     */
    public List<RolePermission> findPermissionsByRoleId(Integer roleId) {
        return rolePermissionRepository.findPermissionsByRoleId(roleId);
    }

    /**
     * Find roles for a permission
     */
    public List<RolePermission> findRolesByPermissionId(Integer permissionId) {
        return rolePermissionRepository.findRolesByPermissionId(permissionId);
    }
}
