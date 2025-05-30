package com.william.travel.service;

import com.william.travel.entity.Location;
import com.william.travel.entity.LocationCategory;
import com.william.travel.repository.LocationRepository;
import com.william.travel.repository.LocationCategoryRepository;
import com.william.travel.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LocationService {
    
    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private LocationCategoryRepository locationCategoryRepository;
    
    @Autowired
    private WardRepository wardRepository;
    
    // Location CRUD Operations
    public Location createLocation(Location location) {
        // Validate ward exists
        if (location.getWard() != null && location.getWard().getId() != null) {
            wardRepository.findById(location.getWard().getId())
                .orElseThrow(() -> new RuntimeException("Ward not found"));
        }
        
        // Validate category exists
        if (location.getCategory() != null && location.getCategory().getId() != null) {
            locationCategoryRepository.findById(location.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Location category not found"));
        }
        
        location.setIsActive(true);
        return locationRepository.save(location);
    }
    
    public Optional<Location> findById(Long id) {
        return locationRepository.findById(id);
    }
    
    public Page<Location> findActiveLocations(Pageable pageable) {
        return locationRepository.findActiveLocations(pageable);
    }
    
    public Page<Location> findLocationsByCategory(Long categoryId, Pageable pageable) {
        return locationRepository.findActiveByCategoryId(categoryId, pageable);
    }
    
    public List<Location> findLocationsByWard(Long wardId) {
        return locationRepository.findActiveByWardId(wardId);
    }
    
    public List<Location> findLocationsByDistrict(Long districtId) {
        return locationRepository.findActiveByDistrictId(districtId);
    }
    
    public List<Location> findLocationsByRegion(Long regionId) {
        return locationRepository.findActiveByRegionId(regionId);
    }
    
    public Page<Location> findLocationsByCountry(Long countryId, Pageable pageable) {
        return locationRepository.findActiveByCountryId(countryId, pageable);
    }
    
    public Page<Location> searchLocationsByName(String name, Pageable pageable) {
        return locationRepository.findActiveByNameContaining(name, pageable);
    }
    
    public List<Location> findLocationsWithinRadius(BigDecimal latitude, BigDecimal longitude, Double radiusKm) {
        return locationRepository.findActiveWithinRadius(latitude, longitude, radiusKm);
    }
    
    public Location updateLocation(Long id, Location locationDetails) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location not found"));
        
        // Validate ward if provided
        if (locationDetails.getWard() != null && locationDetails.getWard().getId() != null) {
            wardRepository.findById(locationDetails.getWard().getId())
                .orElseThrow(() -> new RuntimeException("Ward not found"));
        }
        
        // Validate category if provided
        if (locationDetails.getCategory() != null && locationDetails.getCategory().getId() != null) {
            locationCategoryRepository.findById(locationDetails.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Location category not found"));
        }
        
        location.setName(locationDetails.getName());
        location.setDescription(locationDetails.getDescription());
        location.setAddress(locationDetails.getAddress());
        location.setLatitude(locationDetails.getLatitude());
        location.setLongitude(locationDetails.getLongitude());
        location.setContactInfo(locationDetails.getContactInfo());
        location.setOpeningHours(locationDetails.getOpeningHours());
        location.setWard(locationDetails.getWard());
        location.setCategory(locationDetails.getCategory());
        
        return locationRepository.save(location);
    }
    
    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location not found"));
        location.setIsActive(false);
        locationRepository.save(location);
    }
    
    // Location Category Management
    public List<LocationCategory> findAllActiveCategories() {
        return locationCategoryRepository.findActiveCategories();
    }
    
    public LocationCategory createLocationCategory(LocationCategory category) {
        if (locationCategoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Location category name already exists");
        }
        category.setIsActive(true);
        return locationCategoryRepository.save(category);
    }
    
    public LocationCategory updateLocationCategory(Long id, LocationCategory categoryDetails) {
        LocationCategory category = locationCategoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location category not found"));
        
        if (!category.getName().equals(categoryDetails.getName()) && 
            locationCategoryRepository.existsByName(categoryDetails.getName())) {
            throw new RuntimeException("Location category name already exists");
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setIcon(categoryDetails.getIcon());
        
        return locationCategoryRepository.save(category);
    }
    
    public void deleteLocationCategory(Long id) {
        LocationCategory category = locationCategoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location category not found"));
        category.setIsActive(false);
        locationCategoryRepository.save(category);
    }
    
    // Utility Methods
    public Double calculateDistance(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
        // Haversine formula to calculate distance between two points
        double earthRadius = 6371; // Earth radius in kilometers
        
        double dLat = Math.toRadians(lat2.doubleValue() - lat1.doubleValue());
        double dLon = Math.toRadians(lon2.doubleValue() - lon1.doubleValue());
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1.doubleValue())) * Math.cos(Math.toRadians(lat2.doubleValue())) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return earthRadius * c;
    }
    
    public List<Location> findNearbyLocations(Long locationId, Double radiusKm) {
        Location location = locationRepository.findById(locationId)
            .orElseThrow(() -> new RuntimeException("Location not found"));
        
        return findLocationsWithinRadius(location.getLatitude(), location.getLongitude(), radiusKm);
    }
}
