package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Continent;
import com.williamtravel.app.service.ContinentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Continent operations
 */
@RestController
@RequestMapping("/api/public/continents")
@CrossOrigin(origins = "*")
public class ContinentController {

    @Autowired
    private ContinentService continentService;

    // ==================== EXISTING ENDPOINTS ====================

    /**
     * Get all continents
     */
    @GetMapping
    public ResponseEntity<List<Continent>> getAllContinents() {
        List<Continent> continents = continentService.findAll();
        return ResponseEntity.ok(continents);
    }

    /**
     * Get continent by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Continent> getContinentById(@PathVariable Integer id) {
        Optional<Continent> continent = continentService.findById(id);
        return continent.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new continent
     */
    @PostMapping
    public ResponseEntity<Continent> createContinent(@RequestBody Continent continent) {
        Continent savedContinent = continentService.save(continent);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedContinent);
    }

    /**
     * Update continent
     */
    @PutMapping("/{id}")
    public ResponseEntity<Continent> updateContinent(@PathVariable Integer id, @RequestBody Continent continent) {
        if (!continentService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        continent.setId(id);
        Continent updatedContinent = continentService.save(continent);
        return ResponseEntity.ok(updatedContinent);
    }

    /**
     * Delete continent
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContinent(@PathVariable Integer id) {
        if (!continentService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        continentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total continents
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countContinents() {
        long count = continentService.count();
        return ResponseEntity.ok(count);
    }

    // ==================== NEW ENDPOINTS ====================

    /**
     * Get all continents with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Continent>> getContinentsPage(Pageable pageable) {
        Page<Continent> continents = continentService.findAll(pageable);
        return ResponseEntity.ok(continents);
    }

    /**
     * Get continent by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<Continent> getContinentByCode(@PathVariable String code) {
        Optional<Continent> continent = continentService.findByCode(code);
        return continent.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get continent by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Continent> getContinentByName(@PathVariable String name) {
        Optional<Continent> continent = continentService.findByName(name);
        return continent.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get continents by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Continent>> getContinentsByStatus(@PathVariable Integer status) {
        List<Continent> continents = continentService.findByStatus(status);
        return ResponseEntity.ok(continents);
    }

    /**
     * Search continents by name (case insensitive)
     */
    @GetMapping("/search/name/{name}")
    public ResponseEntity<List<Continent>> searchContinentsByName(@PathVariable String name) {
        List<Continent> continents = continentService.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(continents);
    }

    /**
     * Check if continent code exists
     */
    @GetMapping("/exists/code/{code}")
    public ResponseEntity<Boolean> checkCodeExists(@PathVariable String code) {
        boolean exists = continentService.existsByCode(code);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if continent name exists
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> checkNameExists(@PathVariable String name) {
        boolean exists = continentService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Search continents with filters and pagination
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Continent>> searchContinents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer status,
            Pageable pageable) {
        Page<Continent> continents = continentService.findContinentsWithFilters(search, status, pageable);
        return ResponseEntity.ok(continents);
    }

    /**
     * Get all continents with their countries
     */
    @GetMapping("/with-countries")
    public ResponseEntity<List<Continent>> getContinentsWithCountries() {
        List<Continent> continents = continentService.findAllWithCountries();
        return ResponseEntity.ok(continents);
    }
}
