package com.williamtravel.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for logout response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogoutResponse {
    
    private String message;
}
