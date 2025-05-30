package com.william.travel.repository;

import com.william.travel.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    @Query("SELECT f FROM Food f WHERE f.status = true ORDER BY f.name")
    Page<Food> findActiveFoods(Pageable pageable);
    
    @Query("SELECT f FROM Food f WHERE f.category.id = :categoryId AND f.status = true ORDER BY f.name")
    Page<Food> findActiveByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT f FROM Food f WHERE f.ward.id = :wardId AND f.status = true ORDER BY f.name")
    List<Food> findActiveByWardId(@Param("wardId") Long wardId);
    
    @Query("SELECT f FROM Food f WHERE f.district.id = :districtId AND f.status = true ORDER BY f.name")
    List<Food> findActiveByDistrictId(@Param("districtId") Long districtId);
    
    @Query("SELECT f FROM Food f WHERE f.region.id = :regionId AND f.status = true ORDER BY f.name")
    List<Food> findActiveByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT f FROM Food f WHERE f.country.id = :countryId AND f.status = true ORDER BY f.name")
    Page<Food> findActiveByCountryId(@Param("countryId") Long countryId, Pageable pageable);
    
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :name, '%')) AND f.status = true ORDER BY f.name")
    Page<Food> findActiveByNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT f FROM Food f WHERE " +
           "(:minPrice IS NULL OR f.priceMin >= :minPrice) AND " +
           "(:maxPrice IS NULL OR f.priceMax <= :maxPrice) AND " +
           "f.status = true ORDER BY f.priceMin")
    Page<Food> findActiveByPriceRange(@Param("minPrice") BigDecimal minPrice, 
                                     @Param("maxPrice") BigDecimal maxPrice, 
                                     Pageable pageable);
    
    @Query("SELECT f FROM Food f WHERE f.popularityScore >= :minScore AND f.status = true ORDER BY f.popularityScore DESC")
    Page<Food> findActiveByMinPopularityScore(@Param("minScore") Double minScore, Pageable pageable);
}
