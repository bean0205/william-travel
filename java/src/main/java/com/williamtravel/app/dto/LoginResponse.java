package com.williamtravel.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login response containing JWT token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    
    private String access_token;
    private String token_type;
    
    public LoginResponse(String accessToken) {
        this.access_token = accessToken;
        this.token_type = "bearer";
    }
}
