package com.williamtravel.app.controller;

import com.williamtravel.app.dto.*;
import com.williamtravel.app.service.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * REST Controller for Authentication operations
 * Provides endpoints for login, register, logout, and password reset
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * User login endpoint
     * @param loginRequest Login credentials (email/username and password)
     * @return LoginResponse with JWT token or error message
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authenticationService.login(loginRequest);
            logger.info("User logged in successfully: {}", loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.warn("Login failed for user: {}", loginRequest.getUsername());
            // Return 401 for authentication failures
            LoginResponse errorResponse = new LoginResponse();
            errorResponse.setAccess_token(null);
            errorResponse.setToken_type("Bearer");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    /**
     * User registration endpoint
     * @param registerRequest Registration data (email, password, full_name, optional role_id)
     * @return RegisterResponse with user info and JWT token or error message
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            RegisterResponse response = authenticationService.register(registerRequest);
            logger.info("User registered successfully: {}", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            logger.warn("Registration failed for user: {}", registerRequest.getEmail());
            // Return 400 for registration failures (e.g., email already exists)
            RegisterResponse errorResponse = new RegisterResponse();
            errorResponse.setUser(null);
            errorResponse.setAccess_token(null);
            errorResponse.setToken_type("Bearer");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * User logout endpoint
     * Note: With JWT, logout is typically handled client-side by discarding the token
     * This endpoint can be used for logging purposes or token blacklisting if implemented
     * @return LogoutResponse confirming logout
     */
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() {
        try {
            LogoutResponse response = authenticationService.logout();
            logger.info("User logged out successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Logout failed", e);
            LogoutResponse errorResponse = new LogoutResponse();
            errorResponse.setMessage("Logout failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Password reset request endpoint
     * @param request Password reset request containing email
     * @return PasswordResetResponse confirming reset email was sent
     */
    @PostMapping("/password-reset")
    public ResponseEntity<PasswordResetResponse> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        try {
            PasswordResetResponse response = authenticationService.requestPasswordReset(request);
            logger.info("Password reset requested for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing password reset request", e);
            // Always return success for security reasons (don't reveal if email exists)
            PasswordResetResponse response = new PasswordResetResponse();
            response.setMessage("If the email exists, a password reset link will be sent.");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Password reset confirmation endpoint
     * @param request Password reset confirmation containing token and new password
     * @return PasswordResetResponse confirming password was reset
     */
    @PostMapping("/password-reset/confirm")
    public ResponseEntity<PasswordResetResponse> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        try {
            PasswordResetResponse response = authenticationService.confirmPasswordReset(request);
            logger.info("Password reset confirmed for token: {}", request.getToken());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.warn("Password reset confirmation failed: Invalid or expired token");
            PasswordResetResponse errorResponse = new PasswordResetResponse();
            errorResponse.setMessage("Invalid or expired reset token");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * Health check endpoint for authentication service
     * @return Simple status response
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Authentication service is running");
    }

    /**
     * Check if email exists (for frontend validation)
     * @param email Email to check
     * @return Boolean indicating if email exists
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        try {
            boolean exists = authenticationService.emailExists(email);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            logger.error("Error checking if email exists: {}", email, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }
}
