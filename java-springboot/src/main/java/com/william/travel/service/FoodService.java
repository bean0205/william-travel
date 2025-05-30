package com.william.travel.service;

import com.william.travel.entity.Food;
import com.william.travel.entity.FoodCategory;
import com.william.travel.repository.FoodRepository;
import com.william.travel.repository.FoodCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FoodService {

    private final FoodRepository foodRepository;
    private final FoodCategoryRepository foodCategoryRepository;

    // CRUD Operations
    
    @Transactional
    public Food createFood(Food food) {
        log.debug("Creating food: {}", food.getName());
        
        food.setStatus(true);
        return foodRepository.save(food);
    }

    @Transactional
    public Food updateFood(Long id, Food updatedFood) {
        log.debug("Updating food with id: {}", id);
        
        Food existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));

        // Update fields
        existingFood.setName(updatedFood.getName());
        existingFood.setNameCode(updatedFood.getNameCode());
        existingFood.setDescription(updatedFood.getDescription());
        existingFood.setDescriptionCode(updatedFood.getDescriptionCode());
        existingFood.setThumbnailUrl(updatedFood.getThumbnailUrl());
        existingFood.setPriceMin(updatedFood.getPriceMin());
        existingFood.setPriceMax(updatedFood.getPriceMax());
        
        if (updatedFood.getCountry() != null) {
            existingFood.setCountry(updatedFood.getCountry());
        }
        if (updatedFood.getRegion() != null) {
            existingFood.setRegion(updatedFood.getRegion());
        }
        if (updatedFood.getDistrict() != null) {
            existingFood.setDistrict(updatedFood.getDistrict());
        }
        if (updatedFood.getWard() != null) {
            existingFood.setWard(updatedFood.getWard());
        }
        if (updatedFood.getCategory() != null) {
            existingFood.setCategory(updatedFood.getCategory());
        }

        return foodRepository.save(existingFood);
    }

    @Transactional
    public void deleteFood(Long id) {
        log.debug("Soft deleting food with id: {}", id);
        
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));
        
        food.setStatus(false);
        foodRepository.save(food);
    }

    @Transactional
    public void hardDeleteFood(Long id) {
        log.debug("Hard deleting food with id: {}", id);
        foodRepository.deleteById(id);
    }

    // Read Operations

    public Optional<Food> getFoodById(Long id) {
        log.debug("Finding food by id: {}", id);
        return foodRepository.findById(id);
    }

    public Page<Food> getAllActiveFoods(Pageable pageable) {
        log.debug("Finding all active foods with pagination");
        return foodRepository.findActiveFoods(pageable);
    }

    public Page<Food> searchFoodsByName(String name, Pageable pageable) {
        log.debug("Searching foods by name: {}", name);
        return foodRepository.findActiveByNameContaining(name, pageable);
    }

    // Category-based searches

    public Page<Food> getFoodsByCategory(Long categoryId, Pageable pageable) {
        log.debug("Finding foods by category id: {}", categoryId);
        return foodRepository.findActiveByCategoryId(categoryId, pageable);
    }

    // Geographic searches

    public Page<Food> getFoodsByCountry(Long countryId, Pageable pageable) {
        log.debug("Finding foods by country id: {}", countryId);
        return foodRepository.findActiveByCountryId(countryId, pageable);
    }

    public List<Food> getFoodsByRegion(Long regionId) {
        log.debug("Finding foods by region id: {}", regionId);
        return foodRepository.findActiveByRegionId(regionId);
    }

    public List<Food> getFoodsByDistrict(Long districtId) {
        log.debug("Finding foods by district id: {}", districtId);
        return foodRepository.findActiveByDistrictId(districtId);
    }

    public List<Food> getFoodsByWard(Long wardId) {
        log.debug("Finding foods by ward id: {}", wardId);
        return foodRepository.findActiveByWardId(wardId);
    }

    // Price-based search

    public Page<Food> getFoodsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        log.debug("Finding foods with price range: {} - {}", minPrice, maxPrice);
        return foodRepository.findActiveByPriceRange(minPrice, maxPrice, pageable);
    }

    // Popularity-based search

    public Page<Food> getFoodsByMinPopularity(Double minScore, Pageable pageable) {
        log.debug("Finding foods with minimum popularity score: {}", minScore);
        return foodRepository.findActiveByMinPopularityScore(minScore, pageable);
    }

    // Utility Methods

    @Transactional
    public Food updatePopularityScore(Long foodId, Double score) {
        log.debug("Updating popularity score for food {}: {}", foodId, score);
        
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + foodId));
        
        food.setPopularityScore(score);
        return foodRepository.save(food);
    }

    @Transactional
    public Food assignCategory(Long foodId, Long categoryId) {
        log.debug("Assigning category {} to food {}", categoryId, foodId);
        
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + foodId));
        
        FoodCategory category = foodCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Food category not found with id: " + categoryId));
        
        food.setCategory(category);
        return foodRepository.save(food);
    }

    @Transactional
    public Food activateFood(Long id) {
        log.debug("Activating food with id: {}", id);
        
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));
        
        food.setStatus(true);
        return foodRepository.save(food);
    }

    @Transactional
    public Food deactivateFood(Long id) {
        log.debug("Deactivating food with id: {}", id);
        
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));
        
        food.setStatus(false);
        return foodRepository.save(food);
    }

    // Statistics

    public long getActiveFoodCount() {
        log.debug("Getting count of active foods");
        return foodRepository.findActiveFoods(Pageable.unpaged()).getTotalElements();
    }

    public long getFoodCountByCategory(Long categoryId) {
        log.debug("Getting count of foods in category: {}", categoryId);
        return foodRepository.findActiveByCategoryId(categoryId, Pageable.unpaged()).getTotalElements();
    }

    public long getFoodCountByCountry(Long countryId) {
        log.debug("Getting count of foods in country: {}", countryId);
        return foodRepository.findActiveByCountryId(countryId, Pageable.unpaged()).getTotalElements();
    }
}
