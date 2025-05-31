package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Country;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Country entity
 */
@Repository
public interface CountryRepository extends JpaRepository<Country, Integer> {
    
    /**
     * Find country by code
     */
    Optional<Country> findByCode(String code);
    
    /**
     * Find country by name
     */
    Optional<Country> findByName(String name);
    
    /**
     * Find countries by continent
     */
    List<Country> findByContinentId(Integer continentId);
    
    /**
     * Find active countries
     */
    List<Country> findByStatus(Integer status);
    
    /**
     * Find countries by continent and status
     */
    List<Country> findByContinentIdAndStatus(Integer continentId, Integer status);
    
    /**
     * Find countries by name containing (case insensitive)
     */
    List<Country> findByNameContainingIgnoreCase(String name);
    
    /**
     * Check if country code exists
     */
    boolean existsByCode(String code);
    
    /**
     * Check if country name exists
     */
    boolean existsByName(String name);
    
    /**
     * Find countries with pagination and search
     */
    @Query("SELECT c FROM Country c WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:continentId IS NULL OR c.continent.id = :continentId) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Country> findCountriesWithFilters(@Param("search") String search,
                                          @Param("continentId") Integer continentId,
                                          @Param("status") Integer status,
                                          Pageable pageable);
    
    /**
     * Find countries with their regions
     */
    @Query("SELECT DISTINCT c FROM Country c LEFT JOIN FETCH c.regions WHERE c.id = :countryId")
    Optional<Country> findWithRegionsById(@Param("countryId") Integer countryId);
}
