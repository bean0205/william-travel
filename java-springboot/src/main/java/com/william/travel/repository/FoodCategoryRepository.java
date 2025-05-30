package com.william.travel.repository;

import com.william.travel.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Long> {
    
    Optional<FoodCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT fc FROM FoodCategory fc WHERE fc.status = true ORDER BY fc.name")
    List<FoodCategory> findActiveCategories();
}
