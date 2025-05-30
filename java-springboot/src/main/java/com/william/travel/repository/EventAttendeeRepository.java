package com.william.travel.repository;

import com.william.travel.entity.EventAttendee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventAttendeeRepository extends JpaRepository<EventAttendee, Long> {
    
    @Query("SELECT ea FROM EventAttendee ea WHERE ea.event.id = :eventId ORDER BY ea.registeredAt DESC")
    Page<EventAttendee> findByEventId(@Param("eventId") Long eventId, Pageable pageable);
    
    @Query("SELECT ea FROM EventAttendee ea WHERE ea.user.id = :userId ORDER BY ea.registeredAt DESC")
    Page<EventAttendee> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT ea FROM EventAttendee ea WHERE ea.user.id = :userId AND ea.event.id = :eventId")
    Optional<EventAttendee> findByUserIdAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);
    
    @Query("SELECT ea FROM EventAttendee ea WHERE ea.event.id = :eventId AND ea.attendanceStatus = :status ORDER BY ea.registeredAt DESC")
    List<EventAttendee> findByEventIdAndStatus(@Param("eventId") Long eventId, @Param("status") String status);
    
    @Query("SELECT COUNT(ea) FROM EventAttendee ea WHERE ea.event.id = :eventId")
    Long countByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT COUNT(ea) FROM EventAttendee ea WHERE ea.event.id = :eventId AND ea.attendanceStatus = :status")
    Long countByEventIdAndStatus(@Param("eventId") Long eventId, @Param("status") String status);
    
    @Query("SELECT ea.attendanceStatus, COUNT(ea) FROM EventAttendee ea WHERE ea.event.id = :eventId GROUP BY ea.attendanceStatus")
    List<Object[]> countAttendanceStatusByEvent(@Param("eventId") Long eventId);
    
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}
