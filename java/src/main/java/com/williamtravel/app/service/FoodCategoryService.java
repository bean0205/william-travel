package com.williamtravel.app.service;

import com.williamtravel.app.entity.FoodCategory;
import com.williamtravel.app.repository.FoodCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for FoodCategory entity operations
 */
@Service
@Transactional
public class FoodCategoryService {

    @Autowired
    private FoodCategoryRepository foodCategoryRepository;

    /**
     * Find all food categories
     */
    public List<FoodCategory> findAll() {
        return foodCategoryRepository.findAll();
    }

    /**
     * Find food category by ID
     */
    public Optional<FoodCategory> findById(Integer id) {
        return foodCategoryRepository.findById(id);
    }

    /**
     * Save food category
     */
    public FoodCategory save(FoodCategory foodCategory) {
        return foodCategoryRepository.save(foodCategory);
    }

    /**
     * Delete food category by ID
     */
    public void deleteById(Integer id) {
        foodCategoryRepository.deleteById(id);
    }

    /**
     * Find food category by name
     */
    public Optional<FoodCategory> findByName(String name) {
        return foodCategoryRepository.findByName(name);
    }

    /**
     * Check if food category exists by name
     */
    public boolean existsByName(String name) {
        return foodCategoryRepository.existsByName(name);
    }

    /**
     * Find food categories by status
     */
    public List<FoodCategory> findByStatus(Boolean status) {
        return foodCategoryRepository.findByStatus(status);
    }

    /**
     * Find food categories by status with pagination
     */
    public Page<FoodCategory> findByStatus(Boolean status, Pageable pageable) {
        return foodCategoryRepository.findByStatus(status, pageable);
    }

    /**
     * Find all active food categories ordered by name
     */
    public List<FoodCategory> findAllActiveOrderByName() {
        return foodCategoryRepository.findAllActiveOrderByName();
    }

    /**
     * Search food categories by name keyword
     */
    public List<FoodCategory> searchByName(String keyword) {
        return foodCategoryRepository.searchByName(keyword);
    }

    /**
     * Search food categories by name keyword with pagination
     */
    public Page<FoodCategory> searchByName(String keyword, Pageable pageable) {
        return foodCategoryRepository.searchByName(keyword, pageable);
    }

    /**
     * Find food categories with food count
     */
    public List<Object[]> findCategoriesWithFoodCount() {
        return foodCategoryRepository.findCategoriesWithFoodCount();
    }

    /**
     * Find food categories ordered by food count
     */
    public List<FoodCategory> findCategoriesOrderByFoodCount() {
        return foodCategoryRepository.findCategoriesOrderByFoodCount();
    }

    /**
     * Find food categories ordered by food count with pagination
     */
    public Page<FoodCategory> findCategoriesOrderByFoodCount(Pageable pageable) {
        return foodCategoryRepository.findCategoriesOrderByFoodCount(pageable);
    }

    /**
     * Find food categories with active food
     */
    public List<FoodCategory> findCategoriesWithActiveFood() {
        return foodCategoryRepository.findCategoriesWithActiveFood();
    }

    /**
     * Count active food categories
     */
    public Long countActiveCategories() {
        return foodCategoryRepository.countActiveCategories();
    }

    /**
     * Count active food in specific category
     */
    public Long countActiveFoodInCategory(Integer categoryId) {
        return foodCategoryRepository.countActiveFoodInCategory(categoryId);
    }

    /**
     * Find recent food categories
     */
    public List<FoodCategory> findRecentCategories(Pageable pageable) {
        return foodCategoryRepository.findRecentCategories(pageable);
    }

    /**
     * Find food categories by date range
     */
    public List<FoodCategory> findCategoriesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return foodCategoryRepository.findCategoriesByDateRange(startDate, endDate);
    }

    /**
     * Find popular food categories
     */
    public List<FoodCategory> findPopularCategories(Pageable pageable) {
        return foodCategoryRepository.findPopularCategories(pageable);
    }

    /**
     * Count total food categories
     */
    public long count() {
        return foodCategoryRepository.count();
    }

    /**
     * Check if food category exists by ID
     */
    public boolean existsById(Integer id) {
        return foodCategoryRepository.existsById(id);
    }
}
