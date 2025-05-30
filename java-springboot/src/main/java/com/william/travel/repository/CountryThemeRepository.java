package com.william.travel.repository;

import com.william.travel.entity.CountryTheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CountryThemeRepository extends JpaRepository<CountryTheme, Long> {
    
    @Query("SELECT ct FROM CountryTheme ct WHERE ct.country.id = :countryId")
    List<CountryTheme> findByCountryId(@Param("countryId") Long countryId);
    
    @Query("SELECT ct FROM CountryTheme ct WHERE ct.country.isActive = true ORDER BY ct.country.name, ct.theme")
    List<CountryTheme> findByActiveCountries();
}
