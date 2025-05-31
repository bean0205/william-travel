package com.williamtravel.app.repository;

import com.williamtravel.app.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for PasswordResetToken entity
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    
    /**
     * Find token by token string
     */
    Optional<PasswordResetToken> findByToken(String token);
    
    /**
     * Find tokens by user ID
     */
    List<PasswordResetToken> findByUserId(Integer userId);
    
    /**
     * Find valid (not used and not expired) tokens
     */
    @Query("SELECT prt FROM PasswordResetToken prt WHERE " +
           "prt.token = :token AND " +
           "prt.isUsed = false AND " +
           "prt.expiresAt > :currentTime")
    Optional<PasswordResetToken> findValidToken(@Param("token") String token, 
                                               @Param("currentTime") LocalDateTime currentTime);
    
    /**
     * Find tokens by user and validity
     */
    @Query("SELECT prt FROM PasswordResetToken prt WHERE " +
           "prt.user.id = :userId AND " +
           "prt.isUsed = false AND " +
           "prt.expiresAt > :currentTime")
    List<PasswordResetToken> findValidTokensByUserId(@Param("userId") Integer userId,
                                                    @Param("currentTime") LocalDateTime currentTime);
    
    /**
     * Delete expired tokens
     */
    @Modifying
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.expiresAt < :currentTime")
    void deleteExpiredTokens(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * Mark token as used
     */
    @Modifying
    @Query("UPDATE PasswordResetToken prt SET prt.isUsed = true WHERE prt.token = :token")
    void markTokenAsUsed(@Param("token") String token);
    
    /**
     * Delete tokens by user ID
     */
    void deleteByUserId(Integer userId);
}
