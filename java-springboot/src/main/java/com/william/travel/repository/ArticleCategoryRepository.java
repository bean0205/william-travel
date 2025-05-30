package com.william.travel.repository;

import com.william.travel.entity.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Long> {
    
    Optional<ArticleCategory> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT ac FROM ArticleCategory ac WHERE ac.status = true ORDER BY ac.name")
    List<ArticleCategory> findActiveCategories();
}
