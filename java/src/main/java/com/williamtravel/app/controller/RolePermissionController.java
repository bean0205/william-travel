package com.williamtravel.app.controller;

import com.williamtravel.app.entity.RolePermission;
import com.williamtravel.app.entity.RolePermissionId;
import com.williamtravel.app.service.RolePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for RolePermission operations
 */
@RestController
@RequestMapping("/api/role-permissions")
@CrossOrigin(origins = "*")
public class RolePermissionController {

    @Autowired
    private RolePermissionService rolePermissionService;

    /**
     * Get all role permissions
     */
    @GetMapping
    public ResponseEntity<List<RolePermission>> getAllRolePermissions() {
        List<RolePermission> rolePermissions = rolePermissionService.findAll();
        return ResponseEntity.ok(rolePermissions);
    }

    /**
     * Get role permission by composite ID
     */
    @GetMapping("/{roleId}/{permissionId}")
    public ResponseEntity<RolePermission> getRolePermissionById(
            @PathVariable Integer roleId, 
            @PathVariable Integer permissionId) {
        RolePermissionId id = new RolePermissionId(roleId, permissionId);
        Optional<RolePermission> rolePermission = rolePermissionService.findById(id);
        return rolePermission.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new role permission
     */
    @PostMapping
    public ResponseEntity<RolePermission> createRolePermission(@RequestBody RolePermission rolePermission) {
        RolePermission savedRolePermission = rolePermissionService.save(rolePermission);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRolePermission);
    }

    /**
     * Update role permission
     */
    @PutMapping("/{roleId}/{permissionId}")
    public ResponseEntity<RolePermission> updateRolePermission(
            @PathVariable Integer roleId, 
            @PathVariable Integer permissionId, 
            @RequestBody RolePermission rolePermission) {
        RolePermissionId id = new RolePermissionId(roleId, permissionId);
        if (!rolePermissionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rolePermission.setRoleId(roleId);
        rolePermission.setPermissionId(permissionId);
        RolePermission updatedRolePermission = rolePermissionService.save(rolePermission);
        return ResponseEntity.ok(updatedRolePermission);
    }

    /**
     * Delete role permission
     */
    @DeleteMapping("/{roleId}/{permissionId}")
    public ResponseEntity<Void> deleteRolePermission(
            @PathVariable Integer roleId, 
            @PathVariable Integer permissionId) {
        RolePermissionId id = new RolePermissionId(roleId, permissionId);
        if (!rolePermissionService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rolePermissionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total role permissions
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countRolePermissions() {
        long count = rolePermissionService.count();
        return ResponseEntity.ok(count);
    }

    /**
     * Get role permissions by role ID
     */
    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<RolePermission>> getRolePermissionsByRole(@PathVariable Integer roleId) {
        List<RolePermission> rolePermissions = rolePermissionService.findByRoleId(roleId);
        return ResponseEntity.ok(rolePermissions);
    }

    /**
     * Get role permissions by permission ID
     */
    @GetMapping("/permission/{permissionId}")
    public ResponseEntity<List<RolePermission>> getRolePermissionsByPermission(@PathVariable Integer permissionId) {
        List<RolePermission> rolePermissions = rolePermissionService.findByPermissionId(permissionId);
        return ResponseEntity.ok(rolePermissions);
    }

    /**
     * Check if role has permission
     */
    @GetMapping("/exists/{roleId}/{permissionId}")
    public ResponseEntity<Boolean> checkRoleHasPermission(
            @PathVariable Integer roleId, 
            @PathVariable Integer permissionId) {
        boolean exists = rolePermissionService.existsByRoleIdAndPermissionId(roleId, permissionId);
        return ResponseEntity.ok(exists);
    }

    /**
     * Get permissions for a role
     */
    @GetMapping("/role/{roleId}/permissions")
    public ResponseEntity<List<RolePermission>> getPermissionsByRole(@PathVariable Integer roleId) {
        List<RolePermission> permissions = rolePermissionService.findPermissionsByRoleId(roleId);
        return ResponseEntity.ok(permissions);
    }

    /**
     * Get roles for a permission
     */
    @GetMapping("/permission/{permissionId}/roles")
    public ResponseEntity<List<RolePermission>> getRolesByPermission(@PathVariable Integer permissionId) {
        List<RolePermission> roles = rolePermissionService.findRolesByPermissionId(permissionId);
        return ResponseEntity.ok(roles);
    }

    /**
     * Delete all role permissions by role ID
     */
    @DeleteMapping("/role/{roleId}")
    public ResponseEntity<Void> deleteRolePermissionsByRole(@PathVariable Integer roleId) {
        rolePermissionService.deleteByRoleId(roleId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete all role permissions by permission ID
     */
    @DeleteMapping("/permission/{permissionId}")
    public ResponseEntity<Void> deleteRolePermissionsByPermission(@PathVariable Integer permissionId) {
        rolePermissionService.deleteByPermissionId(permissionId);
        return ResponseEntity.noContent().build();
    }
}
