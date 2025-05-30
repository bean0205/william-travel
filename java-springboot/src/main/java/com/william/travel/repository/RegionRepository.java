package com.william.travel.repository;

import com.william.travel.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    
    Optional<Region> findByName(String name);
    
    Optional<Region> findByCode(String code);
    
    boolean existsByName(String name);
    
    boolean existsByCode(String code);
    
    @Query("SELECT r FROM Region r WHERE r.status = 1 ORDER BY r.name")
    List<Region> findActiveRegions();
    
    @Query("SELECT r FROM Region r WHERE r.country.id = :countryId AND r.status = 1 ORDER BY r.name")
    List<Region> findActiveByCountryId(@Param("countryId") Long countryId);
    
    @Query("SELECT r FROM Region r WHERE r.country.code = :countryCode AND r.status = 1 ORDER BY r.name")
    List<Region> findActiveByCountryCode(@Param("countryCode") String countryCode);
}
