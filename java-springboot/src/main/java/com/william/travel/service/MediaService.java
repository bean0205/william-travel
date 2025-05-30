package com.william.travel.service;

import com.william.travel.entity.Media;
import com.william.travel.entity.MediaType;
import com.william.travel.entity.MediaCategory;
import com.william.travel.repository.MediaRepository;
import com.william.travel.repository.MediaTypeRepository;
import com.william.travel.repository.MediaCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaTypeRepository mediaTypeRepository;
    private final MediaCategoryRepository mediaCategoryRepository;

    // Reference type constants for polymorphic relationships
    public static final String REFERENCE_TYPE_LOCATION = "location";
    public static final String REFERENCE_TYPE_ACCOMMODATION = "accommodation";
    public static final String REFERENCE_TYPE_FOOD = "food";
    public static final String REFERENCE_TYPE_ARTICLE = "article";
    public static final String REFERENCE_TYPE_EVENT = "event";
    public static final String REFERENCE_TYPE_ORGANIZER = "organizer";
    public static final String REFERENCE_TYPE_COMMUNITY_POST = "community_post";

    // CRUD Operations
    
    @Transactional
    public Media createMedia(Media media) {
        log.debug("Creating media: {} for reference: {} {}", media.getTitle(), media.getReferenceType(), media.getReferenceId());
        
        media.setStatus(1); // Active status
        media.setCreatedDate(LocalDate.now());
        
        return mediaRepository.save(media);
    }

    @Transactional
    public Media uploadMediaForEntity(MultipartFile file, String title, String description, 
                                    Long referenceId, String referenceType,
                                    Long typeId, Long categoryId) {
        log.debug("Uploading media file: {} for {} {}", file.getOriginalFilename(), referenceType, referenceId);
        
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Get media type and category
        MediaType mediaType = mediaTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Media type not found with id: " + typeId));
        
        MediaCategory mediaCategory = mediaCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Media category not found with id: " + categoryId));
        
        // Here you would implement file upload logic (e.g., to MinIO, AWS S3, etc.)
        // For now, we'll use a placeholder URL
        String fileUrl = uploadFileToStorage(file);
        
        Media media = new Media();
        media.setReferenceId(referenceId);
        media.setReferenceType(referenceType);
        media.setUrl(fileUrl);
        media.setTitle(title != null ? title : file.getOriginalFilename());
        media.setDescription(description);
        media.setType(mediaType);
        media.setCategory(mediaCategory);
        media.setStatus(1);
        media.setCreatedDate(LocalDate.now());
        
        return mediaRepository.save(media);
    }

    @Transactional
    public Media updateMedia(Long id, Media updatedMedia) {
        log.debug("Updating media with id: {}", id);
        
        Media existingMedia = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + id));

        // Update fields
        existingMedia.setTitle(updatedMedia.getTitle());
        existingMedia.setDescription(updatedMedia.getDescription());
        existingMedia.setUpdatedDate(LocalDate.now());
        
        if (updatedMedia.getType() != null) {
            existingMedia.setType(updatedMedia.getType());
        }
        if (updatedMedia.getCategory() != null) {
            existingMedia.setCategory(updatedMedia.getCategory());
        }

        return mediaRepository.save(existingMedia);
    }

    @Transactional
    public void deleteMedia(Long id) {
        log.debug("Soft deleting media with id: {}", id);
        
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + id));
        
        media.setStatus(0); // Inactive status
        media.setUpdatedDate(LocalDate.now());
        mediaRepository.save(media);
    }

    @Transactional
    public void hardDeleteMedia(Long id) {
        log.debug("Hard deleting media with id: {}", id);
        
        // First get the media to delete the actual file
        Optional<Media> mediaOpt = mediaRepository.findById(id);
        if (mediaOpt.isPresent()) {
            Media media = mediaOpt.get();
            // Delete the actual file from storage
            deleteFileFromStorage(media.getUrl());
        }
        
        mediaRepository.deleteById(id);
    }

    // Read Operations

    public Optional<Media> getMediaById(Long id) {
        log.debug("Finding media by id: {}", id);
        return mediaRepository.findById(id);
    }

    public Page<Media> getAllActiveMedia(Pageable pageable) {
        log.debug("Finding all active media with pagination");
        return mediaRepository.findActiveMedia(pageable);
    }

    public Page<Media> searchMediaByTitle(String title, Pageable pageable) {
        log.debug("Searching media by title: {}", title);
        return mediaRepository.findActiveByTitleContaining(title, pageable);
    }

    // Type and Category-based searches

    public Page<Media> getMediaByType(Long typeId, Pageable pageable) {
        log.debug("Finding media by type id: {}", typeId);
        return mediaRepository.findActiveByTypeId(typeId, pageable);
    }

    public Page<Media> getMediaByTypeName(String typeName, Pageable pageable) {
        log.debug("Finding media by type name: {}", typeName);
        return mediaRepository.findActiveByTypeName(typeName, pageable);
    }

    public Page<Media> getMediaByCategory(Long categoryId, Pageable pageable) {
        log.debug("Finding media by category id: {}", categoryId);
        return mediaRepository.findActiveByCategoryId(categoryId, pageable);
    }

    // Reference-based searches (polymorphic)

    public List<Media> getMediaByReference(Long referenceId, String referenceType) {
        log.debug("Finding media for {} with id: {}", referenceType, referenceId);
        return mediaRepository.findActiveByReference(referenceId, referenceType);
    }

    public List<Media> getMediaForLocation(Long locationId) {
        return getMediaByReference(locationId, REFERENCE_TYPE_LOCATION);
    }

    public List<Media> getMediaForAccommodation(Long accommodationId) {
        return getMediaByReference(accommodationId, REFERENCE_TYPE_ACCOMMODATION);
    }

    public List<Media> getMediaForFood(Long foodId) {
        return getMediaByReference(foodId, REFERENCE_TYPE_FOOD);
    }

    public List<Media> getMediaForArticle(Long articleId) {
        return getMediaByReference(articleId, REFERENCE_TYPE_ARTICLE);
    }

    public List<Media> getMediaForEvent(Long eventId) {
        return getMediaByReference(eventId, REFERENCE_TYPE_EVENT);
    }

    public List<Media> getMediaForOrganizer(Long organizerId) {
        return getMediaByReference(organizerId, REFERENCE_TYPE_ORGANIZER);
    }

    public List<Media> getMediaForCommunityPost(Long communityPostId) {
        return getMediaByReference(communityPostId, REFERENCE_TYPE_COMMUNITY_POST);
    }

    // Utility Methods

    @Transactional
    public Media activateMedia(Long id) {
        log.debug("Activating media with id: {}", id);
        
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + id));
        
        media.setStatus(1);
        media.setUpdatedDate(LocalDate.now());
        return mediaRepository.save(media);
    }

    @Transactional
    public Media deactivateMedia(Long id) {
        log.debug("Deactivating media with id: {}", id);
        
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + id));
        
        media.setStatus(0);
        media.setUpdatedDate(LocalDate.now());
        return mediaRepository.save(media);
    }

    @Transactional
    public Media assignType(Long mediaId, Long typeId) {
        log.debug("Assigning type {} to media {}", typeId, mediaId);
        
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + mediaId));
        
        MediaType mediaType = mediaTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Media type not found with id: " + typeId));
        
        media.setType(mediaType);
        media.setUpdatedDate(LocalDate.now());
        return mediaRepository.save(media);
    }

    @Transactional
    public Media assignCategory(Long mediaId, Long categoryId) {
        log.debug("Assigning category {} to media {}", categoryId, mediaId);
        
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found with id: " + mediaId));
        
        MediaCategory mediaCategory = mediaCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Media category not found with id: " + categoryId));
        
        media.setCategory(mediaCategory);
        media.setUpdatedDate(LocalDate.now());
        return mediaRepository.save(media);
    }

    // Bulk operations

    @Transactional
    public void deleteAllMediaForReference(Long referenceId, String referenceType) {
        log.debug("Deleting all media for {} with id: {}", referenceType, referenceId);
        
        List<Media> mediaList = mediaRepository.findActiveByReference(referenceId, referenceType);
        for (Media media : mediaList) {
            media.setStatus(0);
            media.setUpdatedDate(LocalDate.now());
        }
        mediaRepository.saveAll(mediaList);
    }

    // File storage operations (placeholder implementations)
    // These should be implemented based on your storage solution (MinIO, AWS S3, etc.)
    
    private String uploadFileToStorage(MultipartFile file) {
        // TODO: Implement actual file upload logic
        // This is a placeholder implementation
        log.debug("Uploading file: {} (size: {} bytes)", file.getOriginalFilename(), file.getSize());
        
        // Generate a unique filename and upload to storage
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String fileUrl = "/uploads/" + filename; // Placeholder URL
        
        // Here you would upload to your storage service
        // Examples:
        // - MinIO: minioClient.putObject(bucketName, filename, file.getInputStream(), file.getSize())
        // - AWS S3: s3Client.putObject(bucketName, filename, file.getInputStream())
        
        return fileUrl;
    }
    
    private void deleteFileFromStorage(String fileUrl) {
        // TODO: Implement actual file deletion logic
        log.debug("Deleting file from storage: {}", fileUrl);
        
        // Here you would delete from your storage service
        // Examples:
        // - MinIO: minioClient.removeObject(bucketName, filename)
        // - AWS S3: s3Client.deleteObject(bucketName, filename)
    }

    // Statistics

    public long getActiveMediaCount() {
        log.debug("Getting count of active media");
        return mediaRepository.findActiveMedia(Pageable.unpaged()).getTotalElements();
    }

    public long getMediaCountByType(Long typeId) {
        log.debug("Getting count of media by type: {}", typeId);
        return mediaRepository.findActiveByTypeId(typeId, Pageable.unpaged()).getTotalElements();
    }

    public long getMediaCountByCategory(Long categoryId) {
        log.debug("Getting count of media by category: {}", categoryId);
        return mediaRepository.findActiveByCategoryId(categoryId, Pageable.unpaged()).getTotalElements();
    }

    public long getMediaCountForReference(Long referenceId, String referenceType) {
        log.debug("Getting count of media for {} with id: {}", referenceType, referenceId);
        return mediaRepository.findActiveByReference(referenceId, referenceType).size();
    }
}
