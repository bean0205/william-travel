package com.william.travel.repository;

import com.william.travel.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    Optional<PasswordResetToken> findByUserIdAndIsUsedFalse(Long userId);
    
    @Query("SELECT prt FROM PasswordResetToken prt WHERE prt.expiresAt < :now AND prt.isUsed = false")
    List<PasswordResetToken> findExpiredTokens(@Param("now") LocalDateTime now);
    
    @Query("SELECT prt FROM PasswordResetToken prt WHERE prt.user.email = :email AND prt.isUsed = false ORDER BY prt.createdAt DESC")
    List<PasswordResetToken> findActiveTokensByEmail(@Param("email") String email);
    
    void deleteByUserId(Long userId);
}
