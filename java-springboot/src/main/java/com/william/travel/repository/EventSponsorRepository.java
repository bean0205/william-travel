package com.william.travel.repository;

import com.william.travel.entity.EventSponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventSponsorRepository extends JpaRepository<EventSponsor, Long> {
    
    @Query("SELECT es FROM EventSponsor es WHERE es.event.id = :eventId ORDER BY es.sponsorshipLevel DESC, es.name ASC")
    List<EventSponsor> findByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT es FROM EventSponsor es WHERE es.event.id = :eventId AND es.sponsorshipLevel = :level ORDER BY es.name ASC")
    List<EventSponsor> findByEventIdAndLevel(@Param("eventId") Long eventId, @Param("level") String level);
    
    @Query("SELECT es FROM EventSponsor es WHERE LOWER(es.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY es.name ASC")
    List<EventSponsor> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT COUNT(es) FROM EventSponsor es WHERE es.event.id = :eventId")
    Long countByEventId(@Param("eventId") Long eventId);
}
