package com.william.travel.service;

import com.william.travel.entity.Organizer;
import com.william.travel.entity.User;
import com.william.travel.entity.Event;
import com.william.travel.repository.OrganizerRepository;
import com.william.travel.repository.UserRepository;
import com.william.travel.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrganizerService {

    private final OrganizerRepository organizerRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    /**
     * Create a new organizer
     */
    public Organizer createOrganizer(Organizer organizer) {
        log.info("Creating new organizer: {} for user: {}", organizer.getName(), organizer.getUser().getId());
        
        // Validate user exists
        if (organizer.getUser() == null || organizer.getUser().getId() == null) {
            throw new IllegalArgumentException("User is required for organizer");
        }
        
        User user = userRepository.findById(organizer.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + organizer.getUser().getId()));
        
        // Validate unique constraints
        if (organizerRepository.existsByName(organizer.getName())) {
            throw new IllegalArgumentException("Organizer with name '" + organizer.getName() + "' already exists");
        }
        
        if (organizer.getEmail() != null && organizerRepository.existsByEmail(organizer.getEmail())) {
            throw new IllegalArgumentException("Organizer with email '" + organizer.getEmail() + "' already exists");
        }
        
        organizer.setUser(user);
        organizer.setStatus(true); // Active
        
        return organizerRepository.save(organizer);
    }

    /**
     * Get organizer by ID
     */
    @Transactional(readOnly = true)
    public Optional<Organizer> getOrganizerById(Long id) {
        return organizerRepository.findById(id);
    }

    /**
     * Get organizer by name
     */
    @Transactional(readOnly = true)
    public Optional<Organizer> getOrganizerByName(String name) {
        return organizerRepository.findByName(name);
    }

    /**
     * Get organizer by email
     */
    @Transactional(readOnly = true)
    public Optional<Organizer> getOrganizerByEmail(String email) {
        return organizerRepository.findByEmail(email);
    }

    /**
     * Get all active organizers with pagination
     */
    @Transactional(readOnly = true)
    public Page<Organizer> getAllActiveOrganizers(Pageable pageable) {
        return organizerRepository.findActiveOrganizers(pageable);
    }

    /**
     * Search active organizers by name with pagination
     */
    @Transactional(readOnly = true)
    public Page<Organizer> searchActiveOrganizersByName(String name, Pageable pageable) {
        return organizerRepository.findActiveByNameContaining(name, pageable);
    }

    /**
     * Get organizers by user ID
     */
    @Transactional(readOnly = true)
    public List<Organizer> getOrganizersByUserId(Long userId) {
        return organizerRepository.findByUserId(userId);
    }

    /**
     * Get all organizers
     */
    @Transactional(readOnly = true)
    public List<Organizer> getAllOrganizers() {
        return organizerRepository.findAll();
    }

    /**
     * Update organizer
     */
    public Organizer updateOrganizer(Long id, Organizer organizerDetails) {
        log.info("Updating organizer with ID: {}", id);
        
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + id));

        // Validate user if being changed
        if (organizerDetails.getUser() != null && organizerDetails.getUser().getId() != null &&
            !organizerDetails.getUser().getId().equals(organizer.getUser().getId())) {
            
            User newUser = userRepository.findById(organizerDetails.getUser().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + organizerDetails.getUser().getId()));
            
            organizer.setUser(newUser);
        }

        // Check for unique constraints if name or email is being changed
        if (!organizer.getName().equals(organizerDetails.getName()) &&
            organizerRepository.existsByName(organizerDetails.getName())) {
            throw new IllegalArgumentException("Organizer with name '" + organizerDetails.getName() + "' already exists");
        }
        
        if (organizerDetails.getEmail() != null && 
            !organizerDetails.getEmail().equals(organizer.getEmail()) &&
            organizerRepository.existsByEmail(organizerDetails.getEmail())) {
            throw new IllegalArgumentException("Organizer with email '" + organizerDetails.getEmail() + "' already exists");
        }

        // Update fields
        organizer.setName(organizerDetails.getName());
        organizer.setNameCode(organizerDetails.getNameCode());
        organizer.setDescription(organizerDetails.getDescription());
        organizer.setDescriptionCode(organizerDetails.getDescriptionCode());
        organizer.setEmail(organizerDetails.getEmail());
        organizer.setPhone(organizerDetails.getPhone());
        organizer.setWebsite(organizerDetails.getWebsite());

        return organizerRepository.save(organizer);
    }

    /**
     * Activate organizer
     */
    public Organizer activateOrganizer(Long id) {
        log.info("Activating organizer with ID: {}", id);
        
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + id));
        
        organizer.setStatus(true);
        
        return organizerRepository.save(organizer);
    }

    /**
     * Deactivate organizer
     */
    public Organizer deactivateOrganizer(Long id) {
        log.info("Deactivating organizer with ID: {}", id);
        
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + id));
        
        organizer.setStatus(false);
        
        return organizerRepository.save(organizer);
    }

    /**
     * Delete organizer (soft delete)
     */
    public void deleteOrganizer(Long id) {
        log.info("Deleting organizer with ID: {}", id);
        
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + id));
        
        // Check if organizer has events
        List<Event> events = eventRepository.findByOrganizerId(id);
        if (!events.isEmpty()) {
            throw new IllegalStateException("Cannot delete organizer with associated events. " +
                    "Please reassign or delete events first.");
        }
        
        organizer.setStatus(false); // Deactivated (soft delete)
        organizerRepository.save(organizer);
    }

    /**
     * Get events organized by this organizer
     */
    @Transactional(readOnly = true)
    public List<Event> getEventsForOrganizer(Long organizerId) {
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + organizerId));
        
        return eventRepository.findByOrganizerId(organizerId);
    }

    /**
     * Count events for organizer
     */
    @Transactional(readOnly = true)
    public long countEventsForOrganizer(Long organizerId) {
        return eventRepository.countByOrganizerId(organizerId);
    }

    /**
     * Count organizers for user
     */
    @Transactional(readOnly = true)
    public long countOrganizersForUser(Long userId) {
        return organizerRepository.countByUserId(userId);
    }

    /**
     * Check if organizer exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return organizerRepository.existsByName(name);
    }

    /**
     * Check if organizer exists by email
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return organizerRepository.existsByEmail(email);
    }

    /**
     * Validate organizer ownership by user
     */
    @Transactional(readOnly = true)
    public boolean isOrganizerOwnedByUser(Long organizerId, Long userId) {
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + organizerId));
        
        return organizer.getUser().getId().equals(userId);
    }
}
