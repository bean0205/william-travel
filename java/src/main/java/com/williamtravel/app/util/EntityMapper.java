package com.williamtravel.app.util;

import com.williamtravel.app.dto.*;
import com.williamtravel.app.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for mapping between entities and DTOs
 */
@Component
public class EntityMapper {

    /**
     * Convert LocationCategory to SimpleEntityDto
     */
    public SimpleEntityDto toSimpleDto(LocationCategory locationCategory) {
        if (locationCategory == null) return null;
        
        SimpleEntityDto dto = new SimpleEntityDto();
        dto.setId(locationCategory.getId());
        dto.setName(locationCategory.getName());
        dto.setStatus(locationCategory.getStatus());
        dto.setCreatedAt(locationCategory.getCreatedAt());
        dto.setUpdatedAt(locationCategory.getUpdatedAt());
        return dto;
    }

    public static UserDto toUserDto(User user) {
        if (user == null) return null;
        
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setIsActive(user.getIsActive());
        dto.setIsSuperuser(user.getIsSuperuser());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        
        if (user.getRole() != null) {
            dto.setRole(toRoleDto(user.getRole()));
        }
        
        return dto;
    }

    public static RoleDto toRoleDto(Role role) {
        if (role == null) return null;
        
        return new RoleDto(
            role.getId(),
            role.getName(),
            role.getDescription(),
            role.getIsDefault()
        );
    }

    public static AccommodationDto toAccommodationDto(Accommodation accommodation) {
        if (accommodation == null) return null;
        
        AccommodationDto dto = new AccommodationDto();
        dto.setId(accommodation.getId());
        dto.setName(accommodation.getName());
        dto.setNameCode(accommodation.getNameCode());
        dto.setDescription(accommodation.getDescription());
        dto.setDescriptionCode(accommodation.getDescriptionCode());
        dto.setAddress(accommodation.getAddress());
        dto.setCity(accommodation.getCity());
        dto.setThumbnailUrl(accommodation.getThumbnailUrl());
        dto.setPriceMin(accommodation.getPriceMin());
        dto.setPriceMax(accommodation.getPriceMax());
        dto.setPopularityScore(accommodation.getPopularityScore());
        dto.setCheckinTime(accommodation.getCheckinTime());
        dto.setCheckoutTime(accommodation.getCheckoutTime());
        dto.setCancelPolicy(accommodation.getCancelPolicy());
        dto.setPetPolicy(accommodation.getPetPolicy());
        dto.setChildPolicy(accommodation.getChildPolicy());
        dto.setIsActive(accommodation.getIsActive());
        dto.setLatitude(accommodation.getLatitude());
        dto.setLongitude(accommodation.getLongitude());
        dto.setGeom(accommodation.getGeom());
        dto.setCreatedAt(accommodation.getCreatedAt());
        dto.setUpdatedAt(accommodation.getUpdatedAt());
        
        if (accommodation.getCategory() != null) {
            dto.setCategoryId(accommodation.getCategory().getId());
            dto.setCategoryName(accommodation.getCategory().getName());
        }
        
        if (accommodation.getUser() != null) {
            dto.setUserId(accommodation.getUser().getId());
            dto.setUserName(accommodation.getUser().getFullName());
        }
        
        if (accommodation.getCountry() != null) {
            dto.setCountryId(accommodation.getCountry().getId());
            dto.setCountryName(accommodation.getCountry().getName());
        }
        
        if (accommodation.getRegion() != null) {
            dto.setRegionId(accommodation.getRegion().getId());
            dto.setRegionName(accommodation.getRegion().getName());
        }
        
        if (accommodation.getDistrict() != null) {
            dto.setDistrictId(accommodation.getDistrict().getId());
            dto.setDistrictName(accommodation.getDistrict().getName());
        }
        
        if (accommodation.getWard() != null) {
            dto.setWardId(accommodation.getWard().getId());
            dto.setWardName(accommodation.getWard().getName());
        }
        
        return dto;
    }

