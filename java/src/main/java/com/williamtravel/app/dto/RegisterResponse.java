package com.williamtravel.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for registration response containing user info and JWT token
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    
    private UserResponse user;
    private String access_token;
    private String token_type;
    
    public RegisterResponse(UserResponse user, String accessToken) {
        this.user = user;
        this.access_token = accessToken;
        this.token_type = "bearer";
    }
}
