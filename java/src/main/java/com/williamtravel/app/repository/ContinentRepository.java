package com.williamtravel.app.repository;

import com.williamtravel.app.entity.Continent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Continent entity
 */
@Repository
public interface ContinentRepository extends JpaRepository<Continent, Integer> {
    
    /**
     * Find continent by code
     */
    Optional<Continent> findByCode(String code);
    
    /**
     * Find continent by name
     */
    Optional<Continent> findByName(String name);
    
    /**
     * Find active continents
     */
    List<Continent> findByStatus(Integer status);
    
    /**
     * Find continents by name containing (case insensitive)
     */
    List<Continent> findByNameContainingIgnoreCase(String name);
    
    /**
     * Check if continent code exists
     */
    boolean existsByCode(String code);
    
    /**
     * Check if continent name exists
     */
    boolean existsByName(String name);
    
    /**
     * Find continents with pagination and search
     */
    @Query("SELECT c FROM Continent c WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR c.status = :status)")
    Page<Continent> findContinentsWithFilters(@Param("search") String search,
                                             @Param("status") Integer status,
                                             Pageable pageable);
    
    /**
     * Find continents with their countries
     */
    @Query("SELECT DISTINCT c FROM Continent c LEFT JOIN FETCH c.countries")
    List<Continent> findAllWithCountries();
}
