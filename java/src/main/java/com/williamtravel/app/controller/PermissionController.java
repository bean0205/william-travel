package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Permission;
import com.williamtravel.app.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Permission operations
 */
@RestController
@RequestMapping("/api/permissions")
@CrossOrigin(origins = "*")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all permissions
     */
    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions() {
        List<Permission> permissions = permissionService.findAll();
        return ResponseEntity.ok(permissions);
    }

    /**
     * Get permission by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Permission> getPermissionById(@PathVariable Integer id) {
        Optional<Permission> permission = permissionService.findById(id);
        return permission.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new permission
     */
    @PostMapping
    public ResponseEntity<Permission> createPermission(@RequestBody Permission permission) {
        Permission savedPermission = permissionService.save(permission);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPermission);
    }

    /**
     * Update permission
     */
    @PutMapping("/{id}")
    public ResponseEntity<Permission> updatePermission(@PathVariable Integer id, @RequestBody Permission permission) {
        if (!permissionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        permission.setId(id);
        Permission updatedPermission = permissionService.save(permission);
        return ResponseEntity.ok(updatedPermission);
    }

    /**
     * Delete permission
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Integer id) {
        if (!permissionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        permissionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total permissions
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countPermissions() {
        long count = permissionService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    /**
     * Get all permissions with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Permission>> getPermissionsPage(Pageable pageable) {
        Page<Permission> permissions = permissionService.findAll(pageable);
        return ResponseEntity.ok(permissions);
    }

    /**
     * Get permission by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Permission> getPermissionByName(@PathVariable String name) {
        Optional<Permission> permission = permissionService.findByName(name);
        return permission.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get permission by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Permission> getPermissionByCode(@PathVariable String code) {
        Optional<Permission> permission = permissionService.findByCode(code);
        return permission.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search permissions by name (case insensitive)
     */
    @GetMapping("/search/name/{name}")
    public ResponseEntity<List<Permission>> searchPermissionsByName(@PathVariable String name) {
        List<Permission> permissions = permissionService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(permissions);
    }

    /**
     * Search permissions by code (case insensitive)
     */
    @GetMapping("/search/code/{code}")
    public ResponseEntity<List<Permission>> searchPermissionsByCode(@PathVariable String code) {
        List<Permission> permissions = permissionService.findByCodeContainingIgnoreCase(code);
        return ResponseEntity.ok(permissions);
    }

    /**
     * Check if permission name exists
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> checkNameExists(@PathVariable String name) {
        boolean exists = permissionService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if permission code exists
     */
    @GetMapping("/exists/code/{code}")
    public ResponseEntity<Boolean> checkCodeExists(@PathVariable String code) {
        boolean exists = permissionService.existsByCode(code);
        return ResponseEntity.ok(exists);
    }

    /**
     * Search permissions with pagination
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Permission>> searchPermissions(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<Permission> permissions = permissionService.findPermissionsWithSearch(search, pageable);
        return ResponseEntity.ok(permissions);
    }

    /**
     * Search permissions by query
     */
    @GetMapping("/search/{query}")
    public ResponseEntity<List<Permission>> searchPermissions(@PathVariable String query) {
        List<Permission> permissions = permissionService.searchPermissions(query);
        return ResponseEntity.ok(permissions);
    }

    /**
     * Validate permission data
     */
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validatePermission(@RequestBody Permission permission) {
        boolean isValid = permissionService.isValidPermission(permission);
        return ResponseEntity.ok(isValid);
    }

    /**
     * Check if permission name is available
     */
    @GetMapping("/available/name/{name}")
    public ResponseEntity<Boolean> isNameAvailable(@PathVariable String name,
                                                  @RequestParam(required = false) Integer excludeId) {
        boolean available = permissionService.isNameAvailable(name, excludeId);
        return ResponseEntity.ok(available);
    }

    /**
     * Check if permission code is available
     */
    @GetMapping("/available/code/{code}")
    public ResponseEntity<Boolean> isCodeAvailable(@PathVariable String code,
                                                  @RequestParam(required = false) Integer excludeId) {
        boolean available = permissionService.isCodeAvailable(code, excludeId);
        return ResponseEntity.ok(available);
    }

    /**
     * Get permissions ordered by name
     */
    @GetMapping("/ordered-by-name")
    public ResponseEntity<List<Permission>> getPermissionsOrderedByName() {
        List<Permission> permissions = permissionService.findAllOrderByName();
        return ResponseEntity.ok(permissions);
    }

    /**
     * Get permissions ordered by code
     */
    @GetMapping("/ordered-by-code")
    public ResponseEntity<List<Permission>> getPermissionsOrderedByCode() {
        List<Permission> permissions = permissionService.findAllOrderByCode();
        return ResponseEntity.ok(permissions);
    }

    /**
     * Get permission statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<PermissionService.PermissionStats> getPermissionStatistics() {
        PermissionService.PermissionStats stats = permissionService.getPermissionStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Create default permissions
     */
    @PostMapping("/create-defaults")
    public ResponseEntity<Void> createDefaultPermissions() {
        permissionService.createDefaultPermissions();
        return ResponseEntity.ok().build();
    }

    /**
     * Get total permissions count (alias)
     */
    @GetMapping("/total")
    public ResponseEntity<Long> getTotalPermissions() {
        long total = permissionService.count();
        return ResponseEntity.ok(total);
    }
}
