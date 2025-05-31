package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Maps which permissions are assigned to each role
 */
@Entity
@Table(name = "role_permissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RolePermissionId.class)
public class RolePermission {

    /**
     * Reference to the role
     */
    @Id
    @Column(name = "role_id")
    private Integer roleId;

    /**
     * Reference to the permission
     */
    @Id
    @Column(name = "permission_id")
    private Integer permissionId;

    @ManyToOne
    @JoinColumn(name = "role_id", insertable = false, updatable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "permission_id", insertable = false, updatable = false)
    private Permission permission;
}