    public static LocationDto toLocationDto(Location location) {
        if (location == null) return null;
        
        LocationDto dto = new LocationDto();
        dto.setId(location.getId());
        dto.setName(location.getName());
        dto.setNameCode(location.getNameCode());
        dto.setDescription(location.getDescription());
        dto.setDescriptionCode(location.getDescriptionCode());
        dto.setAddress(location.getAddress());
        dto.setCity(location.getCity());
        dto.setThumbnailUrl(location.getThumbnailUrl());
        dto.setPriceMin(location.getPriceMin());
        dto.setPriceMax(location.getPriceMax());
        dto.setPopularityScore(location.getPopularityScore());
        dto.setIsActive(location.getIsActive());
        dto.setLatitude(location.getLatitude());
        dto.setLongitude(location.getLongitude());
        dto.setGeom(location.getGeom());
        dto.setCreatedAt(location.getCreatedAt());
        dto.setUpdatedAt(location.getUpdatedAt());
        
        if (location.getCategory() != null) {
            dto.setCategoryId(location.getCategory().getId());
            dto.setCategoryName(location.getCategory().getName());
        }
        
        if (location.getCountry() != null) {
            dto.setCountryId(location.getCountry().getId());
            dto.setCountryName(location.getCountry().getName());
        }
        
        if (location.getRegion() != null) {
            dto.setRegionId(location.getRegion().getId());
            dto.setRegionName(location.getRegion().getName());
        }
        
        if (location.getDistrict() != null) {
            dto.setDistrictId(location.getDistrict().getId());
            dto.setDistrictName(location.getDistrict().getName());
        }
        
        if (location.getWard() != null) {
            dto.setWardId(location.getWard().getId());
            dto.setWardName(location.getWard().getName());
        }
        
        return dto;
    }

    public static FoodDto toFoodDto(Food food) {
        if (food == null) return null;
        
        FoodDto dto = new FoodDto();
        dto.setId(food.getId());
        dto.setName(food.getName());
        dto.setNameCode(food.getNameCode());
        dto.setDescription(food.getDescription());
        dto.setDescriptionCode(food.getDescriptionCode());
        dto.setThumbnailUrl(food.getThumbnailUrl());
        dto.setPriceMin(food.getPriceMin());
        dto.setPriceMax(food.getPriceMax());
        dto.setPopularityScore(food.getPopularityScore());
        dto.setStatus(food.getStatus());
        dto.setCreatedAt(food.getCreatedAt());
        dto.setUpdatedAt(food.getUpdatedAt());
        
        if (food.getCategory() != null) {
            dto.setCategoryId(food.getCategory().getId());
            dto.setCategoryName(food.getCategory().getName());
        }
        
        if (food.getCountry() != null) {
            dto.setCountryId(food.getCountry().getId());
            dto.setCountryName(food.getCountry().getName());
        }
        
        if (food.getRegion() != null) {
            dto.setRegionId(food.getRegion().getId());
            dto.setRegionName(food.getRegion().getName());
        }
        
        if (food.getDistrict() != null) {
            dto.setDistrictId(food.getDistrict().getId());
            dto.setDistrictName(food.getDistrict().getName());
        }
        
        if (food.getWard() != null) {
            dto.setWardId(food.getWard().getId());
            dto.setWardName(food.getWard().getName());
        }
        
        return dto;
    }

    public static SimpleEntityDto toSimpleEntityDto(Country country) {
        if (country == null) return null;
        
        SimpleEntityDto dto = new SimpleEntityDto();
        dto.setId(country.getId());
        dto.setName(country.getName());
        dto.setCode(country.getCode());
        dto.setNameCode(country.getNameCode());
        dto.setDescription(country.getDescription());
        dto.setDescriptionCode(country.getDescriptionCode());
        dto.setBackgroundImage(country.getBackgroundImage());
        dto.setLogo(country.getLogo());
        dto.setStatus(country.getStatus() == 1); // Convert Integer to Boolean
        dto.setCreatedAt(country.getCreatedDate().atStartOfDay());
        dto.setUpdatedAt(country.getUpdatedDate() != null ? country.getUpdatedDate().atStartOfDay() : null);
        
        return dto;
    }

