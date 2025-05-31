package com.williamtravel.app.service;

import com.williamtravel.app.entity.Ward;
import com.williamtravel.app.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Ward entity operations
 */
@Service
@Transactional
public class WardService {

    @Autowired
    private WardRepository wardRepository;

    /**
     * Find all wards
     */
    public List<Ward> findAll() {
        return wardRepository.findAll();
    }

    /**
     * Find ward by ID
     */
    public Optional<Ward> findById(Integer id) {
        return wardRepository.findById(id);
    }

    /**
     * Save ward
     */
    public Ward save(Ward ward) {
        return wardRepository.save(ward);
    }

    /**
     * Delete ward by ID
     */
    public void deleteById(Integer id) {
        wardRepository.deleteById(id);
    }

    /**
     * Count total wards
     */
    public long count() {
        return wardRepository.count();
    }

    /**
     * Check if ward exists by ID
     */
    public boolean existsById(Integer id) {
        return wardRepository.existsById(id);
    }

    /**
     * Find all wards with pagination
     */
    public Page<Ward> findAll(Pageable pageable) {
        return wardRepository.findAll(pageable);
    }

    // Basic finder methods
    public Optional<Ward> findByCode(String code) {
        return wardRepository.findByCode(code);
    }

    public Optional<Ward> findByName(String name) {
        return wardRepository.findByName(name);
    }

    public List<Ward> findByNameContainingIgnoreCase(String name) {
        return wardRepository.findByNameContainingIgnoreCase(name);
    }

    public boolean existsByCode(String code) {
        return wardRepository.existsByCode(code);
    }

    public boolean existsByName(String name) {
        return wardRepository.existsByName(name);
    }

    // Status-based queries
    public List<Ward> findByStatus(Integer status) {
        return wardRepository.findByStatus(status);
    }

    public Page<Ward> findByStatus(Integer status, Pageable pageable) {
        return wardRepository.findByStatus(status, pageable);
    }

    public List<Ward> findByStatusOrderByName(Integer status) {
        return wardRepository.findByStatusOrderByName(status);
    }

    // District relationship queries
    public List<Ward> findByDistrictId(Integer districtId) {
        return wardRepository.findByDistrictId(districtId);
    }

    public Page<Ward> findByDistrictId(Integer districtId, Pageable pageable) {
        return wardRepository.findByDistrictId(districtId, pageable);
    }

    public List<Ward> findByDistrictIdAndStatus(Integer districtId, Integer status) {
        return wardRepository.findByDistrictIdAndStatus(districtId, status);
    }

    public Page<Ward> findByDistrictIdAndStatus(Integer districtId, Integer status, Pageable pageable) {
        return wardRepository.findByDistrictIdAndStatus(districtId, status, pageable);
    }

    public List<Ward> findByDistrictIdWithDistrict(Integer districtId) {
        return wardRepository.findByDistrictIdWithDistrict(districtId);
    }

    public List<Ward> findByDistrictIdAndStatusWithFullHierarchy(Integer districtId, Integer status) {
        return wardRepository.findByDistrictIdAndStatusWithFullHierarchy(districtId, status);
    }

    // Region-based queries through district
    public List<Ward> findByRegionId(Integer regionId) {
        return wardRepository.findByRegionId(regionId);
    }

    public List<Ward> findByRegionIdAndStatus(Integer regionId, Integer status) {
        return wardRepository.findByRegionIdAndStatus(regionId, status);
    }

    // Country-based queries through district and region
    public List<Ward> findByCountryId(Integer countryId) {
        return wardRepository.findByCountryId(countryId);
    }

    public List<Ward> findByCountryIdAndStatus(Integer countryId, Integer status) {
        return wardRepository.findByCountryIdAndStatus(countryId, status);
    }

    // Count queries
    public long countByDistrictId(Integer districtId) {
        return wardRepository.countByDistrictId(districtId);
    }

    public long countByDistrictIdAndStatus(Integer districtId, Integer status) {
        return wardRepository.countByDistrictIdAndStatus(districtId, status);
    }

    public long countByStatus(Integer status) {
        return wardRepository.countByStatus(status);
    }

    public long countByRegionId(Integer regionId) {
        return wardRepository.countByRegionId(regionId);
    }

    public long countByCountryId(Integer countryId) {
        return wardRepository.countByCountryId(countryId);
    }

    // Search and filtering
    public Page<Ward> findWithFilters(String name, String code, Integer districtId, Integer status, Pageable pageable) {
        return wardRepository.findWithFilters(name, code, districtId, status, pageable);
    }

    public List<Ward> searchByNameWithFullHierarchy(String name, Integer status) {
        return wardRepository.searchByNameWithFullHierarchy(name, status);
    }

    // Date-based queries
    public List<Ward> findByCreatedDate(LocalDate createdDate) {
        return wardRepository.findByCreatedDate(createdDate);
    }

    public List<Ward> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate) {
        return wardRepository.findByCreatedDateBetween(startDate, endDate);
    }

    public List<Ward> findByUpdatedDate(LocalDate updatedDate) {
        return wardRepository.findByUpdatedDate(updatedDate);
    }

    // Advanced queries with relationships
    public Optional<Ward> findByIdWithLocations(Integer id) {
        return wardRepository.findByIdWithLocations(id);
    }

    public Optional<Ward> findByIdWithAccommodations(Integer id) {
        return wardRepository.findByIdWithAccommodations(id);
    }

    public Optional<Ward> findByIdWithFoods(Integer id) {
        return wardRepository.findByIdWithFoods(id);
    }

    public Optional<Ward> findByIdWithEvents(Integer id) {
        return wardRepository.findByIdWithEvents(id);
    }

    // Statistics queries
    public List<Object[]> findWardsWithLocationCount() {
        return wardRepository.findWardsWithLocationCount();
    }

    public List<Object[]> findWardsWithAccommodationCount() {
        return wardRepository.findWardsWithAccommodationCount();
    }

    public List<Object[]> findWardsWithFoodCount() {
        return wardRepository.findWardsWithFoodCount();
    }

    public List<Object[]> findWardsWithEventCount() {
        return wardRepository.findWardsWithEventCount();
    }

    // Validation queries
    public boolean existsByCodeAndIdNot(String code, Integer id) {
        return wardRepository.existsByCodeAndIdNot(code, id);
    }

    public boolean existsByNameAndIdNot(String name, Integer id) {
        return wardRepository.existsByNameAndIdNot(name, id);
    }

    public boolean existsByDistrictIdAndCodeAndIdNot(Integer districtId, String code, Integer id) {
        return wardRepository.existsByDistrictIdAndCodeAndIdNot(districtId, code, id);
    }

    // Custom queries for specific business logic
    public List<Ward> findActiveWardsByDistrict(Integer districtId) {
        return wardRepository.findActiveWardsByDistrict(districtId);
    }

    public List<Ward> findActiveWardsWithBackgroundImage() {
        return wardRepository.findActiveWardsWithBackgroundImage();
    }

    public List<Ward> findActiveWardsWithLogo() {
        return wardRepository.findActiveWardsWithLogo();
    }

    public List<Ward> findActiveWardsByRegionOrderedByDistrict(Integer regionId) {
        return wardRepository.findActiveWardsByRegionOrderedByDistrict(regionId);
    }

    public List<Ward> findActiveWardsByCountryOrderedByHierarchy(Integer countryId) {
        return wardRepository.findActiveWardsByCountryOrderedByHierarchy(countryId);
    }
}
