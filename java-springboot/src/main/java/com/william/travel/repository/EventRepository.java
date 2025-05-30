package com.william.travel.repository;

import com.william.travel.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    @Query("SELECT e FROM Event e WHERE e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findActiveEvents(Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.category.id = :categoryId AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findActiveByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.organizer.id = :organizerId AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findActiveByOrganizerId(@Param("organizerId") Long organizerId, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.ward.id = :wardId AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    List<Event> findActiveByWardId(@Param("wardId") Long wardId);
    
    @Query("SELECT e FROM Event e WHERE e.district.id = :districtId AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    List<Event> findActiveByDistrictId(@Param("districtId") Long districtId);
    
    @Query("SELECT e FROM Event e WHERE e.region.id = :regionId AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    List<Event> findActiveByRegionId(@Param("regionId") Long regionId);
    
    @Query("SELECT e FROM Event e WHERE e.country.id = :countryId AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findActiveByCountryId(@Param("countryId") Long countryId, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE " +
           "e.startDate >= :startDate AND e.startDate <= :endDate AND " +
           "e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findActiveByDateRange(@Param("startDate") LocalDate startDate, 
                                     @Param("endDate") LocalDate endDate, 
                                     Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE " +
           "e.startDate >= :now AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findUpcomingEvents(@Param("now") LocalDate now, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE " +
           "e.endDate < :now AND e.status = true ORDER BY e.startDate DESC, e.startTime DESC")
    Page<Event> findPastEvents(@Param("now") LocalDate now, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND " +
           "e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findActiveBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.user.id = :userId AND e.status = true ORDER BY e.startDate ASC, e.startTime ASC")
    Page<Event> findActiveByUserId(@Param("userId") Long userId, Pageable pageable);
}
