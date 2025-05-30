package com.william.travel.repository;

import com.william.travel.entity.MediaCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface MediaCategoryRepository extends JpaRepository<MediaCategory, Long> {
    
    Optional<MediaCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT mc FROM MediaCategory mc WHERE mc.isActive = true ORDER BY mc.name")
    List<MediaCategory> findActiveCategories();
}
