package com.william.travel.repository;

import com.william.travel.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    
    Optional<Country> findByName(String name);
    
    Optional<Country> findByCode(String code);
    
    boolean existsByName(String name);
    
    boolean existsByCode(String code);
    
    @Query("SELECT c FROM Country c WHERE c.isActive = true ORDER BY c.name")
    List<Country> findActiveCountries();
    
    @Query("SELECT c FROM Country c WHERE c.continent.id = :continentId AND c.isActive = true ORDER BY c.name")
    List<Country> findActiveByContinentId(@Param("continentId") Long continentId);
    
    @Query("SELECT c FROM Country c WHERE c.continent.code = :continentCode AND c.isActive = true ORDER BY c.name")
    List<Country> findActiveByContinentCode(@Param("continentCode") String continentCode);
}
