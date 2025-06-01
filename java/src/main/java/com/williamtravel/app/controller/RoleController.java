package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Role;
import com.williamtravel.app.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Role operations
 */
@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RoleController {

    @Autowired
    private RoleService roleService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all roles
     */
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.findAll();
        return ResponseEntity.ok(roles);
    }

    /**
     * Get role by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Integer id) {
        Optional<Role> role = roleService.findById(id);
        return role.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new role
     */
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        Role savedRole = roleService.save(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRole);
    }

    /**
     * Update role
     */
    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Integer id, @RequestBody Role role) {
        if (!roleService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        role.setId(id);
        Role updatedRole = roleService.save(role);
        return ResponseEntity.ok(updatedRole);
    }

    /**
     * Delete role
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id) {
        if (!roleService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        roleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total roles
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countRoles() {
        long count = roleService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    /**
     * Get all roles with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Role>> getRolesPage(Pageable pageable) {
        Page<Role> roles = roleService.findAll(pageable);
        return ResponseEntity.ok(roles);
    }

    /**
     * Get role by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Role> getRoleByName(@PathVariable String name) {
        Optional<Role> role = roleService.findByName(name);
        return role.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get default role
     */
    @GetMapping("/default")
    public ResponseEntity<Role> getDefaultRole() {
        Optional<Role> role = roleService.findByIsDefaultTrue();
        return role.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search roles by name (case insensitive)
     */
    @GetMapping("/search/name/{name}")
    public ResponseEntity<List<Role>> searchRolesByName(@PathVariable String name) {
        List<Role> roles = roleService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(roles);
    }

    /**
     * Check if role name exists
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> checkNameExists(@PathVariable String name) {
        boolean exists = roleService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Search roles with pagination
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Role>> searchRoles(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<Role> roles = roleService.findRolesWithSearch(search, pageable);
        return ResponseEntity.ok(roles);
    }

    /**
     * Get all roles with their permissions
     */
    @GetMapping("/with-permissions")
    public ResponseEntity<List<Role>> getRolesWithPermissions() {
        List<Role> roles = roleService.findAllWithPermissions();
        return ResponseEntity.ok(roles);
    }

    /**
     * Search roles by query
     */
    @GetMapping("/search/{query}")
    public ResponseEntity<List<Role>> searchRoles(@PathVariable String query) {
        List<Role> roles = roleService.searchRoles(query);
        return ResponseEntity.ok(roles);
    }

    /**
     * Validate role data
     */
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateRole(@RequestBody Role role) {
        boolean isValid = roleService.isValidRole(role);
        return ResponseEntity.ok(isValid);
    }

    /**
     * Check if role name is available
     */
    @GetMapping("/available/name/{name}")
    public ResponseEntity<Boolean> isNameAvailable(@PathVariable String name,
                                                  @RequestParam(required = false) Integer excludeId) {
        boolean available = roleService.isNameAvailable(name, excludeId);
        return ResponseEntity.ok(available);
    }

    /**
     * Get roles ordered by name
     */
    @GetMapping("/ordered-by-name")
    public ResponseEntity<List<Role>> getRolesOrderedByName() {
        List<Role> roles = roleService.findAllOrderByName();
        return ResponseEntity.ok(roles);
    }

    /**
     * Get or create default role
     */
    @PostMapping("/default")
    public ResponseEntity<Role> getOrCreateDefaultRole() {
        Role role = roleService.getOrCreateDefaultRole();
        return ResponseEntity.ok(role);
    }

    /**
     * Set role as default
     */
    @PutMapping("/{id}/set-default")
    public ResponseEntity<Role> setAsDefault(@PathVariable Integer id) {
        Role role = roleService.setAsDefault(id);
        if (role != null) {
            return ResponseEntity.ok(role);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Create default roles
     */
    @PostMapping("/create-defaults")
    public ResponseEntity<Void> createDefaultRoles() {
        roleService.createDefaultRoles();
        return ResponseEntity.ok().build();
    }

    /**
     * Count users by role
     */
    @GetMapping("/{id}/users/count")
    public ResponseEntity<Long> countUsersByRole(@PathVariable Integer id) {
        long count = roleService.countUsersByRole(id);
        return ResponseEntity.ok(count);
    }

    /**
     * Check if role can be deleted
     */
    @GetMapping("/{id}/can-delete")
    public ResponseEntity<Boolean> canDeleteRole(@PathVariable Integer id) {
        boolean canDelete = roleService.canDeleteRole(id);
        return ResponseEntity.ok(canDelete);
    }

    /**
     * Get role statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<RoleService.RoleStats> getRoleStatistics() {
        RoleService.RoleStats stats = roleService.getRoleStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Check if system has default role
     */
    @GetMapping("/has-default")
    public ResponseEntity<Boolean> hasDefaultRole() {
        Optional<Role> defaultRole = roleService.findByIsDefaultTrue();
        return ResponseEntity.ok(defaultRole.isPresent());
    }

    /**
     * Get total roles count (alias)
     */
    @GetMapping("/total")
    public ResponseEntity<Long> getTotalRoles() {
        long total = roleService.count();
        return ResponseEntity.ok(total);
    }
}
