package com.william.travel.service;

import com.william.travel.entity.Continent;
import com.william.travel.entity.Country;
import com.william.travel.repository.ContinentRepository;
import com.william.travel.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ContinentService {

    private final ContinentRepository continentRepository;
    private final CountryRepository countryRepository;

    /**
     * Create a new continent
     */
    public Continent createContinent(Continent continent) {
        log.info("Creating new continent: {}", continent.getName());
        
        // Validate unique constraints
        if (continentRepository.existsByName(continent.getName())) {
            throw new IllegalArgumentException("Continent with name '" + continent.getName() + "' already exists");
        }
        
        if (continentRepository.existsByCode(continent.getCode())) {
            throw new IllegalArgumentException("Continent with code '" + continent.getCode() + "' already exists");
        }
        
        continent.setStatus(1); // Active
        continent.setCreatedDate(LocalDate.now());
        
        return continentRepository.save(continent);
    }

    /**
     * Get continent by ID
     */
    @Transactional(readOnly = true)
    public Optional<Continent> getContinentById(Long id) {
        return continentRepository.findById(id);
    }

    /**
     * Get continent by name
     */
    @Transactional(readOnly = true)
    public Optional<Continent> getContinentByName(String name) {
        return continentRepository.findByName(name);
    }

    /**
     * Get continent by code
     */
    @Transactional(readOnly = true)
    public Optional<Continent> getContinentByCode(String code) {
        return continentRepository.findByCode(code);
    }

    /**
     * Get all active continents
     */
    @Transactional(readOnly = true)
    public List<Continent> getAllActiveContinents() {
        return continentRepository.findActiveContinents();
    }

    /**
     * Get all continents
     */
    @Transactional(readOnly = true)
    public List<Continent> getAllContinents() {
        return continentRepository.findAll();
    }

    /**
     * Update continent
     */
    public Continent updateContinent(Long id, Continent continentDetails) {
        log.info("Updating continent with ID: {}", id);
        
        Continent continent = continentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Continent not found with ID: " + id));

        // Check for unique constraints if name or code is being changed
        if (!continent.getName().equals(continentDetails.getName()) &&
            continentRepository.existsByName(continentDetails.getName())) {
            throw new IllegalArgumentException("Continent with name '" + continentDetails.getName() + "' already exists");
        }
        
        if (!continent.getCode().equals(continentDetails.getCode()) &&
            continentRepository.existsByCode(continentDetails.getCode())) {
            throw new IllegalArgumentException("Continent with code '" + continentDetails.getCode() + "' already exists");
        }

        // Update fields
        continent.setName(continentDetails.getName());
        continent.setCode(continentDetails.getCode());
        continent.setNameCode(continentDetails.getNameCode());
        continent.setBackgroundImage(continentDetails.getBackgroundImage());
        continent.setLogo(continentDetails.getLogo());
        continent.setDescription(continentDetails.getDescription());
        continent.setDescriptionCode(continentDetails.getDescriptionCode());
        continent.setUpdatedDate(LocalDate.now());

        return continentRepository.save(continent);
    }

    /**
     * Activate continent
     */
    public Continent activateContinent(Long id) {
        log.info("Activating continent with ID: {}", id);
        
        Continent continent = continentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Continent not found with ID: " + id));
        
        continent.setStatus(1);
        continent.setUpdatedDate(LocalDate.now());
        
        return continentRepository.save(continent);
    }

    /**
     * Deactivate continent
     */
    public Continent deactivateContinent(Long id) {
        log.info("Deactivating continent with ID: {}", id);
        
        Continent continent = continentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Continent not found with ID: " + id));
        
        continent.setStatus(0);
        continent.setUpdatedDate(LocalDate.now());
        
        return continentRepository.save(continent);
    }

    /**
     * Delete continent (soft delete)
     */
    public void deleteContinent(Long id) {
        log.info("Deleting continent with ID: {}", id);
        
        Continent continent = continentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Continent not found with ID: " + id));
        
        // Check if continent has countries
        List<Country> countries = countryRepository.findByContinentId(id);
        if (!countries.isEmpty()) {
            throw new IllegalStateException("Cannot delete continent with associated countries. " +
                    "Please reassign or delete countries first.");
        }
        
        continent.setStatus(-1); // Deleted
        continent.setUpdatedDate(LocalDate.now());
        continentRepository.save(continent);
    }

    /**
     * Get continent by country ID
     */
    @Transactional(readOnly = true)
    public Optional<Continent> getContinentByCountryId(Long countryId) {
        return continentRepository.findByCountryId(countryId);
    }

    /**
     * Get countries in a continent
     */
    @Transactional(readOnly = true)
    public List<Country> getCountriesInContinent(Long continentId) {
        Continent continent = continentRepository.findById(continentId)
                .orElseThrow(() -> new IllegalArgumentException("Continent not found with ID: " + continentId));
        
        return countryRepository.findByContinentId(continentId);
    }

    /**
     * Count countries in continent
     */
    @Transactional(readOnly = true)
    public long countCountriesInContinent(Long continentId) {
        return countryRepository.countByContinentId(continentId);
    }

    /**
     * Check if continent exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return continentRepository.existsByName(name);
    }

    /**
     * Check if continent exists by code
     */
    @Transactional(readOnly = true)
    public boolean existsByCode(String code) {
        return continentRepository.existsByCode(code);
    }
}
