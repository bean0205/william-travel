package com.williamtravel.app.service;

import com.williamtravel.app.entity.Country;
import com.williamtravel.app.repository.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Country entity operations
 */
@Service
@Transactional
public class CountryService {

    @Autowired
    private CountryRepository countryRepository;

    /**
     * Find all countries
     */
    public List<Country> findAll() {
        return countryRepository.findAll();
    }

    /**
     * Find country by ID
     */
    public Optional<Country> findById(Integer id) {
        return countryRepository.findById(id);
    }

    /**
     * Save country
     */
    public Country save(Country country) {
        return countryRepository.save(country);
    }

    /**
     * Delete country by ID
     */
    public void deleteById(Integer id) {
        countryRepository.deleteById(id);
    }

    /**
     * Find country by code
     */
    public Optional<Country> findByCode(String code) {
        return countryRepository.findByCode(code);
    }

    /**
     * Find country by name
     */
    public Optional<Country> findByName(String name) {
        return countryRepository.findByName(name);
    }

    /**
     * Find countries by continent
     */
    public List<Country> findByContinentId(Integer continentId) {
        return countryRepository.findByContinentId(continentId);
    }

    /**
     * Find countries by status
     */
    public List<Country> findByStatus(Integer status) {
        return countryRepository.findByStatus(status);
    }

    /**
     * Find countries by continent and status
     */
    public List<Country> findByContinentIdAndStatus(Integer continentId, Integer status) {
        return countryRepository.findByContinentIdAndStatus(continentId, status);
    }

    /**
     * Find countries by name containing (case insensitive)
     */
    public List<Country> findByNameContainingIgnoreCase(String name) {
        return countryRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Check if country code exists
     */
    public boolean existsByCode(String code) {
        return countryRepository.existsByCode(code);
    }

    /**
     * Check if country name exists
     */
    public boolean existsByName(String name) {
        return countryRepository.existsByName(name);
    }

    /**
     * Find countries with pagination and search
     */
    public Page<Country> findCountriesWithFilters(String search, Integer continentId, Integer status, Pageable pageable) {
        return countryRepository.findCountriesWithFilters(search, continentId, status, pageable);
    }

    /**
     * Find countries with their regions
     */
    public Optional<Country> findWithRegionsById(Integer countryId) {
        return countryRepository.findWithRegionsById(countryId);
    }

    /**
     * Find all countries with pagination
     */
    public Page<Country> findAll(Pageable pageable) {
        return countryRepository.findAll(pageable);
    }

    /**
     * Count total countries
     */
    public long count() {
        return countryRepository.count();
    }

    /**
     * Check if country exists by ID
     */
    public boolean existsById(Integer id) {
        return countryRepository.existsById(id);
    }

    /**
     * Find active countries (status = 1)
     */
    public List<Country> findActiveCountries() {
        return countryRepository.findByStatus(1);
    }

    /**
     * Find countries by continent code
     */
    public List<Country> findByContinentCode(String continentCode) {
        // This would require a more complex query or separate continent lookup
        return countryRepository.findAll().stream()
            .filter(country -> country.getContinent() != null && 
                             continentCode.equals(country.getContinent().getCode()))
            .toList();
    }

    /**
     * Count countries by continent
     */
    public long countByContinentId(Integer continentId) {
        return countryRepository.findByContinentId(continentId).size();
    }

    /**
     * Count active countries by continent
     */
    public long countActiveByContinentId(Integer continentId) {
        return countryRepository.findByContinentIdAndStatus(continentId, 1).size();
    }

    /**
     * Find countries sorted by name
     */
    public List<Country> findAllOrderByName() {
        return countryRepository.findAll().stream()
            .sorted((c1, c2) -> c1.getName().compareToIgnoreCase(c2.getName()))
            .toList();
    }

    /**
     * Validate country data
     */
    public boolean isValidCountry(Country country) {
        if (country == null || country.getName() == null || country.getCode() == null) {
            return false;
        }
        return !country.getName().trim().isEmpty() && !country.getCode().trim().isEmpty();
    }

    /**
     * Check if country code is available for new country
     */
    public boolean isCodeAvailable(String code, Integer excludeId) {
        if (excludeId != null) {
            return countryRepository.findAll().stream()
                .filter(c -> !c.getId().equals(excludeId))
                .noneMatch(c -> code.equals(c.getCode()));
        }
        return !countryRepository.existsByCode(code);
    }

    /**
     * Check if country name is available for new country
     */
    public boolean isNameAvailable(String name, Integer excludeId) {
        if (excludeId != null) {
            return countryRepository.findAll().stream()
                .filter(c -> !c.getId().equals(excludeId))
                .noneMatch(c -> name.equalsIgnoreCase(c.getName()));
        }
        return !countryRepository.existsByName(name);
    }

    /**
     * Search countries by multiple criteria
     */
    public List<Country> searchCountries(String query) {
        if (query == null || query.trim().isEmpty()) {
            return countryRepository.findAll();
        }
        return countryRepository.findByNameContainingIgnoreCase(query.trim());
    }

    /**
     * Get country statistics
     */
    public CountryStats getCountryStatistics() {
        long totalCountries = countryRepository.count();
        long activeCountries = countryRepository.findByStatus(1).size();
        return new CountryStats(totalCountries, activeCountries);
    }

    /**
     * Inner class for country statistics
     */
    public static class CountryStats {
        private final long totalCountries;
        private final long activeCountries;

        public CountryStats(long totalCountries, long activeCountries) {
            this.totalCountries = totalCountries;
            this.activeCountries = activeCountries;
        }

        public long getTotalCountries() { return totalCountries; }
        public long getActiveCountries() { return activeCountries; }
        public long getInactiveCountries() { return totalCountries - activeCountries; }
    }
}
