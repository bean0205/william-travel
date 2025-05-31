package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores individual permissions that can be assigned to roles
 */
@Entity
@Table(name = "permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Permission {

    /**
     * Unique identifier for each permission
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Permission name (e.g. Create User)
     */
    @Column(name = "name", length = 100, nullable = false, unique = true)
    private String name;

    /**
     * Description of what this permission allows
     */
    @Column(name = "description", length = 255)
    private String description;

    /**
     * Permission code (e.g. user:create, article:delete)
     */
    @Column(name = "code", length = 100, nullable = false, unique = true)
    private String code;

    /**
     * Timestamp when permission was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when permission was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "permission")
    private Set<RolePermission> rolePermissions = new HashSet<>();
}
