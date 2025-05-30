package com.william.travel.repository;

import com.william.travel.entity.Organizer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    
    Optional<Organizer> findByName(String name);
    
    Optional<Organizer> findByEmail(String email);
    
    boolean existsByName(String name);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT o FROM Organizer o WHERE o.status = true ORDER BY o.name")
    Page<Organizer> findActiveOrganizers(Pageable pageable);
    
    @Query("SELECT o FROM Organizer o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%')) AND o.status = true ORDER BY o.name")
    Page<Organizer> findActiveByNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT o FROM Organizer o WHERE o.user.id = :userId")
    java.util.List<Organizer> findByUserId(@Param("userId") Long userId);
    
    long countByUserId(Long userId);
}
