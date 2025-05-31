package com.williamtravel.app.service;

import com.williamtravel.app.entity.User;
import com.williamtravel.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for User entity operations
 */
@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Find all users
     */
    public List<User> findAll() {
        return userRepository.findAll();
    }

    /**
     * Find user by ID
     */
    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    /**
     * Save user
     */
    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * Delete user by ID
     */
    public void deleteById(Integer id) {
        userRepository.deleteById(id);
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Find users by role
     */
    public List<User> findByRoleId(Integer roleId) {
        return userRepository.findByRoleId(roleId);
    }

    /**
     * Find active users
     */
    public List<User> findActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }

    /**
     * Find users by active status
     */
    public List<User> findByIsActive(Boolean isActive) {
        return userRepository.findByIsActive(isActive);
    }

    /**
     * Find superusers
     */
    public List<User> findSuperusers() {
        return userRepository.findByIsSuperuserTrue();
    }

    /**
     * Find users created between dates
     */
    public List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.findByCreatedAtBetween(startDate, endDate);
    }

    /**
     * Find users by full name containing (case insensitive)
     */
    public List<User> findByFullNameContainingIgnoreCase(String fullName) {
        return userRepository.findByFullNameContainingIgnoreCase(fullName);
    }

    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Count active users
     */
    public long countActiveUsers() {
        return userRepository.countActiveUsers();
    }

    /**
     * Count users by role
     */
    public long countByRoleId(Integer roleId) {
        return userRepository.countByRoleId(roleId);
    }

    /**
     * Find users with pagination and search
     */
    public Page<User> findUsersWithFilters(String search, Boolean isActive, Integer roleId, Pageable pageable) {
        return userRepository.findUsersWithFilters(search, isActive, roleId, pageable);
    }

    /**
     * Count total users
     */
    public long count() {
        return userRepository.count();
    }

    /**
     * Check if user exists by ID
     */
    public boolean existsById(Integer id) {
        return userRepository.existsById(id);
    }
}
