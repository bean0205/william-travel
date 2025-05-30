package com.william.travel.repository;

import com.william.travel.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    
    @Query("SELECT a FROM Article a WHERE a.isActive = true AND a.isPublished = true ORDER BY a.publishedAt DESC")
    Page<Article> findPublishedArticles(Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.author.id = :authorId AND a.isActive = true ORDER BY a.createdAt DESC")
    Page<Article> findByAuthorId(@Param("authorId") Long authorId, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.author.id = :authorId AND a.isActive = true AND a.isPublished = true ORDER BY a.publishedAt DESC")
    Page<Article> findPublishedByAuthorId(@Param("authorId") Long authorId, Pageable pageable);
    
    @Query("SELECT a FROM Article a JOIN a.articleCategories ac WHERE ac.category.id = :categoryId AND a.isActive = true AND a.isPublished = true ORDER BY a.publishedAt DESC")
    Page<Article> findPublishedByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT a FROM Article a JOIN a.articleTags at WHERE at.tag.id = :tagId AND a.isActive = true AND a.isPublished = true ORDER BY a.publishedAt DESC")
    Page<Article> findPublishedByTagId(@Param("tagId") Long tagId, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "a.isActive = true AND a.isPublished = true ORDER BY a.publishedAt DESC")
    Page<Article> findPublishedBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT a FROM Article a WHERE a.slug = :slug AND a.isActive = true")
    Article findBySlug(@Param("slug") String slug);
    
    @Query("SELECT a FROM Article a WHERE a.isActive = true AND a.isFeatured = true AND a.isPublished = true ORDER BY a.publishedAt DESC")
    List<Article> findFeaturedArticles();
    
    @Query("SELECT a FROM Article a WHERE a.isActive = true AND a.isPublished = true ORDER BY a.viewCount DESC")
    Page<Article> findMostViewedArticles(Pageable pageable);
    
    @Query("SELECT COUNT(a) FROM Article a WHERE a.author.id = :authorId AND a.isActive = true AND a.isPublished = true")
    Long countPublishedByAuthorId(@Param("authorId") Long authorId);
}
