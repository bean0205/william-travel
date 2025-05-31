package com.williamtravel.app.service;

import com.williamtravel.app.entity.Permission;
import com.williamtravel.app.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Permission entity operations
 */
@Service
@Transactional
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    /**
     * Find all permissions
     */
    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }

    /**
     * Find permission by ID
     */
    public Optional<Permission> findById(Integer id) {
        return permissionRepository.findById(id);
    }

    /**
     * Save permission
     */
    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    /**
     * Delete permission by ID
     */
    public void deleteById(Integer id) {
        permissionRepository.deleteById(id);
    }

    /**
     * Find permission by name
     */
    public Optional<Permission> findByName(String name) {
        return permissionRepository.findByName(name);
    }

    /**
     * Find permission by code
     */
    public Optional<Permission> findByCode(String code) {
        return permissionRepository.findByCode(code);
    }

    /**
     * Find permissions by name containing (case insensitive)
     */
    public List<Permission> findByNameContainingIgnoreCase(String name) {
        return permissionRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Find permissions by code containing (case insensitive)
     */
    public List<Permission> findByCodeContainingIgnoreCase(String code) {
        return permissionRepository.findByCodeContainingIgnoreCase(code);
    }

    /**
     * Check if permission name exists
     */
    public boolean existsByName(String name) {
        return permissionRepository.existsByName(name);
    }

    /**
     * Check if permission code exists
     */
    public boolean existsByCode(String code) {
        return permissionRepository.existsByCode(code);
    }

    /**
     * Find permissions with pagination and search
     */
    public Page<Permission> findPermissionsWithSearch(String search, Pageable pageable) {
        return permissionRepository.findPermissionsWithSearch(search, pageable);
    }

    /**
     * Find all permissions with pagination
     */
    public Page<Permission> findAll(Pageable pageable) {
        return permissionRepository.findAll(pageable);
    }

    /**
     * Count total permissions
     */
    public long count() {
        return permissionRepository.count();
    }

    /**
     * Check if permission exists by ID
     */
    public boolean existsById(Integer id) {
        return permissionRepository.existsById(id);
    }

    /**
     * Search permissions by multiple criteria
     */
    public List<Permission> searchPermissions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return permissionRepository.findAll();
        }

        String trimmedQuery = query.trim();
        List<Permission> nameResults = permissionRepository.findByNameContainingIgnoreCase(trimmedQuery);
        List<Permission> codeResults = permissionRepository.findByCodeContainingIgnoreCase(trimmedQuery);

        // Combine results and remove duplicates
        nameResults.addAll(codeResults);
        return nameResults.stream().distinct().toList();
    }

    /**
     * Validate permission data
     */
    public boolean isValidPermission(Permission permission) {
        if (permission == null || permission.getName() == null || permission.getCode() == null) {
            return false;
        }
        return !permission.getName().trim().isEmpty() && !permission.getCode().trim().isEmpty();
    }

    /**
     * Check if permission name is available for new permission
     */
    public boolean isNameAvailable(String name, Integer excludeId) {
        if (excludeId != null) {
            return permissionRepository.findAll().stream()
                .filter(p -> !p.getId().equals(excludeId))
                .noneMatch(p -> name.equalsIgnoreCase(p.getName()));
        }
        return !permissionRepository.existsByName(name);
    }

    /**
     * Check if permission code is available for new permission
     */
    public boolean isCodeAvailable(String code, Integer excludeId) {
        if (excludeId != null) {
            return permissionRepository.findAll().stream()
                .filter(p -> !p.getId().equals(excludeId))
                .noneMatch(p -> code.equalsIgnoreCase(p.getCode()));
        }
        return !permissionRepository.existsByCode(code);
    }

    /**
     * Find permissions sorted by name
     */
    public List<Permission> findAllOrderByName() {
        return permissionRepository.findAll().stream()
            .sorted((p1, p2) -> p1.getName().compareToIgnoreCase(p2.getName()))
            .toList();
    }

    /**
     * Find permissions sorted by code
     */
    public List<Permission> findAllOrderByCode() {
        return permissionRepository.findAll().stream()
            .sorted((p1, p2) -> p1.getCode().compareToIgnoreCase(p2.getCode()))
            .toList();
    }

    /**
     * Get permission statistics
     */
    public PermissionStats getPermissionStatistics() {
        long totalPermissions = permissionRepository.count();
        return new PermissionStats(totalPermissions);
    }

    /**
     * Create default system permissions
     */
    public void createDefaultPermissions() {
        String[][] defaultPermissions = {
            {"CREATE_USER", "Create User", "Permission to create new users"},
            {"READ_USER", "Read User", "Permission to view user information"},
            {"UPDATE_USER", "Update User", "Permission to modify user information"},
            {"DELETE_USER", "Delete User", "Permission to delete users"},
            {"CREATE_ARTICLE", "Create Article", "Permission to create articles"},
            {"READ_ARTICLE", "Read Article", "Permission to view articles"},
            {"UPDATE_ARTICLE", "Update Article", "Permission to modify articles"},
            {"DELETE_ARTICLE", "Delete Article", "Permission to delete articles"},
            {"MANAGE_SYSTEM", "Manage System", "Full system administration permissions"}
        };

        for (String[] permData : defaultPermissions) {
            if (!permissionRepository.existsByCode(permData[0])) {
                Permission permission = new Permission();
                permission.setCode(permData[0]);
                permission.setName(permData[1]);
                permission.setDescription(permData[2]);
                permissionRepository.save(permission);
            }
        }
    }

    /**
     * Inner class for permission statistics
     */
    public static class PermissionStats {
        private final long totalPermissions;

        public PermissionStats(long totalPermissions) {
            this.totalPermissions = totalPermissions;
        }

        public long getTotalPermissions() { return totalPermissions; }
    }
}
