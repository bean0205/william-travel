package com.william.travel.repository;

import com.william.travel.entity.CommunityPostCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CommunityPostCategoryRepository extends JpaRepository<CommunityPostCategory, Long> {
    
    Optional<CommunityPostCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT cpc FROM CommunityPostCategory cpc WHERE cpc.isActive = true ORDER BY cpc.name")
    List<CommunityPostCategory> findActiveCategories();
}
