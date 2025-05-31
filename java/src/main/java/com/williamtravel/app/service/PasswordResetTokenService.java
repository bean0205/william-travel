package com.williamtravel.app.service;

import com.williamtravel.app.entity.PasswordResetToken;
import com.williamtravel.app.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for PasswordResetToken entity operations
 */
@Service
@Transactional
public class PasswordResetTokenService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    /**
     * Find all password reset tokens
     */
    public List<PasswordResetToken> findAll() {
        return passwordResetTokenRepository.findAll();
    }

    /**
     * Find password reset token by ID
     */
    public Optional<PasswordResetToken> findById(Integer id) {
        return passwordResetTokenRepository.findById(id);
    }

    /**
     * Save password reset token
     */
    public PasswordResetToken save(PasswordResetToken passwordResetToken) {
        return passwordResetTokenRepository.save(passwordResetToken);
    }

    /**
     * Delete password reset token by ID
     */
    public void deleteById(Integer id) {
        passwordResetTokenRepository.deleteById(id);
    }

    /**
     * Count total password reset tokens
     */
    public long count() {
        return passwordResetTokenRepository.count();
    }

    /**
     * Check if password reset token exists by ID
     */
    public boolean existsById(Integer id) {
        return passwordResetTokenRepository.existsById(id);
    }

    /**
     * Find token by token string
     */
    public Optional<PasswordResetToken> findByToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    /**
     * Find tokens by user ID
     */
    public List<PasswordResetToken> findByUserId(Integer userId) {
        return passwordResetTokenRepository.findByUserId(userId);
    }

    /**
     * Find valid (not used and not expired) token
     */
    public Optional<PasswordResetToken> findValidToken(String token, LocalDateTime currentTime) {
        return passwordResetTokenRepository.findValidToken(token, currentTime);
    }

    /**
     * Find valid tokens by user ID
     */
    public List<PasswordResetToken> findValidTokensByUserId(Integer userId, LocalDateTime currentTime) {
        return passwordResetTokenRepository.findValidTokensByUserId(userId, currentTime);
    }

    /**
     * Delete expired tokens
     */
    public void deleteExpiredTokens(LocalDateTime currentTime) {
        passwordResetTokenRepository.deleteExpiredTokens(currentTime);
    }

    /**
     * Mark token as used
     */
    public void markTokenAsUsed(String token) {
        passwordResetTokenRepository.markTokenAsUsed(token);
    }

    /**
     * Delete tokens by user ID
     */
    public void deleteByUserId(Integer userId) {
        passwordResetTokenRepository.deleteByUserId(userId);
    }
}
