package com.williamtravel.app.service;

import com.williamtravel.app.entity.Role;
import com.williamtravel.app.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Role entity operations
 */
@Service
@Transactional
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Find all roles
     */
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    /**
     * Find role by ID
     */
    public Optional<Role> findById(Integer id) {
        return roleRepository.findById(id);
    }

    /**
     * Save role
     */
    public Role save(Role role) {
        return roleRepository.save(role);
    }

    /**
     * Delete role by ID
     */
    public void deleteById(Integer id) {
        roleRepository.deleteById(id);
    }

    /**
     * Find role by name
     */
    public Optional<Role> findByName(String name) {
        return roleRepository.findByName(name);
    }

    /**
     * Find default role
     */
    public Optional<Role> findByIsDefaultTrue() {
        return roleRepository.findByIsDefaultTrue();
    }

    /**
     * Find default role (alias method for authentication service compatibility)
     */
    public Optional<Role> findDefaultRole() {
        return findByIsDefaultTrue();
    }

    /**
     * Find roles by name containing (case insensitive)
     */
    public List<Role> findByNameContainingIgnoreCase(String name) {
        return roleRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Check if role name exists
     */
    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }

    /**
     * Find roles with pagination and search
     */
    public Page<Role> findRolesWithSearch(String search, Pageable pageable) {
        return roleRepository.findRolesWithSearch(search, pageable);
    }

    /**
     * Find roles with their permissions
     */
    public List<Role> findAllWithPermissions() {
        return roleRepository.findAllWithPermissions();
    }

    /**
     * Find all roles with pagination
     */
    public Page<Role> findAll(Pageable pageable) {
        return roleRepository.findAll(pageable);
    }

    /**
     * Count total roles
     */
    public long count() {
        return roleRepository.count();
    }

    /**
     * Check if role exists by ID
     */
    public boolean existsById(Integer id) {
        return roleRepository.existsById(id);
    }

    /**
     * Search roles by multiple criteria
     */
    public List<Role> searchRoles(String query) {
        if (query == null || query.trim().isEmpty()) {
            return roleRepository.findAll();
        }
        return roleRepository.findByNameContainingIgnoreCase(query.trim());
    }

    /**
     * Validate role data
     */
    public boolean isValidRole(Role role) {
        if (role == null || role.getName() == null) {
            return false;
        }
        return !role.getName().trim().isEmpty();
    }

    /**
     * Check if role name is available for new role
     */
    public boolean isNameAvailable(String name, Integer excludeId) {
        if (excludeId != null) {
            return roleRepository.findAll().stream()
                .filter(r -> !r.getId().equals(excludeId))
                .noneMatch(r -> name.equalsIgnoreCase(r.getName()));
        }
        return !roleRepository.existsByName(name);
    }

    /**
     * Find roles sorted by name
     */
    public List<Role> findAllOrderByName() {
        return roleRepository.findAll().stream()
            .sorted((r1, r2) -> r1.getName().compareToIgnoreCase(r2.getName()))
            .toList();
    }

    /**
     * Get default role or create one if it doesn't exist
     */
    public Role getOrCreateDefaultRole() {
        Optional<Role> defaultRole = roleRepository.findByIsDefaultTrue();
        if (defaultRole.isPresent()) {
            return defaultRole.get();
        }
        
        // Create default user role if it doesn't exist
        Role userRole = new Role();
        userRole.setName("USER");
        userRole.setDescription("Default user role with basic permissions");
        userRole.setIsDefault(true);
        return roleRepository.save(userRole);
    }

    /**
     * Set role as default (and unset others)
     */
    public Role setAsDefault(Integer roleId) {
        // First, unset all default flags
        List<Role> allRoles = roleRepository.findAll();
        for (Role role : allRoles) {
            if (role.getIsDefault() != null && role.getIsDefault()) {
                role.setIsDefault(false);
                roleRepository.save(role);
            }
        }
        
        // Set the specified role as default
        Optional<Role> roleOpt = roleRepository.findById(roleId);
        if (roleOpt.isPresent()) {
            Role role = roleOpt.get();
            role.setIsDefault(true);
            return roleRepository.save(role);
        }
        
        return null;
    }

    /**
     * Create default system roles
     */
    public void createDefaultRoles() {
        String[][] defaultRoles = {
            {"ADMIN", "Administrator", "System administrator with full permissions", "false"},
            {"USER", "User", "Default user role with basic permissions", "true"},
            {"MODERATOR", "Moderator", "Content moderator with limited admin permissions", "false"},
            {"AUTHOR", "Author", "Content author with article creation permissions", "false"}
        };

        for (String[] roleData : defaultRoles) {
            if (!roleRepository.existsByName(roleData[0])) {
                Role role = new Role();
                role.setName(roleData[0]);
                role.setDescription(roleData[2]);
                role.setIsDefault(Boolean.parseBoolean(roleData[3]));
                roleRepository.save(role);
            }
        }
    }

    /**
     * Count users by role
     */
    public long countUsersByRole(Integer roleId) {
        // This would require a query to the User entity
        // For now, return 0 as placeholder
        return 0L;
    }

    /**
     * Check if role can be deleted (has no users assigned)
     */
    public boolean canDeleteRole(Integer roleId) {
        // Check if any users are assigned to this role
        return countUsersByRole(roleId) == 0;
    }

    /**
     * Get role statistics
     */
    public RoleStats getRoleStatistics() {
        long totalRoles = roleRepository.count();
        boolean hasDefaultRole = roleRepository.findByIsDefaultTrue().isPresent();
        return new RoleStats(totalRoles, hasDefaultRole);
    }

    /**
     * Inner class for role statistics
     */
    public static class RoleStats {
        private final long totalRoles;
        private final boolean hasDefaultRole;

        public RoleStats(long totalRoles, boolean hasDefaultRole) {
            this.totalRoles = totalRoles;
            this.hasDefaultRole = hasDefaultRole;
        }

        public long getTotalRoles() { return totalRoles; }
        public boolean hasDefaultRole() { return hasDefaultRole; }
    }
}
