package com.william.travel.repository;

import com.william.travel.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<Ward, Long> {
    
    Optional<Ward> findByName(String name);
    
    Optional<Ward> findByCode(String code);
    
    boolean existsByName(String name);
    
    boolean existsByCode(String code);
    
    @Query("SELECT w FROM Ward w WHERE w.status = 1 ORDER BY w.name")
    List<Ward> findActiveWards();
    
    @Query("SELECT w FROM Ward w WHERE w.district.id = :districtId AND w.status = 1 ORDER BY w.name")
    List<Ward> findActiveByDistrictId(@Param("districtId") Long districtId);
    
    @Query("SELECT w FROM Ward w WHERE w.district.code = :districtCode AND w.status = 1 ORDER BY w.name")
    List<Ward> findActiveByDistrictCode(@Param("districtCode") String districtCode);
    
    List<Ward> findByDistrictId(Long districtId);
    
    long countByDistrictId(Long districtId);
}