    public static SimpleEntityDto toSimpleEntityDto(Region region) {
        if (region == null) return null;
        
        SimpleEntityDto dto = new SimpleEntityDto();
        dto.setId(region.getId());
        dto.setName(region.getName());
        dto.setCode(region.getCode());
        dto.setNameCode(region.getNameCode());
        dto.setDescription(region.getDescription());
        dto.setDescriptionCode(region.getDescriptionCode());
        dto.setBackgroundImage(region.getBackgroundImage());
        dto.setLogo(region.getLogo());
        dto.setStatus(region.getStatus() == 1); // Convert Integer to Boolean
        dto.setCreatedAt(region.getCreatedDate().atStartOfDay());
        dto.setUpdatedAt(region.getUpdatedDate() != null ? region.getUpdatedDate().atStartOfDay() : null);
        
        if (region.getCountry() != null) {
            dto.setParentId(region.getCountry().getId());
            dto.setParentName(region.getCountry().getName());
        }
        
        return dto;
    }

    public static SimpleEntityDto toSimpleEntityDto(District district) {
        if (district == null) return null;
        
        SimpleEntityDto dto = new SimpleEntityDto();
        dto.setId(district.getId());
        dto.setName(district.getName());
        dto.setCode(district.getCode());
        dto.setNameCode(district.getNameCode());
        dto.setDescription(district.getDescription());
        dto.setDescriptionCode(district.getDescriptionCode());
        dto.setBackgroundImage(district.getBackgroundImage());
        dto.setLogo(district.getLogo());
        dto.setStatus(district.getStatus() == 1); // Convert Integer to Boolean
        dto.setCreatedAt(district.getCreatedDate().atStartOfDay());
        dto.setUpdatedAt(district.getUpdatedDate() != null ? district.getUpdatedDate().atStartOfDay() : null);
        
        if (district.getRegion() != null) {
            dto.setParentId(district.getRegion().getId());
            dto.setParentName(district.getRegion().getName());
        }
        
        return dto;
    }

    public static SimpleEntityDto toSimpleEntityDto(Ward ward) {
        if (ward == null) return null;
        
        SimpleEntityDto dto = new SimpleEntityDto();
        dto.setId(ward.getId());
        dto.setName(ward.getName());
        dto.setCode(ward.getCode());
        dto.setNameCode(ward.getNameCode());
        dto.setDescription(ward.getDescription());
        dto.setDescriptionCode(ward.getDescriptionCode());
        dto.setBackgroundImage(ward.getBackgroundImage());
        dto.setLogo(ward.getLogo());
        dto.setStatus(ward.getStatus() == 1); // Convert Integer to Boolean
        dto.setCreatedAt(ward.getCreatedDate().atStartOfDay());
        dto.setUpdatedAt(ward.getUpdatedDate() != null ? ward.getUpdatedDate().atStartOfDay() : null);
        
        if (ward.getDistrict() != null) {
            dto.setParentId(ward.getDistrict().getId());
            dto.setParentName(ward.getDistrict().getName());
        }
        
        return dto;
    }

    public static SimpleEntityDto toSimpleCategoryDto(LocationCategory category) {
        if (category == null) return null;
        
        SimpleEntityDto dto = new SimpleEntityDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setStatus(category.getStatus());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());
        
        return dto;
    }

    // Generic list mappers
    public static <T, R> List<R> mapList(List<T> list, java.util.function.Function<T, R> mapper) {
        return list.stream().map(mapper).collect(Collectors.toList());
    }

    // Page mappers
    public static <T> PageResponseDto<T> toPageResponseDto(Page<T> page) {
        return new PageResponseDto<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast(),
            page.isEmpty()
        );
    }

    public static <T, R> PageResponseDto<R> toPageResponseDto(Page<T> page, java.util.function.Function<T, R> mapper) {
        List<R> mappedContent = page.getContent().stream()
            .map(mapper)
            .collect(Collectors.toList());
            
        return new PageResponseDto<>(
            mappedContent,
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast(),
            page.isEmpty()
        );
    }
}
