package com.williamtravel.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Stores user account information
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * Unique identifier for each user
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * User email address, used as login username
     */
    @Column(name = "email", length = 255, nullable = false, unique = true)
    private String email;

    /**
     * User full name
     */
    @Column(name = "full_name", length = 255, nullable = false)
    private String fullName;

    /**
     * Hashed password for security
     */
    @Column(name = "hashed_password", length = 255, nullable = false)
    private String hashedPassword;

    /**
     * Reference to user role in roles table
     */
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /**
     * Whether the user account is active
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    /**
     * Whether the user has superuser privileges
     */
    @Column(name = "is_superuser", nullable = false)
    private Boolean isSuperuser;

    /**
     * Timestamp when user was created
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when user was last updated
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user")
    private Set<Accommodation> accommodations = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Rating> ratings = new HashSet<>();

    @OneToMany(mappedBy = "author")
    private Set<Article> articles = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<ArticleComment> articleComments = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<ArticleReaction> articleReactions = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<CommunityPost> communityPosts = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<CommunityPostComment> communityPostComments = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<CommunityPostReaction> communityPostReactions = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Event> events = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<EventAttendee> eventAttendances = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Organizer> organizers = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<PasswordResetToken> passwordResetTokens = new HashSet<>();
}
