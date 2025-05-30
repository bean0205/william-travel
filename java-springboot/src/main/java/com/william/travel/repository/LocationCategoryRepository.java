package com.william.travel.repository;

import com.william.travel.entity.LocationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface LocationCategoryRepository extends JpaRepository<LocationCategory, Long> {
    
    Optional<LocationCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT lc FROM LocationCategory lc WHERE lc.isActive = true ORDER BY lc.name")
    List<LocationCategory> findActiveCategories();
}
