package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Stores password reset tokens
 */
@Entity
@Table(name = "password_reset_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    /**
     * Unique identifier for each token
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Unique token for password reset
     */
    @Column(name = "token", length = 255, nullable = false, unique = true)
    private String token;

    /**
     * Reference to the user
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Expiration timestamp for the token
     */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * Whether the token has been used
     */
    @Column(name = "is_used", nullable = false)
    private Boolean isUsed;

    /**
     * Timestamp when token was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
