package com.williamtravel.app.controller;

import com.williamtravel.app.entity.PasswordResetToken;
import com.williamtravel.app.service.PasswordResetTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for PasswordResetToken operations
 */
@RestController
@RequestMapping("/api/password-reset-tokens")
@CrossOrigin(origins = "*")
public class PasswordResetTokenController {

    @Autowired
    private PasswordResetTokenService passwordResetTokenService;

    /**
     * Get all password reset tokens
     */
    @GetMapping
    public ResponseEntity<List<PasswordResetToken>> getAllPasswordResetTokens() {
        List<PasswordResetToken> tokens = passwordResetTokenService.findAll();
        return ResponseEntity.ok(tokens);
    }

    /**
     * Get password reset token by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PasswordResetToken> getPasswordResetTokenById(@PathVariable Integer id) {
        Optional<PasswordResetToken> token = passwordResetTokenService.findById(id);
        return token.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new password reset token
     */
    @PostMapping
    public ResponseEntity<PasswordResetToken> createPasswordResetToken(@RequestBody PasswordResetToken token) {
        PasswordResetToken savedToken = passwordResetTokenService.save(token);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedToken);
    }

    /**
     * Update password reset token
     */
    @PutMapping("/{id}")
    public ResponseEntity<PasswordResetToken> updatePasswordResetToken(@PathVariable Integer id, @RequestBody PasswordResetToken token) {
        if (!passwordResetTokenService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        token.setId(id);
        PasswordResetToken updatedToken = passwordResetTokenService.save(token);
        return ResponseEntity.ok(updatedToken);
    }

    /**
     * Delete password reset token
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePasswordResetToken(@PathVariable Integer id) {
        if (!passwordResetTokenService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        passwordResetTokenService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total password reset tokens
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countPasswordResetTokens() {
        long count = passwordResetTokenService.count();
        return ResponseEntity.ok(count);
    }

    /**
     * Check if password reset token exists by ID
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        boolean exists = passwordResetTokenService.existsById(id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Find token by token string
     */
    @GetMapping("/token/{token}")
    public ResponseEntity<PasswordResetToken> findByToken(@PathVariable String token) {
        Optional<PasswordResetToken> passwordResetToken = passwordResetTokenService.findByToken(token);
        return passwordResetToken.map(ResponseEntity::ok)
                                 .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Find tokens by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PasswordResetToken>> findByUserId(@PathVariable Integer userId) {
        List<PasswordResetToken> tokens = passwordResetTokenService.findByUserId(userId);
        return ResponseEntity.ok(tokens);
    }

    /**
     * Find valid (not used and not expired) token
     */
    @GetMapping("/valid/{token}")
    public ResponseEntity<PasswordResetToken> findValidToken(@PathVariable String token) {
        LocalDateTime currentTime = LocalDateTime.now();
        Optional<PasswordResetToken> passwordResetToken = passwordResetTokenService.findValidToken(token, currentTime);
        return passwordResetToken.map(ResponseEntity::ok)
                                 .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Find valid tokens by user ID
     */
    @GetMapping("/valid/user/{userId}")
    public ResponseEntity<List<PasswordResetToken>> findValidTokensByUserId(@PathVariable Integer userId) {
        LocalDateTime currentTime = LocalDateTime.now();
        List<PasswordResetToken> tokens = passwordResetTokenService.findValidTokensByUserId(userId, currentTime);
        return ResponseEntity.ok(tokens);
    }

    /**
     * Delete expired tokens
     */
    @DeleteMapping("/expired")
    public ResponseEntity<Void> deleteExpiredTokens() {
        LocalDateTime currentTime = LocalDateTime.now();
        passwordResetTokenService.deleteExpiredTokens(currentTime);
        return ResponseEntity.noContent().build();
    }

    /**
     * Mark token as used
     */
    @PutMapping("/mark-used/{token}")
    public ResponseEntity<Void> markTokenAsUsed(@PathVariable String token) {
        Optional<PasswordResetToken> existingToken = passwordResetTokenService.findByToken(token);
        if (existingToken.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        passwordResetTokenService.markTokenAsUsed(token);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete tokens by user ID
     */
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteByUserId(@PathVariable Integer userId) {
        passwordResetTokenService.deleteByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get valid token with current time parameter
     */
    @GetMapping("/valid/{token}/at")
    public ResponseEntity<PasswordResetToken> findValidTokenAtTime(
            @PathVariable String token,
            @RequestParam String currentTime) {
        try {
            LocalDateTime dateTime = LocalDateTime.parse(currentTime);
            Optional<PasswordResetToken> passwordResetToken = passwordResetTokenService.findValidToken(token, dateTime);
            return passwordResetToken.map(ResponseEntity::ok)
                                     .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get valid tokens by user ID with current time parameter
     */
    @GetMapping("/valid/user/{userId}/at")
    public ResponseEntity<List<PasswordResetToken>> findValidTokensByUserIdAtTime(
            @PathVariable Integer userId,
            @RequestParam String currentTime) {
        try {
            LocalDateTime dateTime = LocalDateTime.parse(currentTime);
            List<PasswordResetToken> tokens = passwordResetTokenService.findValidTokensByUserId(userId, dateTime);
            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete expired tokens at specific time
     */
    @DeleteMapping("/expired/at")
    public ResponseEntity<Void> deleteExpiredTokensAtTime(@RequestParam String currentTime) {
        try {
            LocalDateTime dateTime = LocalDateTime.parse(currentTime);
            passwordResetTokenService.deleteExpiredTokens(dateTime);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
