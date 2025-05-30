package com.william.travel.repository;

import com.william.travel.entity.Accommodation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    
    @Query("SELECT a FROM Accommodation a WHERE a.isActive = true ORDER BY a.name")
    Page<Accommodation> findActiveAccommodations(Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE a.category.id = :categoryId AND a.isActive = true ORDER BY a.name")
    Page<Accommodation> findActiveByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE a.ward.id = :wardId AND a.isActive = true ORDER BY a.name")
    List<Accommodation> findActiveByWardId(@Param("wardId") Long wardId);
    
    @Query("SELECT a FROM Accommodation a WHERE a.district.id = :districtId AND a.isActive = true ORDER BY a.name")
    List<Accommodation> findActiveByDistrictId(@Param("districtId") Long districtId);
    
    @Query("SELECT a FROM Accommodation a WHERE a.region.id = :regionId AND a.isActive = true ORDER BY a.name")
    List<Accommodation> findActiveByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT a FROM Accommodation a WHERE a.country.id = :countryId AND a.isActive = true ORDER BY a.name")
    Page<Accommodation> findActiveByCountryId(@Param("countryId") Long countryId, Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%')) AND a.isActive = true ORDER BY a.name")
    Page<Accommodation> findActiveByNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE " +
           "(:minPrice IS NULL OR a.priceMin >= :minPrice) AND " +
           "(:maxPrice IS NULL OR a.priceMax <= :maxPrice) AND " +
           "a.isActive = true ORDER BY a.priceMin")
    Page<Accommodation> findActiveByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                              @Param("maxPrice") BigDecimal maxPrice, 
                                              Pageable pageable);
    
    @Query("SELECT a FROM Accommodation a WHERE a.popularityScore >= :minScore AND a.isActive = true ORDER BY a.popularityScore DESC")
    Page<Accommodation> findActiveByMinPopularityScore(@Param("minScore") Double minScore, Pageable pageable);
    
    // Geographic distance search using Haversine formula
    @Query("SELECT a FROM Accommodation a WHERE " +
           "a.latitude IS NOT NULL AND a.longitude IS NOT NULL AND " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(a.latitude)) * " +
           "cos(radians(a.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(a.latitude)))) <= :radiusKm AND " +
           "a.isActive = true " +
           "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(a.latitude)) * " +
           "cos(radians(a.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(a.latitude))))")
    List<Accommodation> findActiveWithinRadius(@Param("latitude") Double latitude,
                                             @Param("longitude") Double longitude,
                                             @Param("radiusKm") Double radiusKm);
}
