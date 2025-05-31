package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores user roles and their basic information
 */
@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    /**
     * Unique identifier for each role
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Role name (e.g. Admin, Staff, User)
     */
    @Column(name = "name", length = 50, nullable = false, unique = true)
    private String name;

    /**
     * Description of this role and its privileges
     */
    @Column(name = "description", length = 255)
    private String description;

    /**
     * Whether this is a default role
     */
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault;

    /**
     * Timestamp when role was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when role was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "role")
    private Set<RolePermission> rolePermissions = new HashSet<>();
}
