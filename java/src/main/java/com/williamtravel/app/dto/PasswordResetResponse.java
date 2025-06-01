package com.williamtravel.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for password reset response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetResponse {
    
    private String message;
}
