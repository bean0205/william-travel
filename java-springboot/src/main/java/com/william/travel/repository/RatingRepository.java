package com.william.travel.repository;

import com.william.travel.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    @Query("SELECT r FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType ORDER BY r.createdAt DESC")
    List<Rating> findByReference(@Param("referenceId") Long referenceId, @Param("referenceType") String referenceType);
    
    @Query("SELECT r FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType ORDER BY r.createdAt DESC")
    Page<Rating> findByReference(@Param("referenceId") Long referenceId, @Param("referenceType") String referenceType, Pageable pageable);
    
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    Page<Rating> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId AND r.referenceId = :referenceId AND r.referenceType = :referenceType")
    Optional<Rating> findByUserAndReference(@Param("userId") Long userId, 
                                          @Param("referenceId") Long referenceId, 
                                          @Param("referenceType") String referenceType);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType")
    Double findAverageRatingByReference(@Param("referenceId") Long referenceId, @Param("referenceType") String referenceType);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType")
    Long countByReference(@Param("referenceId") Long referenceId, @Param("referenceType") String referenceType);
    
    @Query("SELECT r FROM Rating r WHERE r.referenceId = :referenceId AND r.referenceType = :referenceType AND r.rating >= :minRating ORDER BY r.createdAt DESC")
    List<Rating> findByReferenceAndMinRating(@Param("referenceId") Long referenceId, 
                                           @Param("referenceType") String referenceType, 
                                           @Param("minRating") Integer minRating);
}
