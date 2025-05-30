package com.william.travel.repository;

import com.william.travel.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    
    Optional<District> findByName(String name);
    
    Optional<District> findByCode(String code);
    
    boolean existsByName(String name);
    
    boolean existsByCode(String code);
    
    @Query("SELECT d FROM District d WHERE d.status = 1 ORDER BY d.name")
    List<District> findActiveDistricts();
    
    @Query("SELECT d FROM District d WHERE d.region.id = :regionId AND d.status = 1 ORDER BY d.name")
    List<District> findActiveByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT d FROM District d WHERE d.region.code = :regionCode AND d.status = 1 ORDER BY d.name")
    List<District> findActiveByRegionCode(@Param("regionCode") String regionCode);
    
    List<District> findByRegionId(Long regionId);
    
    long countByRegionId(Long regionId);
}
