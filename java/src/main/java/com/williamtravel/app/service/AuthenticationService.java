package com.williamtravel.app.service;

import com.williamtravel.app.dto.*;
import com.williamtravel.app.entity.PasswordResetToken;
import com.williamtravel.app.entity.Role;
import com.williamtravel.app.entity.User;
import com.williamtravel.app.security.JwtTokenUtil;
import com.williamtravel.app.util.UserMapper;
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
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            
            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenUtil.generateToken(userDetails);
            
            return new LoginResponse(token);
            
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }
    }
    
    /**
     * Register new user and generate JWT token
     */
    public RegisterResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Get default role if not specified
        Role role;
        if (request.getRole_id() != null) {
            Optional<Role> optionalRole = roleService.findById(request.getRole_id());
            if (optionalRole.isEmpty()) {
                throw new RuntimeException("Invalid role ID");
            }
            role = optionalRole.get();
        } else {
            // Find default role
            role = roleService.findDefaultRole()
                .orElseThrow(() -> new RuntimeException("No default role found"));
        }
        
        // Create new user
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
        
        // Generate JWT token
        String token = jwtTokenUtil.generateToken(new org.springframework.security.core.userdetails.User(
            savedUser.getEmail(),
            savedUser.getHashedPassword(),
            java.util.Collections.emptyList()
        ));
        
        // Convert to response DTO
        UserResponse userResponse = UserMapper.toUserResponse(savedUser);
        
        return new RegisterResponse(userResponse, token);
    }
    
    /**
     * Request password reset token
     */
    public PasswordResetResponse requestPasswordReset(PasswordResetRequest request) {
        Optional<User> userOptional = userService.findByEmail(request.getEmail());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Delete any existing tokens for this user
            passwordResetTokenService.deleteByUserId(user.getId());
            
            // Create new reset token
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setExpiresAt(LocalDateTime.now().plusHours(1)); // 1 hour expiry
            resetToken.setIsUsed(false);
            resetToken.setCreatedAt(LocalDateTime.now());
            
            passwordResetTokenService.save(resetToken);
            
            // TODO: Send email with reset token
            // For now, we'll just return a success message
        }
        
        // Always return same message for security (don't reveal if email exists)
        return new PasswordResetResponse("If a user with this email exists, a password reset link has been sent.");
    }
    
    /**
     * Reset password using token
     */
    public LoginResponse resetPassword(PasswordResetConfirmRequest request) {
        // Find valid token
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenService
            .findValidToken(request.getToken(), LocalDateTime.now());
        
        if (tokenOptional.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset token");
        }
        
        PasswordResetToken resetToken = tokenOptional.get();
        User user = resetToken.getUser();
        
        // Update user password
        user.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userService.save(user);
        
        // Mark token as used
        passwordResetTokenService.markTokenAsUsed(request.getToken());
        
        // Generate new JWT token
        String token = jwtTokenUtil.generateToken(new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getHashedPassword(),
            java.util.Collections.emptyList()
        ));
        
        return new LoginResponse(token);
    }
    
    /**
     * Confirm password reset (alias for resetPassword method)
     */
    public PasswordResetResponse confirmPasswordReset(PasswordResetConfirmRequest request) {
        try {
            resetPassword(request);
            return new PasswordResetResponse("Password successfully reset. You can now log in with your new password.");
        } catch (RuntimeException e) {
            throw e; // Re-throw to be handled by controller
        }
    }
    
    /**
     * Logout user (for now just returns success message)
     */
    public LogoutResponse logout() {
        // With JWT, logout is typically handled client-side by removing the token
        // Server-side logout would require token blacklisting which is more complex
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
