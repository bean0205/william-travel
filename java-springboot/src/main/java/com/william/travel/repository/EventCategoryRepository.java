package com.william.travel.repository;

import com.william.travel.entity.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {
    
    Optional<EventCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT ec FROM EventCategory ec WHERE ec.isActive = true ORDER BY ec.name")
    List<EventCategory> findActiveCategories();
}
