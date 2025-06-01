package com.williamtravel.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for user response (without sensitive information like password)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Integer id;
    private String email;
    private String full_name;
    private Boolean is_active;
    private Boolean is_superuser;
    private String role;
    private Integer role_id;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}
