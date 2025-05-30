package com.william.travel.service;

import com.william.travel.entity.Event;
import com.william.travel.entity.EventCategory;
import com.william.travel.entity.Organizer;
import com.william.travel.entity.User;
import com.william.travel.repository.EventRepository;
import com.william.travel.repository.EventCategoryRepository;
import com.william.travel.repository.OrganizerRepository;
import com.william.travel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventService {

    private final EventRepository eventRepository;
    private final EventCategoryRepository eventCategoryRepository;
    private final OrganizerRepository organizerRepository;
    private final UserRepository userRepository;

    // CRUD Operations
    
    @Transactional
    public Event createEvent(Event event, Long userId, Long organizerId) {
        log.debug("Creating event: {} for user: {}", event.getName(), userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found with id: " + organizerId));
        
        event.setUser(user);
        event.setOrganizer(organizer);
        event.setStatus(true);
        event.setViewCount(0);
        
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(Long id, Event updatedEvent) {
        log.debug("Updating event with id: {}", id);
        
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        // Update fields
        existingEvent.setName(updatedEvent.getName());
        existingEvent.setNameCode(updatedEvent.getNameCode());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setDescriptionCode(updatedEvent.getDescriptionCode());
        existingEvent.setContent(updatedEvent.getContent());
        existingEvent.setThumbnailUrl(updatedEvent.getThumbnailUrl());
        existingEvent.setStartTime(updatedEvent.getStartTime());
        existingEvent.setStartDate(updatedEvent.getStartDate());
        existingEvent.setEndDate(updatedEvent.getEndDate());
        existingEvent.setPrice(updatedEvent.getPrice());
        existingEvent.setMaxAttendees(updatedEvent.getMaxAttendees());
        
        if (updatedEvent.getOrganizer() != null) {
            existingEvent.setOrganizer(updatedEvent.getOrganizer());
        }
        if (updatedEvent.getCategory() != null) {
            existingEvent.setCategory(updatedEvent.getCategory());
        }
        if (updatedEvent.getCountry() != null) {
            existingEvent.setCountry(updatedEvent.getCountry());
        }
        if (updatedEvent.getRegion() != null) {
            existingEvent.setRegion(updatedEvent.getRegion());
        }
        if (updatedEvent.getDistrict() != null) {
            existingEvent.setDistrict(updatedEvent.getDistrict());
        }
        if (updatedEvent.getWard() != null) {
            existingEvent.setWard(updatedEvent.getWard());
        }

        return eventRepository.save(existingEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        log.debug("Soft deleting event with id: {}", id);
        
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setStatus(false);
        eventRepository.save(event);
    }

    @Transactional
    public void hardDeleteEvent(Long id) {
        log.debug("Hard deleting event with id: {}", id);
        eventRepository.deleteById(id);
    }

    // Read Operations

    public Optional<Event> getEventById(Long id) {
        log.debug("Finding event by id: {}", id);
        return eventRepository.findById(id);
    }

    public Page<Event> getAllActiveEvents(Pageable pageable) {
        log.debug("Finding all active events with pagination");
        return eventRepository.findActiveEvents(pageable);
    }

    public Page<Event> searchEvents(String searchTerm, Pageable pageable) {
        log.debug("Searching events by term: {}", searchTerm);
        return eventRepository.findActiveBySearchTerm(searchTerm, pageable);
    }

    // Category-based searches

    public Page<Event> getEventsByCategory(Long categoryId, Pageable pageable) {
        log.debug("Finding events by category id: {}", categoryId);
        return eventRepository.findActiveByCategoryId(categoryId, pageable);
    }

    // Organizer-based searches

    public Page<Event> getEventsByOrganizer(Long organizerId, Pageable pageable) {
        log.debug("Finding events by organizer id: {}", organizerId);
        return eventRepository.findActiveByOrganizerId(organizerId, pageable);
    }

    // User-based searches

    public Page<Event> getEventsByUser(Long userId, Pageable pageable) {
        log.debug("Finding events by user id: {}", userId);
        return eventRepository.findActiveByUserId(userId, pageable);
    }

    // Geographic searches

    public Page<Event> getEventsByCountry(Long countryId, Pageable pageable) {
        log.debug("Finding events by country id: {}", countryId);
        return eventRepository.findActiveByCountryId(countryId, pageable);
    }

    public List<Event> getEventsByRegion(Long regionId) {
        log.debug("Finding events by region id: {}", regionId);
        return eventRepository.findActiveByRegionId(regionId);
    }

    public List<Event> getEventsByDistrict(Long districtId) {
        log.debug("Finding events by district id: {}", districtId);
        return eventRepository.findActiveByDistrictId(districtId);
    }

    public List<Event> getEventsByWard(Long wardId) {
        log.debug("Finding events by ward id: {}", wardId);
        return eventRepository.findActiveByWardId(wardId);
    }

    // Date-based searches

    public Page<Event> getUpcomingEvents(Pageable pageable) {
        log.debug("Finding upcoming events");
        return eventRepository.findUpcomingEvents(LocalDate.now(), pageable);
    }

    public Page<Event> getPastEvents(Pageable pageable) {
        log.debug("Finding past events");
        return eventRepository.findPastEvents(LocalDate.now(), pageable);
    }

    public Page<Event> getEventsByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        log.debug("Finding events between {} and {}", startDate, endDate);
        return eventRepository.findActiveByDateRange(startDate, endDate, pageable);
    }

    // Utility Methods

    @Transactional
    public Event incrementViewCount(Long eventId) {
        log.debug("Incrementing view count for event: {}", eventId);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        event.setViewCount(event.getViewCount() + 1);
        return eventRepository.save(event);
    }

    @Transactional
    public Event assignCategory(Long eventId, Long categoryId) {
        log.debug("Assigning category {} to event {}", categoryId, eventId);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        EventCategory category = eventCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Event category not found with id: " + categoryId));
        
        event.setCategory(category);
        return eventRepository.save(event);
    }

    @Transactional
    public Event assignOrganizer(Long eventId, Long organizerId) {
        log.debug("Assigning organizer {} to event {}", organizerId, eventId);
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        Organizer organizer = organizerRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found with id: " + organizerId));
        
        event.setOrganizer(organizer);
        return eventRepository.save(event);
    }

    @Transactional
    public Event activateEvent(Long id) {
        log.debug("Activating event with id: {}", id);
        
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setStatus(true);
        return eventRepository.save(event);
    }

    @Transactional
    public Event deactivateEvent(Long id) {
        log.debug("Deactivating event with id: {}", id);
        
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setStatus(false);
        return eventRepository.save(event);
    }

    // Event status checks

    public boolean isEventActive(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        return eventOpt.map(Event::getStatus).orElse(false);
    }

    public boolean isEventUpcoming(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            return event.getStartDate().isAfter(LocalDate.now()) || 
                   event.getStartDate().isEqual(LocalDate.now());
        }
        return false;
    }

    public boolean isEventPast(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            LocalDate endDate = event.getEndDate() != null ? event.getEndDate() : event.getStartDate();
            return endDate.isBefore(LocalDate.now());
        }
        return false;
    }

    public boolean isEventOngoing(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent()) {
            Event event = eventOpt.get();
            LocalDate now = LocalDate.now();
            LocalDate endDate = event.getEndDate() != null ? event.getEndDate() : event.getStartDate();
            return !event.getStartDate().isAfter(now) && !endDate.isBefore(now);
        }
        return false;
    }

    // Statistics

    public long getActiveEventCount() {
        log.debug("Getting count of active events");
        return eventRepository.findActiveEvents(Pageable.unpaged()).getTotalElements();
    }

    public long getEventCountByCategory(Long categoryId) {
        log.debug("Getting count of events in category: {}", categoryId);
        return eventRepository.findActiveByCategoryId(categoryId, Pageable.unpaged()).getTotalElements();
    }

    public long getEventCountByOrganizer(Long organizerId) {
        log.debug("Getting count of events by organizer: {}", organizerId);
        return eventRepository.findActiveByOrganizerId(organizerId, Pageable.unpaged()).getTotalElements();
    }

    public long getEventCountByCountry(Long countryId) {
        log.debug("Getting count of events in country: {}", countryId);
        return eventRepository.findActiveByCountryId(countryId, Pageable.unpaged()).getTotalElements();
    }

    public long getUpcomingEventCount() {
        log.debug("Getting count of upcoming events");
        return eventRepository.findUpcomingEvents(LocalDate.now(), Pageable.unpaged()).getTotalElements();
    }

    public long getPastEventCount() {
        log.debug("Getting count of past events");
        return eventRepository.findPastEvents(LocalDate.now(), Pageable.unpaged()).getTotalElements();
    }
}
