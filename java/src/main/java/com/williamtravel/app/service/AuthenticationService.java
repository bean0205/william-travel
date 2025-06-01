package com.williamtravel.app.service;

import com.williamtravel.app.dto.*;
import com.williamtravel.app.entity.PasswordResetToken;
import com.williamtravel.app.entity.Role;
import com.williamtravel.app.entity.User;
import com.williamtravel.app.security.JwtTokenUtil;
import com.williamtravel.app.util.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for authentication operations
 */
@Service
@Transactional
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleService roleService;
    
    @Autowired
    private PasswordResetTokenService passwordResetTokenService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Authenticate user and generate JWT token
     */
    public LoginResponse login(LoginRequest request) {
        try {
            // Authenticate user credentials
            logger.info("Attempting to authenticate user: {}", request.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            logger.info("Successfully authenticated user: {}", request.getUsername());
            String token = jwtTokenUtil.generateToken(userDetails);
            logger.info("JWT token generated for user: {}", request.getUsername());
            
            return new LoginResponse(token);
            
        } catch (BadCredentialsException e) {
            logger.warn("Authentication failed for user: {}", request.getUsername());
            throw new RuntimeException("Invalid email or password");
        }
    }
    
    /**
     * Register new user and generate JWT token
     */
    public RegisterResponse register(RegisterRequest request) {
        logger.info("Processing registration for email: {}", request.getEmail());
        
        // Check if email already exists
        if (userService.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: Email already registered - {}", request.getEmail());
            throw new RuntimeException("Email already registered");
        }
        
        // Get default role if not specified
        Role role;
        if (request.getRole_id() != null) {
            logger.info("Fetching role with ID: {}", request.getRole_id());
            Optional<Role> optionalRole = roleService.findById(request.getRole_id());
            if (optionalRole.isEmpty()) {
                logger.warn("Registration failed: Invalid role ID - {}", request.getRole_id());
                throw new RuntimeException("Invalid role ID");
            }
            role = optionalRole.get();
        } else {
            // Find default role
            logger.info("No role specified, using default role");
            try {
                role = roleService.findDefaultRole()
                    .orElseThrow(() -> new RuntimeException("No default role found"));
                logger.info("Using default role: {}", role.getName());
            } catch (RuntimeException e) {
                logger.error("Registration failed: No default role found");
                throw e;
            }
        }
        
        // Create new user
        logger.info("Creating new user with email: {}", request.getEmail());
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFull_name());
        user.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setIsActive(true);
        user.setIsSuperuser(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        // Save user
        User savedUser = userService.save(user);
        logger.info("User successfully created with ID: {}", savedUser.getId());
        
        // Generate JWT token
        logger.info("Generating JWT token for new user: {}", savedUser.getEmail());
        String token = jwtTokenUtil.generateToken(new org.springframework.security.core.userdetails.User(
            savedUser.getEmail(),
            savedUser.getHashedPassword(),
            java.util.Collections.emptyList()
        ));
        
        // Convert to response DTO
        UserResponse userResponse = UserMapper.toUserResponse(savedUser);
        
        logger.info("Registration completed successfully for: {}", request.getEmail());
        return new RegisterResponse(userResponse, token);
    }
    
    /**
     * Request password reset token
     */
    public PasswordResetResponse requestPasswordReset(PasswordResetRequest request) {
        logger.info("Processing password reset request for email: {}", request.getEmail());
        
        Optional<User> userOptional = userService.findByEmail(request.getEmail());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            logger.info("User found for password reset: {}", user.getEmail());
            
            // Delete any existing tokens for this user
            logger.info("Deleting existing reset tokens for user ID: {}", user.getId());
            passwordResetTokenService.deleteByUserId(user.getId());
            
            // Create new reset token
            logger.info("Creating new password reset token for user ID: {}", user.getId());
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setExpiresAt(LocalDateTime.now().plusHours(1)); // 1 hour expiry
            resetToken.setIsUsed(false);
            resetToken.setCreatedAt(LocalDateTime.now());
            
            PasswordResetToken savedToken = passwordResetTokenService.save(resetToken);
            logger.info("Password reset token created with ID: {}", savedToken.getId());
            
            // TODO: Send email with reset token
            logger.info("Password reset token created, email delivery would be next step");
        } else {
            logger.info("Password reset requested for non-existent email: {}", request.getEmail());
        }
        
        // Always return same message for security (don't reveal if email exists)
        logger.info("Password reset flow completed for email: {}", request.getEmail());
        return new PasswordResetResponse("If a user with this email exists, a password reset link has been sent.");
    }
    
    /**
     * Reset password using token
     */
    public LoginResponse resetPassword(PasswordResetConfirmRequest request) {
        logger.info("Processing password reset with token");
        
        // Find valid token
        logger.info("Validating password reset token");
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenService
            .findValidToken(request.getToken(), LocalDateTime.now());
        
        if (tokenOptional.isEmpty()) {
            logger.warn("Invalid or expired password reset token used: {}", request.getToken());
            throw new RuntimeException("Invalid or expired reset token");
        }
        
        PasswordResetToken resetToken = tokenOptional.get();
        User user = resetToken.getUser();
        logger.info("Valid token found for user: {}", user.getEmail());
        
        // Update user password
        logger.info("Updating password for user ID: {}", user.getId());
        user.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userService.save(user);
        
        // Mark token as used
        logger.info("Marking token as used: {}", resetToken.getToken());
        passwordResetTokenService.markTokenAsUsed(request.getToken());
        
        // Generate new JWT token
        logger.info("Generating new JWT token for user: {}", user.getEmail());
        String token = jwtTokenUtil.generateToken(new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getHashedPassword(),
            java.util.Collections.emptyList()
        ));
        
        logger.info("Password reset completed successfully for user: {}", user.getEmail());
        return new LoginResponse(token);
    }
    
    /**
     * Confirm password reset (alias for resetPassword method)
     */
    public PasswordResetResponse confirmPasswordReset(PasswordResetConfirmRequest request) {
        logger.info("Confirming password reset with token");
        try {
            resetPassword(request);
            logger.info("Password reset confirmation successful");
            return new PasswordResetResponse("Password successfully reset. You can now log in with your new password.");
        } catch (RuntimeException e) {
            logger.error("Password reset confirmation failed: {}", e.getMessage());
            throw e; // Re-throw to be handled by controller
        }
    }
    
    /**
     * Logout user (for now just returns success message)
     */
    public LogoutResponse logout() {
        // With JWT, logout is typically handled client-side by removing the token
        // Server-side logout would require token blacklisting which is more complex
        logger.info("User logout processed - client-side token removal expected");
        return new LogoutResponse("Successfully logged out");
    }
    
    /**
     * Check if email exists in the system
     * @param email Email to check
     * @return true if email exists, false otherwise
     */
    public boolean emailExists(String email) {
        return userService.existsByEmail(email);
    }
}
