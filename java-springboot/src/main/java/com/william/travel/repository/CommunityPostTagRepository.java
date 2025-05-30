package com.william.travel.repository;

import com.william.travel.entity.CommunityPostTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CommunityPostTagRepository extends JpaRepository<CommunityPostTag, Long> {
    
    Optional<CommunityPostTag> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT cpt FROM CommunityPostTag cpt WHERE cpt.isActive = true ORDER BY cpt.name")
    List<CommunityPostTag> findActiveTags();
    
    @Query("SELECT cpt FROM CommunityPostTag cpt WHERE LOWER(cpt.name) LIKE LOWER(CONCAT('%', :name, '%')) AND cpt.isActive = true ORDER BY cpt.name")
    List<CommunityPostTag> findActiveByNameContaining(@Param("name") String name);
}
