package com.williamtravel.app.controller;

import com.williamtravel.app.entity.User;
import com.williamtravel.app.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for User operations
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    /**
     * Get all users
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        logger.info("Fetching all users");
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        logger.info("Fetching user by ID: {}", id);
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new user
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        logger.info("Creating new user: {}", user);
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User user) {
        logger.info("Updating user with ID: {}", id);
        if (!userService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        user.setId(id);
        User updatedUser = userService.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        logger.info("Deleting user with ID: {}", id);
        if (!userService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get user by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        logger.info("Fetching user by email: {}", email);
        Optional<User> user = userService.findByEmail(email);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get users by role
     */
    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable Integer roleId) {
        logger.info("Fetching users by role ID: {}", roleId);
        List<User> users = userService.findByRoleId(roleId);
        return ResponseEntity.ok(users);
    }

    /**
     * Get active users
     */
    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        logger.info("Fetching active users");
        List<User> users = userService.findActiveUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get users by active status
     */
    @GetMapping("/status/{isActive}")
    public ResponseEntity<List<User>> getUsersByActiveStatus(@PathVariable Boolean isActive) {
        logger.info("Fetching users by active status: {}", isActive);
        List<User> users = userService.findByIsActive(isActive);
        return ResponseEntity.ok(users);
    }

    /**
     * Get superusers
     */
    @GetMapping("/superusers")
    public ResponseEntity<List<User>> getSuperusers() {
        logger.info("Fetching superusers");
        List<User> users = userService.findSuperusers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get users created between dates
     */
    @GetMapping("/created-between")
    public ResponseEntity<List<User>> getUsersCreatedBetween(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate) {
        logger.info("Fetching users created between: {} and {}", startDate, endDate);
        List<User> users = userService.findByCreatedAtBetween(startDate, endDate);
        return ResponseEntity.ok(users);
    }

    /**
     * Search users by full name
     */
    @GetMapping("/search/{fullName}")
    public ResponseEntity<List<User>> searchUsersByFullName(@PathVariable String fullName) {
        logger.info("Searching users by full name: {}", fullName);
        List<User> users = userService.findByFullNameContainingIgnoreCase(fullName);
        return ResponseEntity.ok(users);
    }

    /**
     * Check if email exists
     */
    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        logger.info("Checking if email exists: {}", email);
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    /**
     * Count active users
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveUsers() {
        long count = userService.countActiveUsers();
        logger.info("Counting active users: {}", count);
        return ResponseEntity.ok(count);
    }

    /**
     * Count users by role
     */
    @GetMapping("/count/role/{roleId}")
    public ResponseEntity<Long> countUsersByRole(@PathVariable Integer roleId) {
        long count = userService.countByRoleId(roleId);
        logger.info("Counting users by role ID {}: {}", roleId, count);
        return ResponseEntity.ok(count);
    }

    /**
     * Get users with filters and pagination
     */
    @GetMapping("/search")
    public ResponseEntity<Page<User>> getUsersWithFilters(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Integer roleId,
            Pageable pageable) {
        logger.info("Fetching users with filters - search: {}, isActive: {}, roleId: {}", search, isActive, roleId);
        Page<User> users = userService.findUsersWithFilters(search, isActive, roleId, pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * Count total users
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countUsers() {
        long count = userService.count();
        logger.info("Counting total users: {}", count);
        return ResponseEntity.ok(count);
    }
}
