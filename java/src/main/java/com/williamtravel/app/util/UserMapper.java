package com.williamtravel.app.util;

import com.williamtravel.app.dto.UserResponse;
import com.williamtravel.app.entity.User;

/**
 * Utility class for converting between User entity and DTOs
 */
public class UserMapper {
    
    /**
     * Convert User entity to UserResponse DTO
     */
    public static UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFull_name(user.getFullName());
        response.setIs_active(user.getIsActive());
        response.setIs_superuser(user.getIsSuperuser());
        response.setRole_id(user.getRole() != null ? user.getRole().getId() : null);
        response.setRole(user.getRole() != null ? user.getRole().getName() : null);
        response.setCreated_at(user.getCreatedAt());
        response.setUpdated_at(user.getUpdatedAt());
        
        return response;
    }
}
