package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Ward;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Ward entity operations
 */
@Repository
public interface WardRepository extends JpaRepository<Ward, Integer> {

    // Basic finder methods
    Optional<Ward> findByCode(String code);
    
    Optional<Ward> findByName(String name);
    
    List<Ward> findByNameContainingIgnoreCase(String name);
    
    boolean existsByCode(String code);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<Ward> findByStatus(Integer status);
    
    Page<Ward> findByStatus(Integer status, Pageable pageable);
    
    List<Ward> findByStatusOrderByName(Integer status);
    
    // District relationship queries
    List<Ward> findByDistrictId(Integer districtId);
    
    Page<Ward> findByDistrictId(Integer districtId, Pageable pageable);
    
    List<Ward> findByDistrictIdAndStatus(Integer districtId, Integer status);
    
    Page<Ward> findByDistrictIdAndStatus(Integer districtId, Integer status, Pageable pageable);
    
    @Query("SELECT w FROM Ward w JOIN FETCH w.district WHERE w.district.id = :districtId")
    List<Ward> findByDistrictIdWithDistrict(@Param("districtId") Integer districtId);
    
    @Query("SELECT w FROM Ward w JOIN FETCH w.district d JOIN FETCH d.region r JOIN FETCH r.country WHERE w.district.id = :districtId AND w.status = :status")
    List<Ward> findByDistrictIdAndStatusWithFullHierarchy(@Param("districtId") Integer districtId, @Param("status") Integer status);
    
    // Region-based queries through district
    @Query("SELECT w FROM Ward w WHERE w.district.region.id = :regionId")
    List<Ward> findByRegionId(@Param("regionId") Integer regionId);
    
    @Query("SELECT w FROM Ward w WHERE w.district.region.id = :regionId AND w.status = :status")
    List<Ward> findByRegionIdAndStatus(@Param("regionId") Integer regionId, @Param("status") Integer status);
    
    // Country-based queries through district and region
    @Query("SELECT w FROM Ward w WHERE w.district.region.country.id = :countryId")
    List<Ward> findByCountryId(@Param("countryId") Integer countryId);
    
    @Query("SELECT w FROM Ward w WHERE w.district.region.country.id = :countryId AND w.status = :status")
    List<Ward> findByCountryIdAndStatus(@Param("countryId") Integer countryId, @Param("status") Integer status);
    
    // Count queries
    long countByDistrictId(Integer districtId);
    
    long countByDistrictIdAndStatus(Integer districtId, Integer status);
    
    long countByStatus(Integer status);
    
    @Query("SELECT COUNT(w) FROM Ward w WHERE w.district.region.id = :regionId")
    long countByRegionId(@Param("regionId") Integer regionId);
    
    @Query("SELECT COUNT(w) FROM Ward w WHERE w.district.region.country.id = :countryId")
    long countByCountryId(@Param("countryId") Integer countryId);
    
    // Search and filtering
    @Query("SELECT w FROM Ward w WHERE " +
           "(:name IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:code IS NULL OR LOWER(w.code) LIKE LOWER(CONCAT('%', :code, '%'))) AND " +
           "(:districtId IS NULL OR w.district.id = :districtId) AND " +
           "(:status IS NULL OR w.status = :status)")
    Page<Ward> findWithFilters(@Param("name") String name,
                              @Param("code") String code,
                              @Param("districtId") Integer districtId,
                              @Param("status") Integer status,
                              Pageable pageable);
    
    @Query("SELECT w FROM Ward w JOIN FETCH w.district d JOIN FETCH d.region r JOIN FETCH r.country WHERE " +
           "(:name IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:status IS NULL OR w.status = :status)")
    List<Ward> searchByNameWithFullHierarchy(@Param("name") String name, @Param("status") Integer status);
    
    // Date-based queries
    List<Ward> findByCreatedDate(LocalDate createdDate);
    
    List<Ward> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Ward> findByUpdatedDate(LocalDate updatedDate);
    
    // Advanced queries with relationships
    @Query("SELECT w FROM Ward w LEFT JOIN FETCH w.locations WHERE w.id = :id")
    Optional<Ward> findByIdWithLocations(@Param("id") Integer id);
    
    @Query("SELECT w FROM Ward w LEFT JOIN FETCH w.accommodations WHERE w.id = :id")
    Optional<Ward> findByIdWithAccommodations(@Param("id") Integer id);
    
    @Query("SELECT w FROM Ward w LEFT JOIN FETCH w.foods WHERE w.id = :id")
    Optional<Ward> findByIdWithFoods(@Param("id") Integer id);
    
    @Query("SELECT w FROM Ward w LEFT JOIN FETCH w.events WHERE w.id = :id")
    Optional<Ward> findByIdWithEvents(@Param("id") Integer id);
    
    // Statistics queries
    @Query("SELECT w, COUNT(l) FROM Ward w LEFT JOIN w.locations l GROUP BY w")
    List<Object[]> findWardsWithLocationCount();
    
    @Query("SELECT w, COUNT(a) FROM Ward w LEFT JOIN w.accommodations a GROUP BY w")
    List<Object[]> findWardsWithAccommodationCount();
    
    @Query("SELECT w, COUNT(f) FROM Ward w LEFT JOIN w.foods f GROUP BY w")
    List<Object[]> findWardsWithFoodCount();
    
    @Query("SELECT w, COUNT(e) FROM Ward w LEFT JOIN w.events e GROUP BY w")
    List<Object[]> findWardsWithEventCount();
    
    // Validation queries
    boolean existsByCodeAndIdNot(String code, Integer id);
    
    boolean existsByNameAndIdNot(String name, Integer id);
    
    boolean existsByDistrictIdAndCodeAndIdNot(Integer districtId, String code, Integer id);
    
    // Custom queries for specific business logic
    @Query("SELECT w FROM Ward w WHERE w.district.id = :districtId AND w.status = 1 ORDER BY w.name")
    List<Ward> findActiveWardsByDistrict(@Param("districtId") Integer districtId);
    
    @Query("SELECT DISTINCT w FROM Ward w WHERE w.backgroundImage IS NOT NULL AND w.status = 1")
    List<Ward> findActiveWardsWithBackgroundImage();
    
    @Query("SELECT w FROM Ward w WHERE w.logo IS NOT NULL AND w.status = 1")
    List<Ward> findActiveWardsWithLogo();
    
    @Query("SELECT w FROM Ward w WHERE w.district.region.id = :regionId AND w.status = 1 ORDER BY w.district.name, w.name")
    List<Ward> findActiveWardsByRegionOrderedByDistrict(@Param("regionId") Integer regionId);
    
    @Query("SELECT w FROM Ward w WHERE w.district.region.country.id = :countryId AND w.status = 1 ORDER BY w.district.region.name, w.district.name, w.name")
    List<Ward> findActiveWardsByCountryOrderedByHierarchy(@Param("countryId") Integer countryId);
}
