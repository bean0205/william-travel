package com.william.travel.service;

import com.william.travel.entity.Accommodation;
import com.william.travel.entity.AccommodationCategory;
import com.william.travel.entity.User;
import com.william.travel.repository.AccommodationRepository;
import com.william.travel.repository.AccommodationCategoryRepository;
import com.william.travel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final AccommodationCategoryRepository accommodationCategoryRepository;
    private final UserRepository userRepository;

    // CRUD Operations
    
    @Transactional
    public Accommodation createAccommodation(Accommodation accommodation, Long userId) {
        log.debug("Creating accommodation: {} for user: {}", accommodation.getName(), userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        accommodation.setUser(user);
        accommodation.setIsActive(true);
        
        return accommodationRepository.save(accommodation);
    }

    @Transactional
    public Accommodation updateAccommodation(Long id, Accommodation updatedAccommodation) {
        log.debug("Updating accommodation with id: {}", id);
        
        Accommodation existingAccommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accommodation not found with id: " + id));

        // Update fields
        existingAccommodation.setName(updatedAccommodation.getName());
        existingAccommodation.setNameCode(updatedAccommodation.getNameCode());
        existingAccommodation.setDescription(updatedAccommodation.getDescription());
        existingAccommodation.setDescriptionCode(updatedAccommodation.getDescriptionCode());
        existingAccommodation.setLatitude(updatedAccommodation.getLatitude());
        existingAccommodation.setLongitude(updatedAccommodation.getLongitude());
        existingAccommodation.setAddress(updatedAccommodation.getAddress());
        existingAccommodation.setCity(updatedAccommodation.getCity());
        existingAccommodation.setThumbnailUrl(updatedAccommodation.getThumbnailUrl());
        existingAccommodation.setPriceMin(updatedAccommodation.getPriceMin());
        existingAccommodation.setPriceMax(updatedAccommodation.getPriceMax());
        existingAccommodation.setCheckinTime(updatedAccommodation.getCheckinTime());
        existingAccommodation.setCheckoutTime(updatedAccommodation.getCheckoutTime());
        existingAccommodation.setCancelPolicy(updatedAccommodation.getCancelPolicy());
        existingAccommodation.setPetPolicy(updatedAccommodation.getPetPolicy());
        existingAccommodation.setChildPolicy(updatedAccommodation.getChildPolicy());
        
        if (updatedAccommodation.getCountry() != null) {
            existingAccommodation.setCountry(updatedAccommodation.getCountry());
        }
        if (updatedAccommodation.getRegion() != null) {
            existingAccommodation.setRegion(updatedAccommodation.getRegion());
        }
        if (updatedAccommodation.getDistrict() != null) {
            existingAccommodation.setDistrict(updatedAccommodation.getDistrict());
        }
        if (updatedAccommodation.getWard() != null) {
            existingAccommodation.setWard(updatedAccommodation.getWard());
        }
        if (updatedAccommodation.getCategory() != null) {
            existingAccommodation.setCategory(updatedAccommodation.getCategory());
        }

        return accommodationRepository.save(existingAccommodation);
    }

    @Transactional
    public void deleteAccommodation(Long id) {
        log.debug("Soft deleting accommodation with id: {}", id);
        
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Accommodation not found with id: " + id));
        
        accommodation.setIsActive(false);
        accommodationRepository.save(accommodation);
    }

    @Transactional
    public void hardDeleteAccommodation(Long id) {
        log.debug("Hard deleting accommodation with id: {}", id);
        accommodationRepository.deleteById(id);
    }

    // Read Operations

    public Optional<Accommodation> getAccommodationById(Long id) {
        log.debug("Finding accommodation by id: {}", id);
        return accommodationRepository.findById(id);
    }

    public Page<Accommodation> getAllActiveAccommodations(Pageable pageable) {
        log.debug("Finding all active accommodations with pagination");
        return accommodationRepository.findActiveAccommodations(pageable);
    }

    public Page<Accommodation> searchAccommodationsByName(String name, Pageable pageable) {
        log.debug("Searching accommodations by name: {}", name);
        return accommodationRepository.findActiveByNameContaining(name, pageable);
    }

    // Category-based searches

    public Page<Accommodation> getAccommodationsByCategory(Long categoryId, Pageable pageable) {
        log.debug("Finding accommodations by category id: {}", categoryId);
        return accommodationRepository.findActiveByCategoryId(categoryId, pageable);
    }

    // Geographic searches

    public Page<Accommodation> getAccommodationsByCountry(Long countryId, Pageable pageable) {
        log.debug("Finding accommodations by country id: {}", countryId);
        return accommodationRepository.findActiveByCountryId(countryId, pageable);
    }

    public List<Accommodation> getAccommodationsByRegion(Long regionId) {
        log.debug("Finding accommodations by region id: {}", regionId);
        return accommodationRepository.findActiveByRegionId(regionId);
    }

    public List<Accommodation> getAccommodationsByDistrict(Long districtId) {
        log.debug("Finding accommodations by district id: {}", districtId);
        return accommodationRepository.findActiveByDistrictId(districtId);
    }

    public List<Accommodation> getAccommodationsByWard(Long wardId) {
        log.debug("Finding accommodations by ward id: {}", wardId);
        return accommodationRepository.findActiveByWardId(wardId);
    }

    // Distance-based search

    public List<Accommodation> getAccommodationsWithinRadius(Double latitude, Double longitude, Double radiusKm) {
        log.debug("Finding accommodations within {} km of coordinates: {}, {}", radiusKm, latitude, longitude);
        return accommodationRepository.findActiveWithinRadius(latitude, longitude, radiusKm);
    }

    // Price-based search

    public Page<Accommodation> getAccommodationsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        log.debug("Finding accommodations with price range: {} - {}", minPrice, maxPrice);
        return accommodationRepository.findActiveByPriceRange(minPrice, maxPrice, pageable);
    }

    // Popularity-based search

    public Page<Accommodation> getAccommodationsByMinPopularity(Double minScore, Pageable pageable) {
        log.debug("Finding accommodations with minimum popularity score: {}", minScore);
        return accommodationRepository.findActiveByMinPopularityScore(minScore, pageable);
    }

    // Utility Methods

    @Transactional
    public Accommodation updatePopularityScore(Long accommodationId, Double score) {
        log.debug("Updating popularity score for accommodation {}: {}", accommodationId, score);
        
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new RuntimeException("Accommodation not found with id: " + accommodationId));
        
        accommodation.setPopularityScore(score);
        return accommodationRepository.save(accommodation);
    }

    @Transactional
    public Accommodation assignCategory(Long accommodationId, Long categoryId) {
        log.debug("Assigning category {} to accommodation {}", categoryId, accommodationId);
        
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new RuntimeException("Accommodation not found with id: " + accommodationId));
        
        AccommodationCategory category = accommodationCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Accommodation category not found with id: " + categoryId));
        
        accommodation.setCategory(category);
        return accommodationRepository.save(accommodation);
    }

    // Statistics

    public long getActiveAccommodationCount() {
        log.debug("Getting count of active accommodations");
        return accommodationRepository.findActiveAccommodations(Pageable.unpaged()).getTotalElements();
    }

    public long getAccommodationCountByCategory(Long categoryId) {
        log.debug("Getting count of accommodations in category: {}", categoryId);
        return accommodationRepository.findActiveByCategoryId(categoryId, Pageable.unpaged()).getTotalElements();
    }

    public long getAccommodationCountByCountry(Long countryId) {
        log.debug("Getting count of accommodations in country: {}", countryId);
        return accommodationRepository.findActiveByCountryId(countryId, Pageable.unpaged()).getTotalElements();
    }
}
