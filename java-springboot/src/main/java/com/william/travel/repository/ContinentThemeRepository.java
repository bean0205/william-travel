package com.william.travel.repository;

import com.william.travel.entity.ContinentTheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContinentThemeRepository extends JpaRepository<ContinentTheme, Long> {
    
    @Query("SELECT ct FROM ContinentTheme ct WHERE ct.continent.id = :continentId")
    List<ContinentTheme> findByContinentId(@Param("continentId") Long continentId);
    
    @Query("SELECT ct FROM ContinentTheme ct WHERE ct.continent.isActive = true ORDER BY ct.continent.name, ct.theme")
    List<ContinentTheme> findByActiveContinents();
}
