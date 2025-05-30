package com.william.travel.service;

import com.william.travel.entity.AccommodationCategory;
import com.william.travel.entity.Accommodation;
import com.william.travel.repository.AccommodationCategoryRepository;
import com.william.travel.repository.AccommodationRepository;
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
public class AccommodationCategoryService {

    private final AccommodationCategoryRepository categoryRepository;
    private final AccommodationRepository accommodationRepository;

    /**
     * Create a new accommodation category
     */
    public AccommodationCategory createCategory(AccommodationCategory category) {
        log.info("Creating new accommodation category: {}", category.getName());
        
        // Validate unique constraints
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Accommodation category with name '" + category.getName() + "' already exists");
        }
        
        category.setStatus(true); // Active
        
        return categoryRepository.save(category);
    }

    /**
     * Get category by ID
     */
    @Transactional(readOnly = true)
    public Optional<AccommodationCategory> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    /**
     * Get category by name
     */
    @Transactional(readOnly = true)
    public Optional<AccommodationCategory> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    /**
     * Get all active categories
     */
    @Transactional(readOnly = true)
    public List<AccommodationCategory> getAllActiveCategories() {
        return categoryRepository.findActiveCategories();
    }

    /**
     * Get all categories
     */
    @Transactional(readOnly = true)
    public List<AccommodationCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Update category
     */
    public AccommodationCategory updateCategory(Long id, AccommodationCategory categoryDetails) {
        log.info("Updating accommodation category with ID: {}", id);
        
        AccommodationCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Accommodation category not found with ID: " + id));

        // Check for unique constraints if name is being changed
        if (!category.getName().equals(categoryDetails.getName()) &&
            categoryRepository.existsByName(categoryDetails.getName())) {
            throw new IllegalArgumentException("Accommodation category with name '" + categoryDetails.getName() + "' already exists");
        }

        // Update fields
        category.setName(categoryDetails.getName());

        return categoryRepository.save(category);
    }

    /**
     * Activate category
     */
    public AccommodationCategory activateCategory(Long id) {
        log.info("Activating accommodation category with ID: {}", id);
        
        AccommodationCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Accommodation category not found with ID: " + id));
        
        category.setStatus(true);
        
        return categoryRepository.save(category);
    }

    /**
     * Deactivate category
     */
    public AccommodationCategory deactivateCategory(Long id) {
        log.info("Deactivating accommodation category with ID: {}", id);
        
        AccommodationCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Accommodation category not found with ID: " + id));
        
        category.setStatus(false);
        
        return categoryRepository.save(category);
    }

    /**
     * Delete category (soft delete)
     */
    public void deleteCategory(Long id) {
        log.info("Deleting accommodation category with ID: {}", id);
        
        AccommodationCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Accommodation category not found with ID: " + id));
        
        // Check if category has accommodations
        List<Accommodation> accommodations = accommodationRepository.findByCategoryId(id);
        if (!accommodations.isEmpty()) {
            throw new IllegalStateException("Cannot delete category with associated accommodations. " +
                    "Please reassign or delete accommodations first.");
        }
        
        category.setStatus(false); // Deactivated (soft delete)
        categoryRepository.save(category);
    }

    /**
     * Get accommodations in category
     */
    @Transactional(readOnly = true)
    public List<Accommodation> getAccommodationsInCategory(Long categoryId) {
        AccommodationCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Accommodation category not found with ID: " + categoryId));
        
        return accommodationRepository.findByCategoryId(categoryId);
    }

    /**
     * Count accommodations in category
     */
    @Transactional(readOnly = true)
    public long countAccommodationsInCategory(Long categoryId) {
        return accommodationRepository.countByCategoryId(categoryId);
    }

    /**
     * Check if category exists by name
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}
