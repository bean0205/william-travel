package com.william.travel.repository;

import com.william.travel.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface MediaTypeRepository extends JpaRepository<MediaType, Long> {
    
    Optional<MediaType> findByName(String name);
    
    boolean existsByName(String name);
    
    @Query("SELECT mt FROM MediaType mt WHERE mt.isActive = true ORDER BY mt.name")
    List<MediaType> findActiveTypes();
}
