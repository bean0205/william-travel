package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Country;
import com.williamtravel.app.service.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Country operations
 */
@RestController
@RequestMapping("/api/public/countries")
@CrossOrigin(origins = "*")
public class CountryController {

    @Autowired
    private CountryService countryService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all countries
     */
    @GetMapping
    public ResponseEntity<List<Country>> getAllCountries() {
        List<Country> countries = countryService.findAll();
        return ResponseEntity.ok(countries);
    }

    /**
     * Get country by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Country> getCountryById(@PathVariable Integer id) {
        Optional<Country> country = countryService.findById(id);
        return country.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new country
     */
    @PostMapping
    public ResponseEntity<Country> createCountry(@RequestBody Country country) {
        Country savedCountry = countryService.save(country);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCountry);
    }

    /**
     * Update country
     */
    @PutMapping("/{id}")
    public ResponseEntity<Country> updateCountry(@PathVariable Integer id, @RequestBody Country country) {
        if (!countryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        country.setId(id);
        Country updatedCountry = countryService.save(country);
        return ResponseEntity.ok(updatedCountry);
    }

    /**
     * Delete country
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCountry(@PathVariable Integer id) {
        if (!countryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        countryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total countries
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countCountries() {
        long count = countryService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    /**
     * Get all countries with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Country>> getCountriesPage(Pageable pageable) {
        Page<Country> countries = countryService.findAll(pageable);
        return ResponseEntity.ok(countries);
    }

    /**
     * Get country by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Country> getCountryByCode(@PathVariable String code) {
        Optional<Country> country = countryService.findByCode(code);
        return country.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get country by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Country> getCountryByName(@PathVariable String name) {
        Optional<Country> country = countryService.findByName(name);
        return country.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get countries by continent
     */
    @GetMapping("/continent/{continentId}")
    public ResponseEntity<List<Country>> getCountriesByContinent(@PathVariable Integer continentId) throws InterruptedException {
        Thread.sleep(5000);
        List<Country> countries = countryService.findByContinentId(continentId);
        return ResponseEntity.ok(countries);
    }

    /**
     * Get countries by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Country>> getCountriesByStatus(@PathVariable Integer status) {
        List<Country> countries = countryService.findByStatus(status);
        return ResponseEntity.ok(countries);
    }

    /**
     * Get countries by continent and status
     */
    @GetMapping("/continent/{continentId}/status/{status}")
    public ResponseEntity<List<Country>> getCountriesByContinentAndStatus(
            @PathVariable Integer continentId, @PathVariable Integer status) {
        List<Country> countries = countryService.findByContinentIdAndStatus(continentId, status);
        return ResponseEntity.ok(countries);
    }

    /**
     * Search countries by name (case insensitive)
     */
    @GetMapping("/search/name/{name}")
    public ResponseEntity<List<Country>> searchCountriesByName(@PathVariable String name) {
        List<Country> countries = countryService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(countries);
    }

    /**
     * Check if country code exists
     */
    @GetMapping("/exists/code/{code}")
    public ResponseEntity<Boolean> checkCodeExists(@PathVariable String code) {
        boolean exists = countryService.existsByCode(code);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if country name exists
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> checkNameExists(@PathVariable String name) {
        boolean exists = countryService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Search countries with filters and pagination
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Country>> searchCountries(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer continentId,
            @RequestParam(required = false) Integer status,
            Pageable pageable) {
        Page<Country> countries = countryService.findCountriesWithFilters(search, continentId, status, pageable);
        return ResponseEntity.ok(countries);
    }

    /**
     * Get country with regions
     */
    @GetMapping("/{id}/with-regions")
    public ResponseEntity<Country> getCountryWithRegions(@PathVariable Integer id) {
        Optional<Country> country = countryService.findWithRegionsById(id);
        return country.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get active countries
     */
    @GetMapping("/active")
    public ResponseEntity<List<Country>> getActiveCountries() {
        List<Country> countries = countryService.findActiveCountries();
        return ResponseEntity.ok(countries);
    }

    /**
     * Get countries by continent code
     */
    @GetMapping("/continent-code/{continentCode}")
    public ResponseEntity<List<Country>> getCountriesByContinentCode(@PathVariable String continentCode) {
        List<Country> countries = countryService.findByContinentCode(continentCode);
        return ResponseEntity.ok(countries);
    }

    /**
     * Count countries by continent
     */
    @GetMapping("/count/continent/{continentId}")
    public ResponseEntity<Long> countCountriesByContinent(@PathVariable Integer continentId) {
        long count = countryService.countByContinentId(continentId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count active countries by continent
     */
    @GetMapping("/count/continent/{continentId}/active")
    public ResponseEntity<Long> countActiveCountriesByContinent(@PathVariable Integer continentId) {
        long count = countryService.countActiveByContinentId(continentId);
        return ResponseEntity.ok(count);
    }

    /**
     * Get countries ordered by name
     */
    @GetMapping("/ordered-by-name")
    public ResponseEntity<List<Country>> getCountriesOrderedByName() {
        List<Country> countries = countryService.findAllOrderByName();
        return ResponseEntity.ok(countries);
    }

    /**
     * Validate country data
     */
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateCountry(@RequestBody Country country) {
        boolean isValid = countryService.isValidCountry(country);
        return ResponseEntity.ok(isValid);
    }

    /**
     * Check if code is available (for create/update)
     */
    @GetMapping("/available/code/{code}")
    public ResponseEntity<Boolean> isCodeAvailable(@PathVariable String code, 
                                                  @RequestParam(required = false) Integer excludeId) {
        boolean available = countryService.isCodeAvailable(code, excludeId);
        return ResponseEntity.ok(available);
    }

    /**
     * Check if name is available (for create/update)
     */
    @GetMapping("/available/name/{name}")
    public ResponseEntity<Boolean> isNameAvailable(@PathVariable String name, 
                                                  @RequestParam(required = false) Integer excludeId) {
        boolean available = countryService.isNameAvailable(name, excludeId);
        return ResponseEntity.ok(available);
    }

    /**
     * Search countries by query
     */
    @GetMapping("/search/{query}")
    public ResponseEntity<List<Country>> searchCountries(@PathVariable String query) {
        List<Country> countries = countryService.searchCountries(query);
        return ResponseEntity.ok(countries);
    }

    /**
     * Get country statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<CountryService.CountryStats> getCountryStatistics() {
        CountryService.CountryStats stats = countryService.getCountryStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get total countries (alias for getTotalCountries)
     */
    @GetMapping("/total")
    public ResponseEntity<Long> getTotalCountries() {
        long total = countryService.count();
        return ResponseEntity.ok(total);
    }

    /**
     * Get active countries count
     */
    @GetMapping("/count/active") 
    public ResponseEntity<Long> getActiveCountriesCount() {
        List<Country> activeCountries = countryService.findActiveCountries();
        return ResponseEntity.ok((long) activeCountries.size());
    }

    /**
     * Get inactive countries count
     */
    @GetMapping("/count/inactive")
    public ResponseEntity<Long> getInactiveCountriesCount() {
        CountryService.CountryStats stats = countryService.getCountryStatistics();
        return ResponseEntity.ok(stats.getInactiveCountries());
    }
}
