package com.william.travel.repository;

import com.william.travel.entity.AccommodationRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AccommodationRoomRepository extends JpaRepository<AccommodationRoom, Long> {
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.accommodation.id = :accommodationId AND ar.isActive = true ORDER BY ar.pricePerNight")
    List<AccommodationRoom> findActiveByAccommodationId(@Param("accommodationId") Long accommodationId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.accommodation.id = :accommodationId AND ar.isAvailable = true AND ar.isActive = true ORDER BY ar.pricePerNight")
    List<AccommodationRoom> findAvailableByAccommodationId(@Param("accommodationId") Long accommodationId);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE " +
           "ar.accommodation.id = :accommodationId AND " +
           "(:minPrice IS NULL OR ar.pricePerNight >= :minPrice) AND " +
           "(:maxPrice IS NULL OR ar.pricePerNight <= :maxPrice) AND " +
           "ar.isActive = true ORDER BY ar.pricePerNight")
    List<AccommodationRoom> findActiveByAccommodationIdAndPriceRange(@Param("accommodationId") Long accommodationId,
                                                                     @Param("minPrice") BigDecimal minPrice,
                                                                     @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT ar FROM AccommodationRoom ar WHERE ar.accommodation.id = :accommodationId AND ar.capacity >= :minCapacity AND ar.isActive = true ORDER BY ar.capacity")
    List<AccommodationRoom> findActiveByAccommodationIdAndMinCapacity(@Param("accommodationId") Long accommodationId,
                                                                      @Param("minCapacity") Integer minCapacity);
}
