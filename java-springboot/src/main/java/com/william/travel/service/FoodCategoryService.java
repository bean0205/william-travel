package com.william.travel.service;

import com.william.travel.entity.FoodCategory;
import com.william.travel.entity.Food;
import com.william.travel.repository.FoodCategoryRepository;
import com.william.travel.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class FoodCategoryService {

    private final FoodCategoryRepository categoryRepository;
    private final FoodRepository foodRepository;

    /**
     * Create a new food category
     */
    public FoodCategory createCategory(FoodCategory category) {
        log.info("Creating new food category: {}", category.getName());
        
        // Validate unique constraints
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Food category with name '" + category.getName() + "' already exists");
        }
        
        category.setStatus(true); // Active
        
        return categoryRepository.save(category);
    }

    /**
     * Get category by ID
     */
    @Transactional(readOnly = true)
    public Optional<FoodCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    /**
     * Get category by name
     */
    @Transactional(readOnly = true)
    public Optional<FoodCategory> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    /**
     * Get all active categories
     */
    @Transactional(readOnly = true)
    public List<FoodCategory> getAllActiveCategories() {
        return categoryRepository.findActiveCategories();
    }

    /**
     * Get all categories
     */
    @Transactional(readOnly = true)
    public List<FoodCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Update category
     */
    public FoodCategory updateCategory(Long id, FoodCategory categoryDetails) {
        log.info("Updating food category with ID: {}", id);
        
        FoodCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food category not found with ID: " + id));

        // Check for unique constraints if name is being changed
        if (!category.getName().equals(categoryDetails.getName()) &&
            categoryRepository.existsByName(categoryDetails.getName())) {
            throw new IllegalArgumentException("Food category with name '" + categoryDetails.getName() + "' already exists");
        }

        // Update fields
        category.setName(categoryDetails.getName());

        return categoryRepository.save(category);
    }

    /**
     * Activate category
     */
    public FoodCategory activateCategory(Long id) {
        log.info("Activating food category with ID: {}", id);
        
        FoodCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food category not found with ID: " + id));
        
        category.setStatus(true);
        
        return categoryRepository.save(category);
    }

    /**
     * Deactivate category
     */
    public FoodCategory deactivateCategory(Long id) {
        log.info("Deactivating food category with ID: {}", id);
        
        FoodCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food category not found with ID: " + id));
        
        category.setStatus(false);
        
        return categoryRepository.save(category);
    }

    /**
     * Delete category (soft delete)
     */
    public void deleteCategory(Long id) {
        log.info("Deleting food category with ID: {}", id);
        
        FoodCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food category not found with ID: " + id));
        
        // Check if category has foods
        List<Food> foods = foodRepository.findByCategoryId(id);
        if (!foods.isEmpty()) {
            throw new IllegalStateException("Cannot delete category with associated foods. " +
                    "Please reassign or delete foods first.");
        }
        
        category.setStatus(false); // Deactivated (soft delete)
        categoryRepository.save(category);
    }

    /**
     * Get foods in category
     */
    @Transactional(readOnly = true)
    public List<Food> getFoodsInCategory(Long categoryId) {
        FoodCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Food category not found with ID: " + categoryId));
        
        return foodRepository.findByCategoryId(categoryId);
    }

    /**
     * Count foods in category
     */
    @Transactional(readOnly = true)
    public long countFoodsInCategory(Long categoryId) {
        return foodRepository.countByCategoryId(categoryId);
    }

    /**
     * Check if category exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}
