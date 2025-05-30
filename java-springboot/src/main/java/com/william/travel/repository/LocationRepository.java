package com.william.travel.repository;

import com.william.travel.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    Optional<Location> findByNameAndWardId(String name, Long wardId);
    
    @Query("SELECT l FROM Location l WHERE l.isActive = true ORDER BY l.name")
    Page<Location> findActiveLocations(Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE l.category.id = :categoryId AND l.isActive = true ORDER BY l.name")
    Page<Location> findActiveByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE l.ward.id = :wardId AND l.isActive = true ORDER BY l.name")
    List<Location> findActiveByWardId(@Param("wardId") Long wardId);
    
    @Query("SELECT l FROM Location l WHERE l.ward.district.id = :districtId AND l.isActive = true ORDER BY l.name")
    List<Location> findActiveByDistrictId(@Param("districtId") Long districtId);
    
    @Query("SELECT l FROM Location l WHERE l.ward.district.region.id = :regionId AND l.isActive = true ORDER BY l.name")
    List<Location> findActiveByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT l FROM Location l WHERE l.ward.district.region.country.id = :countryId AND l.isActive = true ORDER BY l.name")
    Page<Location> findActiveByCountryId(@Param("countryId") Long countryId, Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%')) AND l.isActive = true ORDER BY l.name")
    Page<Location> findActiveByNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT l FROM Location l WHERE " +
           "(:latitude IS NULL OR :longitude IS NULL OR :radius IS NULL OR " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(l.latitude)) * " +
           "cos(radians(l.longitude) - radians(:longitude)) + sin(radians(:latitude)) * " +
           "sin(radians(l.latitude)))) <= :radius) AND l.isActive = true ORDER BY l.name")
    List<Location> findActiveWithinRadius(@Param("latitude") BigDecimal latitude, 
                                         @Param("longitude") BigDecimal longitude, 
                                         @Param("radius") Double radius);
}
