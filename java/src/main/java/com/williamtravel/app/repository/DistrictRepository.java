package com.williamtravel.app.repository;

import com.williamtravel.app.entity.District;
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
 * Repository interface for District entity operations
 */
@Repository
public interface DistrictRepository extends JpaRepository<District, Integer> {

    // Basic finder methods
    Optional<District> findByCode(String code);
    
    Optional<District> findByName(String name);
    
    List<District> findByNameContainingIgnoreCase(String name);
    
    boolean existsByCode(String code);
    
    boolean existsByName(String name);
    
    // Status-based queries
    List<District> findByStatus(Integer status);
    
    Page<District> findByStatus(Integer status, Pageable pageable);
    
    List<District> findByStatusOrderByName(Integer status);
    
    // Region relationship queries
    List<District> findByRegionId(Integer regionId);
    
    Page<District> findByRegionId(Integer regionId, Pageable pageable);
    
    List<District> findByRegionIdAndStatus(Integer regionId, Integer status);
    
    Page<District> findByRegionIdAndStatus(Integer regionId, Integer status, Pageable pageable);
    
    @Query("SELECT d FROM District d JOIN FETCH d.region WHERE d.region.id = :regionId")
    List<District> findByRegionIdWithRegion(@Param("regionId") Integer regionId);
    
    @Query("SELECT d FROM District d JOIN FETCH d.region r JOIN FETCH r.country WHERE d.region.id = :regionId AND d.status = :status")
    List<District> findByRegionIdAndStatusWithRegionAndCountry(@Param("regionId") Integer regionId, @Param("status") Integer status);
    
    // Country-based queries through region
    @Query("SELECT d FROM District d WHERE d.region.country.id = :countryId")
    List<District> findByCountryId(@Param("countryId") Integer countryId);
    
    @Query("SELECT d FROM District d WHERE d.region.country.id = :countryId AND d.status = :status")
    List<District> findByCountryIdAndStatus(@Param("countryId") Integer countryId, @Param("status") Integer status);
    
    // Count queries
    long countByRegionId(Integer regionId);
    
    long countByRegionIdAndStatus(Integer regionId, Integer status);
    
    long countByStatus(Integer status);
    
    @Query("SELECT COUNT(d) FROM District d WHERE d.region.country.id = :countryId")
    long countByCountryId(@Param("countryId") Integer countryId);
    
    // Search and filtering
    @Query("SELECT d FROM District d WHERE " +
           "(:name IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:code IS NULL OR LOWER(d.code) LIKE LOWER(CONCAT('%', :code, '%'))) AND " +
           "(:regionId IS NULL OR d.region.id = :regionId) AND " +
           "(:status IS NULL OR d.status = :status)")
    Page<District> findWithFilters(@Param("name") String name,
                                  @Param("code") String code,
                                  @Param("regionId") Integer regionId,
                                  @Param("status") Integer status,
                                  Pageable pageable);
    
    @Query("SELECT d FROM District d JOIN FETCH d.region r JOIN FETCH r.country WHERE " +
           "(:name IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:status IS NULL OR d.status = :status)")
    List<District> searchByNameWithRegionAndCountry(@Param("name") String name, @Param("status") Integer status);
    
    // Date-based queries
    List<District> findByCreatedDate(LocalDate createdDate);
    
    List<District> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<District> findByUpdatedDate(LocalDate updatedDate);
    
    // Advanced queries with relationships
    @Query("SELECT d FROM District d LEFT JOIN FETCH d.wards WHERE d.id = :id")
    Optional<District> findByIdWithWards(@Param("id") Integer id);
    
    @Query("SELECT d FROM District d LEFT JOIN FETCH d.locations WHERE d.id = :id")
    Optional<District> findByIdWithLocations(@Param("id") Integer id);
    
    @Query("SELECT d FROM District d LEFT JOIN FETCH d.accommodations WHERE d.id = :id")
    Optional<District> findByIdWithAccommodations(@Param("id") Integer id);
    
    @Query("SELECT d FROM District d LEFT JOIN FETCH d.foods WHERE d.id = :id")
    Optional<District> findByIdWithFoods(@Param("id") Integer id);
    
    @Query("SELECT d FROM District d LEFT JOIN FETCH d.events WHERE d.id = :id")
    Optional<District> findByIdWithEvents(@Param("id") Integer id);
    
    // Statistics queries
    @Query("SELECT d, COUNT(w) FROM District d LEFT JOIN d.wards w GROUP BY d")
    List<Object[]> findDistrictsWithWardCount();
    
    @Query("SELECT d, COUNT(l) FROM District d LEFT JOIN d.locations l GROUP BY d")
    List<Object[]> findDistrictsWithLocationCount();
    
    @Query("SELECT d, COUNT(a) FROM District d LEFT JOIN d.accommodations a GROUP BY d")
    List<Object[]> findDistrictsWithAccommodationCount();
    
    @Query("SELECT d, COUNT(f) FROM District d LEFT JOIN d.foods f GROUP BY d")
    List<Object[]> findDistrictsWithFoodCount();
    
    @Query("SELECT d, COUNT(e) FROM District d LEFT JOIN d.events e GROUP BY d")
    List<Object[]> findDistrictsWithEventCount();
    
    // Validation queries
    boolean existsByCodeAndIdNot(String code, Integer id);
    
    boolean existsByNameAndIdNot(String name, Integer id);
    
    boolean existsByRegionIdAndCodeAndIdNot(Integer regionId, String code, Integer id);
    
    // Custom queries for specific business logic
    @Query("SELECT d FROM District d WHERE d.region.id = :regionId AND d.status = 1 ORDER BY d.name")
    List<District> findActiveDistrictsByRegion(@Param("regionId") Integer regionId);
    
    @Query("SELECT DISTINCT d FROM District d WHERE d.backgroundImage IS NOT NULL AND d.status = 1")
    List<District> findActiveDistrictsWithBackgroundImage();
    
    @Query("SELECT d FROM District d WHERE d.logo IS NOT NULL AND d.status = 1")
    List<District> findActiveDistrictsWithLogo();
    
    @Query("SELECT d FROM District d WHERE d.region.country.id = :countryId AND d.status = 1 ORDER BY d.region.name, d.name")
    List<District> findActiveDistrictsByCountryOrderedByRegion(@Param("countryId") Integer countryId);
}
