package com.williamtravel.app.service;

import com.williamtravel.app.entity.Continent;
import com.williamtravel.app.repository.ContinentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Continent entity operations
 */
@Service
@Transactional
public class ContinentService {

    @Autowired
    private ContinentRepository continentRepository;

    /**
     * Find all continents
     */
    public List<Continent> findAll() {
        return continentRepository.findAll();
    }

    /**
     * Find continent by ID
     */
    public Optional<Continent> findById(Integer id) {
        return continentRepository.findById(id);
    }

    /**
     * Save continent
     */
    public Continent save(Continent continent) {
        return continentRepository.save(continent);
    }

    /**
     * Delete continent by ID
     */
    public void deleteById(Integer id) {
        continentRepository.deleteById(id);
    }

    /**
     * Find continent by code
     */
    public Optional<Continent> findByCode(String code) {
        return continentRepository.findByCode(code);
    }

    /**
     * Find continent by name
     */
    public Optional<Continent> findByName(String name) {
        return continentRepository.findByName(name);
    }

    /**
     * Count total continents
     */
    public long count() {
        return continentRepository.count();
    }

    /**
     * Check if continent exists by ID
     */
    public boolean existsById(Integer id) {
        return continentRepository.existsById(id);
    }

    /**
     * Find all continents with pagination
     */
    public Page<Continent> findAll(Pageable pageable) {
        return continentRepository.findAll(pageable);
    }

    /**
     * Find continents by status
     */
    public List<Continent> findByStatus(Integer status) {
        return continentRepository.findByStatus(status);
    }

    /**
     * Find continents by name containing (case insensitive)
     */
    public List<Continent> findByNameContainingIgnoreCase(String name) {
        return continentRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Check if continent code exists
     */
    public boolean existsByCode(String code) {
        return continentRepository.existsByCode(code);
    }

    /**
     * Check if continent name exists
     */
    public boolean existsByName(String name) {
        return continentRepository.existsByName(name);
    }

    /**
     * Find continents with pagination and search
     */
    public Page<Continent> findContinentsWithFilters(String search, Integer status, Pageable pageable) {
        return continentRepository.findContinentsWithFilters(search, status, pageable);
    }

    /**
     * Find all continents with their countries
     */
    public List<Continent> findAllWithCountries() {
        return continentRepository.findAllWithCountries();
    }
}
