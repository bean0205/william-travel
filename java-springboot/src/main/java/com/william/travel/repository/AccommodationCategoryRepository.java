package com.william.travel.repository;

import com.william.travel.entity.AccommodationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AccommodationCategoryRepository extends JpaRepository<AccommodationCategory, Long> {
    
    Optional<AccommodationCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT ac FROM AccommodationCategory ac WHERE ac.status = true ORDER BY ac.name")
    List<AccommodationCategory> findActiveCategories();
}
