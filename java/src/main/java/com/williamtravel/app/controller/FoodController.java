package com.williamtravel.app.controller;

import com.williamtravel.app.entity.Food;
import com.williamtravel.app.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Food operations
 */
@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    /**
     * Get all foods
     */
    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {
        List<Food> foods = foodService.findAll();
        return ResponseEntity.ok(foods);
    }

    /**
     * Get food by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Food> getFoodById(@PathVariable Integer id) {
        Optional<Food> food = foodService.findById(id);
        return food.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new food
     */
    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        Food savedFood = foodService.save(food);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFood);
    }

    /**
     * Update food
     */
    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Integer id, @RequestBody Food food) {
        if (!foodService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        food.setId(id);
        Food updatedFood = foodService.save(food);
        return ResponseEntity.ok(updatedFood);
    }

    /**
     * Delete food
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Integer id) {
        if (!foodService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        foodService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total foods
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countFoods() {
        long count = foodService.count();
        return ResponseEntity.ok(count);
    }

    // =========================
    // PAGINATION ENDPOINTS
    // =========================

    /**
     * Get all foods with pagination
     */
    @GetMapping("/page")
    public ResponseEntity<Page<Food>> getAllFoodsWithPagination(Pageable pageable) {
        Page<Food> foods = foodService.findAll(pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // BASIC FINDER ENDPOINTS
    // =========================

    /**
     * Get food by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<Food> getFoodByName(@PathVariable String name) {
        Optional<Food> food = foodService.findByName(name);
        return food.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get food by name code
     */
    @GetMapping("/name-code/{nameCode}")
    public ResponseEntity<Food> getFoodByNameCode(@PathVariable String nameCode) {
        Optional<Food> food = foodService.findByNameCode(nameCode);
        return food.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if food name exists
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> checkNameExists(@PathVariable String name) {
        boolean exists = foodService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Check if food name code exists
     */
    @GetMapping("/exists/name-code/{nameCode}")
    public ResponseEntity<Boolean> checkNameCodeExists(@PathVariable String nameCode) {
        boolean exists = foodService.existsByNameCode(nameCode);
        return ResponseEntity.ok(exists);
    }

    // =========================
    // STATUS-BASED ENDPOINTS
    // =========================

    /**
     * Get foods by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Food>> getFoodsByStatus(@PathVariable Boolean status) {
        List<Food> foods = foodService.findByStatus(status);
        return ResponseEntity.ok(foods);
    }

    /**
     * Get foods by status with pagination
     */
    @GetMapping("/status/{status}/page")
    public ResponseEntity<Page<Food>> getFoodsByStatusWithPagination(@PathVariable Boolean status, Pageable pageable) {
        Page<Food> foods = foodService.findByStatus(status, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // CATEGORY-BASED ENDPOINTS
    // =========================

    /**
     * Get foods by category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Food>> getFoodsByCategory(@PathVariable Integer categoryId) {
        List<Food> foods = foodService.findByCategoryId(categoryId);
        return ResponseEntity.ok(foods);
    }

    /**
     * Get foods by category and status with pagination
     */
    @GetMapping("/category/{categoryId}/status/{status}/page")
    public ResponseEntity<Page<Food>> getFoodsByCategoryAndStatusWithPagination(@PathVariable Integer categoryId, @PathVariable Boolean status, Pageable pageable) {
        Page<Food> foods = foodService.findByCategoryIdAndStatus(categoryId, status, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // COUNTRY-BASED ENDPOINTS
    // =========================

    /**
     * Get foods by country
     */
    @GetMapping("/country/{countryId}")
    public ResponseEntity<List<Food>> getFoodsByCountry(@PathVariable Integer countryId) {
        List<Food> foods = foodService.findByCountryId(countryId);
        return ResponseEntity.ok(foods);
    }

    /**
     * Get foods by country and status with pagination
     */
    @GetMapping("/country/{countryId}/status/{status}/page")
    public ResponseEntity<Page<Food>> getFoodsByCountryAndStatusWithPagination(@PathVariable Integer countryId, @PathVariable Boolean status, Pageable pageable) {
        Page<Food> foods = foodService.findByCountryIdAndStatus(countryId, status, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // REGION-BASED ENDPOINTS
    // =========================

    /**
     * Get foods by region
     */
    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<Food>> getFoodsByRegion(@PathVariable Integer regionId) {
        List<Food> foods = foodService.findByRegionId(regionId);
        return ResponseEntity.ok(foods);
    }

    /**
     * Get foods by region and status with pagination
     */
    @GetMapping("/region/{regionId}/status/{status}/page")
    public ResponseEntity<Page<Food>> getFoodsByRegionAndStatusWithPagination(@PathVariable Integer regionId, @PathVariable Boolean status, Pageable pageable) {
        Page<Food> foods = foodService.findByRegionIdAndStatus(regionId, status, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // PRICE RANGE ENDPOINTS
    // =========================

    /**
     * Get foods by price range
     */
    @GetMapping("/price-range")
    public ResponseEntity<List<Food>> getFoodsByPriceRange(@RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice) {
        List<Food> foods = foodService.findByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(foods);
    }

    /**
     * Get foods by price range with pagination
     */
    @GetMapping("/price-range/page")
    public ResponseEntity<Page<Food>> getFoodsByPriceRangeWithPagination(@RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice, Pageable pageable) {
        Page<Food> foods = foodService.findByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // SEARCH ENDPOINTS
    // =========================

    /**
     * Search foods by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoodsByKeyword(@RequestParam String keyword) {
        List<Food> foods = foodService.searchByKeyword(keyword);
        return ResponseEntity.ok(foods);
    }

    /**
     * Search foods by keyword with pagination
     */
    @GetMapping("/search/page")
    public ResponseEntity<Page<Food>> searchFoodsByKeywordWithPagination(@RequestParam String keyword, Pageable pageable) {
        Page<Food> foods = foodService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // POPULAR FOOD ENDPOINTS
    // =========================

    /**
     * Get popular foods
     */
    @GetMapping("/popular")
    public ResponseEntity<List<Food>> getPopularFoods(Pageable pageable) {
        List<Food> foods = foodService.findPopularFood(pageable);
        return ResponseEntity.ok(foods);
    }

    /**
     * Get popular foods by category
     */
    @GetMapping("/popular/category/{categoryId}")
    public ResponseEntity<List<Food>> getPopularFoodsByCategory(@PathVariable Integer categoryId, Pageable pageable) {
        List<Food> foods = foodService.findPopularFoodByCategory(categoryId, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // RECENT FOOD ENDPOINTS
    // =========================

    /**
     * Get recent foods
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Food>> getRecentFoods(Pageable pageable) {
        List<Food> foods = foodService.findRecentFood(pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // MEDIA ENDPOINTS
    // =========================

    /**
     * Get foods with media
     */
    @GetMapping("/with-media")
    public ResponseEntity<List<Food>> getFoodsWithMedia() {
        List<Food> foods = foodService.findFoodWithMedia();
        return ResponseEntity.ok(foods);
    }

    // =========================
    // STATISTICAL ENDPOINTS
    // =========================

    /**
     * Count active foods
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveFoods() {
        Long count = foodService.countActiveFood();
        return ResponseEntity.ok(count);
    }

    /**
     * Count active foods by category
     */
    @GetMapping("/count/active/category/{categoryId}")
    public ResponseEntity<Long> countActiveFoodsByCategory(@PathVariable Integer categoryId) {
        Long count = foodService.countActiveFoodByCategory(categoryId);
        return ResponseEntity.ok(count);
    }

    /**
     * Count active foods by country
     */
    @GetMapping("/count/active/country/{countryId}")
    public ResponseEntity<Long> countActiveFoodsByCountry(@PathVariable Integer countryId) {
        Long count = foodService.countActiveFoodByCountry(countryId);
        return ResponseEntity.ok(count);
    }

    // =========================
    // GEOGRAPHIC FILTER ENDPOINTS
    // =========================

    /**
     * Get foods by location filters
     */
    @GetMapping("/location-filters")
    public ResponseEntity<Page<Food>> getFoodsByLocationFilters(@RequestParam(required = false) Integer countryId, @RequestParam(required = false) Integer regionId, Pageable pageable) {
        Page<Food> foods = foodService.findByLocationFilters(countryId, regionId, pageable);
        return ResponseEntity.ok(foods);
    }

    // =========================
    // ADVANCED FILTER ENDPOINTS
    // =========================

    /**
     * Get foods with multiple filters
     */
    @GetMapping("/filtered")
    public ResponseEntity<Page<Food>> getFoodsWithFilters(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer countryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable) {
        Page<Food> foods = foodService.findWithFilters(keyword, categoryId, countryId, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(foods);
    }
}
