package com.william.travel.repository;

import com.william.travel.entity.ArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ArticleTagRepository extends JpaRepository<ArticleTag, Long> {
    
    Optional<ArticleTag> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT at FROM ArticleTag at WHERE at.isActive = true ORDER BY at.name")
    List<ArticleTag> findActiveTags();
    
    @Query("SELECT at FROM ArticleTag at WHERE LOWER(at.name) LIKE LOWER(CONCAT('%', :name, '%')) AND at.isActive = true ORDER BY at.name")
    List<ArticleTag> findActiveByNameContaining(@Param("name") String name);
}
