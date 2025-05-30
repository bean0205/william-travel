package com.william.travel.repository;

import com.william.travel.entity.Continent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ContinentRepository extends JpaRepository<Continent, Long> {
    
    Optional<Continent> findByName(String name);
    
    Optional<Continent> findByCode(String code);
    
    boolean existsByName(String name);
    
    boolean existsByCode(String code);
    
    @Query("SELECT c FROM Continent c WHERE c.status = 1 ORDER BY c.name")
    List<Continent> findActiveContinents();
    
    @Query("SELECT c FROM Continent c JOIN c.countries country WHERE country.id = :countryId")
    Optional<Continent> findByCountryId(@Param("countryId") Long countryId);
}
