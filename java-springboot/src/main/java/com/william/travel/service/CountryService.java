package com.william.travel.service;

import com.william.travel.entity.Country;
import com.william.travel.entity.Continent;
import com.william.travel.repository.CountryRepository;
import com.william.travel.repository.ContinentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CountryService {

    private final CountryRepository countryRepository;
    private final ContinentRepository continentRepository;

    // CRUD Operations
    
    @Transactional
    public Country createCountry(Country country) {
        log.debug("Creating country: {}", country.getName());
        
        // Validate unique constraints
        if (countryRepository.existsByName(country.getName())) {
            throw new RuntimeException("Country with name '" + country.getName() + "' already exists");
        }
        
        if (country.getCode() != null && countryRepository.existsByCode(country.getCode())) {
            throw new RuntimeException("Country with code '" + country.getCode() + "' already exists");
        }
        
        country.setIsActive(true);
        return countryRepository.save(country);
    }

    @Transactional
    public Country updateCountry(Long id, Country updatedCountry) {
        log.debug("Updating country with id: {}", id);
        
        Country existingCountry = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));

        // Check for name conflicts (excluding current record)
        if (!existingCountry.getName().equals(updatedCountry.getName()) 
            && countryRepository.existsByName(updatedCountry.getName())) {
            throw new RuntimeException("Country with name '" + updatedCountry.getName() + "' already exists");
        }
        
        // Check for code conflicts (excluding current record)
        if (updatedCountry.getCode() != null 
            && !updatedCountry.getCode().equals(existingCountry.getCode())
            && countryRepository.existsByCode(updatedCountry.getCode())) {
            throw new RuntimeException("Country with code '" + updatedCountry.getCode() + "' already exists");
        }

        // Update fields
        existingCountry.setName(updatedCountry.getName());
        existingCountry.setNameCode(updatedCountry.getNameCode());
        existingCountry.setCode(updatedCountry.getCode());
        existingCountry.setDescription(updatedCountry.getDescription());
        existingCountry.setDescriptionCode(updatedCountry.getDescriptionCode());
        existingCountry.setThumbnailUrl(updatedCountry.getThumbnailUrl());
        
        if (updatedCountry.getContinent() != null) {
            existingCountry.setContinent(updatedCountry.getContinent());
        }

        return countryRepository.save(existingCountry);
    }

    @Transactional
    public void deleteCountry(Long id) {
        log.debug("Soft deleting country with id: {}", id);
        
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));
        
        country.setIsActive(false);
        countryRepository.save(country);
    }

    @Transactional
    public void hardDeleteCountry(Long id) {
        log.debug("Hard deleting country with id: {}", id);
        countryRepository.deleteById(id);
    }

    // Read Operations

    public Optional<Country> getCountryById(Long id) {
        log.debug("Finding country by id: {}", id);
        return countryRepository.findById(id);
    }

    public Optional<Country> getCountryByName(String name) {
        log.debug("Finding country by name: {}", name);
        return countryRepository.findByName(name);
    }

    public Optional<Country> getCountryByCode(String code) {
        log.debug("Finding country by code: {}", code);
        return countryRepository.findByCode(code);
    }

    public List<Country> getAllActiveCountries() {
        log.debug("Finding all active countries");
        return countryRepository.findActiveCountries();
    }

    // Continent-based searches

    public List<Country> getCountriesByContinent(Long continentId) {
        log.debug("Finding countries by continent id: {}", continentId);
        return countryRepository.findActiveByContinentId(continentId);
    }

    public List<Country> getCountriesByContinentCode(String continentCode) {
        log.debug("Finding countries by continent code: {}", continentCode);
        return countryRepository.findActiveByContinentCode(continentCode);
    }

    // Utility Methods

    @Transactional
    public Country assignContinent(Long countryId, Long continentId) {
        log.debug("Assigning continent {} to country {}", continentId, countryId);
        
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + countryId));
        
        Continent continent = continentRepository.findById(continentId)
                .orElseThrow(() -> new RuntimeException("Continent not found with id: " + continentId));
        
        country.setContinent(continent);
        return countryRepository.save(country);
    }

    @Transactional
    public Country activateCountry(Long id) {
        log.debug("Activating country with id: {}", id);
        
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));
        
        country.setIsActive(true);
        return countryRepository.save(country);
    }

    @Transactional
    public Country deactivateCountry(Long id) {
        log.debug("Deactivating country with id: {}", id);
        
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found with id: " + id));
        
        country.setIsActive(false);
        return countryRepository.save(country);
    }

    // Validation methods

    public boolean existsByName(String name) {
        return countryRepository.existsByName(name);
    }

    public boolean existsByCode(String code) {
        return countryRepository.existsByCode(code);
    }

    public boolean isCountryActive(Long countryId) {
        Optional<Country> countryOpt = countryRepository.findById(countryId);
        return countryOpt.map(Country::getIsActive).orElse(false);
    }

    // Statistics

    public long getActiveCountryCount() {
        log.debug("Getting count of active countries");
        return countryRepository.findActiveCountries().size();
    }

    public long getCountryCountByContinent(Long continentId) {
        log.debug("Getting count of countries in continent: {}", continentId);
        return countryRepository.findActiveByContinentId(continentId).size();
    }
}
