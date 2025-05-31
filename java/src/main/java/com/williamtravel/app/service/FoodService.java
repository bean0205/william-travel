package com.williamtravel.app.service;

import com.williamtravel.app.entity.Food;
import com.williamtravel.app.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service class for Food entity operations
 */
@Service
@Transactional
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    /**
     * Find all foods
     */
    public List<Food> findAll() {
        return foodRepository.findAll();
    }

    /**
     * Find food by ID
     */
    public Optional<Food> findById(Integer id) {
        return foodRepository.findById(id);
    }

    /**
     * Save food
     */
    public Food save(Food food) {
        return foodRepository.save(food);
    }

    /**
     * Delete food by ID
     */
    public void deleteById(Integer id) {
        foodRepository.deleteById(id);
    }

    /**
     * Find foods with pagination
     */
    public Page<Food> findAll(Pageable pageable) {
        return foodRepository.findAll(pageable);
    }

    /**
     * Check if food exists by ID
     */
    public boolean existsById(Integer id) {
        return foodRepository.existsById(id);
    }

    /**
     * Count all foods
     */
    public long count() {
        return foodRepository.count();
    }

    // Basic finder methods
    /**
     * Find food by name
     */
    public Optional<Food> findByName(String name) {
        return foodRepository.findByName(name);
    }

    /**
     * Find food by name code
     */
    public Optional<Food> findByNameCode(String nameCode) {
        return foodRepository.findByNameCode(nameCode);
    }

    /**
     * Check if food exists by name
     */
    public boolean existsByName(String name) {
        return foodRepository.existsByName(name);
    }

    /**
     * Check if food exists by name code
     */
    public boolean existsByNameCode(String nameCode) {
        return foodRepository.existsByNameCode(nameCode);
    }

    // Status-based queries
    /**
     * Find foods by status
     */
    public List<Food> findByStatus(Boolean status) {
        return foodRepository.findByStatus(status);
    }

    /**
     * Find foods by status with pagination
     */
    public Page<Food> findByStatus(Boolean status, Pageable pageable) {
        return foodRepository.findByStatus(status, pageable);
    }

    // Category-based queries
    /**
     * Find foods by category ID
     */
    public List<Food> findByCategoryId(Integer categoryId) {
        return foodRepository.findByCategoryId(categoryId);
    }

    /**
     * Find foods by category ID and status with pagination
     */
    public Page<Food> findByCategoryIdAndStatus(Integer categoryId, Boolean status, Pageable pageable) {
        return foodRepository.findByCategoryIdAndStatus(categoryId, status, pageable);
    }

    // Country-based queries
    /**
     * Find foods by country ID
     */
    public List<Food> findByCountryId(Integer countryId) {
        return foodRepository.findByCountryId(countryId);
    }

    /**
     * Find foods by country ID and status with pagination
     */
    public Page<Food> findByCountryIdAndStatus(Integer countryId, Boolean status, Pageable pageable) {
        return foodRepository.findByCountryIdAndStatus(countryId, status, pageable);
    }

    // Region-based queries
    /**
     * Find foods by region ID
     */
    public List<Food> findByRegionId(Integer regionId) {
        return foodRepository.findByRegionId(regionId);
    }

    /**
     * Find foods by region ID and status with pagination
     */
    public Page<Food> findByRegionIdAndStatus(Integer regionId, Boolean status, Pageable pageable) {
        return foodRepository.findByRegionIdAndStatus(regionId, status, pageable);
    }

    // Price range queries
    /**
     * Find foods by price range
     */
    public List<Food> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return foodRepository.findByPriceRange(minPrice, maxPrice);
    }

    /**
     * Find foods by price range with pagination
     */
    public Page<Food> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return foodRepository.findByPriceRange(minPrice, maxPrice, pageable);
    }

    // Search queries
    /**
     * Search foods by keyword
     */
    public List<Food> searchByKeyword(String keyword) {
        return foodRepository.searchByKeyword(keyword);
    }

    /**
     * Search foods by keyword with pagination
     */
    public Page<Food> searchByKeyword(String keyword, Pageable pageable) {
        return foodRepository.searchByKeyword(keyword, pageable);
    }

    // Popular food queries
    /**
     * Find popular foods
     */
    public List<Food> findPopularFood(Pageable pageable) {
        return foodRepository.findPopularFood(pageable);
    }

    /**
     * Find popular foods by category
     */
    public List<Food> findPopularFoodByCategory(Integer categoryId, Pageable pageable) {
        return foodRepository.findPopularFoodByCategory(categoryId, pageable);
    }

    // Recently added food
    /**
     * Find recent foods
     */
    public List<Food> findRecentFood(Pageable pageable) {
        return foodRepository.findRecentFood(pageable);
    }

    // Food with media
    /**
     * Find foods with media
     */
    public List<Food> findFoodWithMedia() {
        return foodRepository.findFoodWithMedia();
    }

    // Statistical queries
    /**
     * Count active foods
     */
    public Long countActiveFood() {
        return foodRepository.countActiveFood();
    }

    /**
     * Count active foods by category
     */
    public Long countActiveFoodByCategory(Integer categoryId) {
        return foodRepository.countActiveFoodByCategory(categoryId);
    }

    /**
     * Count active foods by country
     */
    public Long countActiveFoodByCountry(Integer countryId) {
        return foodRepository.countActiveFoodByCountry(countryId);
    }

    // Advanced geographic queries
    /**
     * Find foods by location filters
     */
    public Page<Food> findByLocationFilters(Integer countryId, Integer regionId, Pageable pageable) {
        return foodRepository.findByLocationFilters(countryId, regionId, pageable);
    }

    // Complex search with multiple filters
    /**
     * Find foods with multiple filters
     */
    public Page<Food> findWithFilters(String keyword, Integer categoryId, Integer countryId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return foodRepository.findWithFilters(keyword, categoryId, countryId, minPrice, maxPrice, pageable);
    }
}
