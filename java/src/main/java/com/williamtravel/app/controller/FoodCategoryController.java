package com.williamtravel.app.controller;

import com.williamtravel.app.entity.FoodCategory;
import com.williamtravel.app.service.FoodCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for FoodCategory operations
 */
@RestController
@RequestMapping("/api/food-categories")
@CrossOrigin(origins = "*")
public class FoodCategoryController {

    @Autowired
    private FoodCategoryService foodCategoryService;

    /**
     * Get all food categories
     */
    @GetMapping
    public ResponseEntity<List<FoodCategory>> getAllFoodCategories() {
        List<FoodCategory> categories = foodCategoryService.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get food category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FoodCategory> getFoodCategoryById(@PathVariable Integer id) {
        Optional<FoodCategory> category = foodCategoryService.findById(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new food category
     */
    @PostMapping
    public ResponseEntity<FoodCategory> createFoodCategory(@RequestBody FoodCategory category) {
        FoodCategory savedCategory = foodCategoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    /**
     * Update food category
     */
    @PutMapping("/{id}")
    public ResponseEntity<FoodCategory> updateFoodCategory(@PathVariable Integer id, @RequestBody FoodCategory category) {
        if (!foodCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        category.setId(id);
        FoodCategory updatedCategory = foodCategoryService.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Delete food category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodCategory(@PathVariable Integer id) {
        if (!foodCategoryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        foodCategoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Count total food categories
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countFoodCategories() {
        long count = foodCategoryService.count();
        return ResponseEntity.ok(count);
    }

    /**
     * Check if food category exists by ID
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Integer id) {
        boolean exists = foodCategoryService.existsById(id);
        return ResponseEntity.ok(exists);
    }

    /**
     * Find food category by name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<FoodCategory> findByName(@PathVariable String name) {
        Optional<FoodCategory> category = foodCategoryService.findByName(name);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Check if food category exists by name
     */
    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = foodCategoryService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    /**
     * Find food categories by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FoodCategory>> findByStatus(@PathVariable Boolean status) {
        List<FoodCategory> categories = foodCategoryService.findByStatus(status);
        return ResponseEntity.ok(categories);
    }

    /**
     * Find food categories by status with pagination
     */
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<Page<FoodCategory>> findByStatusPaginated(@PathVariable Boolean status, Pageable pageable) {
        Page<FoodCategory> categories = foodCategoryService.findByStatus(status, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Find all active food categories ordered by name
     */
    @GetMapping("/active/ordered-by-name")
    public ResponseEntity<List<FoodCategory>> findAllActiveOrderByName() {
        List<FoodCategory> categories = foodCategoryService.findAllActiveOrderByName();
        return ResponseEntity.ok(categories);
    }

    /**
     * Search food categories by name keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<FoodCategory>> searchByName(@RequestParam String keyword) {
        List<FoodCategory> categories = foodCategoryService.searchByName(keyword);
        return ResponseEntity.ok(categories);
    }

    /**
     * Search food categories by name keyword with pagination
     */
    @GetMapping("/search/paginated")
    public ResponseEntity<Page<FoodCategory>> searchByNamePaginated(@RequestParam String keyword, Pageable pageable) {
        Page<FoodCategory> categories = foodCategoryService.searchByName(keyword, pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Find food categories with food count
     */
    @GetMapping("/with-food-count")
    public ResponseEntity<List<Object[]>> findCategoriesWithFoodCount() {
        List<Object[]> categories = foodCategoryService.findCategoriesWithFoodCount();
        return ResponseEntity.ok(categories);
    }

    /**
     * Find food categories ordered by food count
     */
    @GetMapping("/ordered-by-food-count")
    public ResponseEntity<List<FoodCategory>> findCategoriesOrderByFoodCount() {
        List<FoodCategory> categories = foodCategoryService.findCategoriesOrderByFoodCount();
        return ResponseEntity.ok(categories);
    }

    /**
     * Find food categories ordered by food count with pagination
     */
    @GetMapping("/ordered-by-food-count/paginated")
    public ResponseEntity<Page<FoodCategory>> findCategoriesOrderByFoodCountPaginated(Pageable pageable) {
        Page<FoodCategory> categories = foodCategoryService.findCategoriesOrderByFoodCount(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Find food categories with active food
     */
    @GetMapping("/with-active-food")
    public ResponseEntity<List<FoodCategory>> findCategoriesWithActiveFood() {
        List<FoodCategory> categories = foodCategoryService.findCategoriesWithActiveFood();
        return ResponseEntity.ok(categories);
    }

    /**
     * Count active food categories
     */
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveCategories() {
        Long count = foodCategoryService.countActiveCategories();
        return ResponseEntity.ok(count);
    }

    /**
     * Count active food in specific category
     */
    @GetMapping("/{categoryId}/count-active-food")
    public ResponseEntity<Long> countActiveFoodInCategory(@PathVariable Integer categoryId) {
        Long count = foodCategoryService.countActiveFoodInCategory(categoryId);
        return ResponseEntity.ok(count);
    }

    /**
     * Find recent food categories
     */
    @GetMapping("/recent")
    public ResponseEntity<List<FoodCategory>> findRecentCategories(Pageable pageable) {
        List<FoodCategory> categories = foodCategoryService.findRecentCategories(pageable);
        return ResponseEntity.ok(categories);
    }

    /**
     * Find food categories by date range
     */
    @GetMapping("/by-date-range")
    public ResponseEntity<List<FoodCategory>> findCategoriesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<FoodCategory> categories = foodCategoryService.findCategoriesByDateRange(startDate, endDate);
        return ResponseEntity.ok(categories);
    }

    /**
     * Find popular food categories
     */
    @GetMapping("/popular")
    public ResponseEntity<List<FoodCategory>> findPopularCategories(Pageable pageable) {
        List<FoodCategory> categories = foodCategoryService.findPopularCategories(pageable);
        return ResponseEntity.ok(categories);
    }
}
