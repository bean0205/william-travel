package com.williamtravel.app.service;

import com.williamtravel.app.entity.ArticleCategory;
import com.williamtravel.app.repository.ArticleCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for ArticleCategory entity operations
 */
@Service
@Transactional
public class ArticleCategoryService {

    @Autowired
    private ArticleCategoryRepository articleCategoryRepository;

    /**
     * Find all article categories
     */
    public List<ArticleCategory> findAll() {
        return articleCategoryRepository.findAll();
    }

    /**
     * Find article category by ID
     */
    public Optional<ArticleCategory> findById(Integer id) {
        return articleCategoryRepository.findById(id);
    }

    /**
     * Save article category
     */
    public ArticleCategory save(ArticleCategory articleCategory) {
        return articleCategoryRepository.save(articleCategory);
    }

    /**
     * Delete article category by ID
     */
    public void deleteById(Integer id) {
        articleCategoryRepository.deleteById(id);
    }

    /**
     * Find article category by name
     */
    public Optional<ArticleCategory> findByName(String name) {
        return articleCategoryRepository.findByName(name);
    }

    /**
     * Find article category by slug
     */
    public Optional<ArticleCategory> findBySlug(String slug) {
        return articleCategoryRepository.findBySlug(slug);
    }

    /**
     * Check if article category exists by name
     */
    public boolean existsByName(String name) {
        return articleCategoryRepository.existsByName(name);
    }

    /**
     * Check if article category exists by slug
     */
    public boolean existsBySlug(String slug) {
        return articleCategoryRepository.existsBySlug(slug);
    }

    /**
     * Find article categories by status
     */
    public List<ArticleCategory> findByStatus(Boolean status) {
        return articleCategoryRepository.findByStatus(status);
    }

    /**
     * Count total article categories
     */
    public long count() {
        return articleCategoryRepository.count();
    }

    /**
     * Check if article category exists by ID
     */
    public boolean existsById(Integer id) {
        return articleCategoryRepository.existsById(id);
    }

    /**
     * Find all article categories with pagination
     */
    public Page<ArticleCategory> findAll(Pageable pageable) {
        return articleCategoryRepository.findAll(pageable);
    }

    /**
     * Find article categories by status with pagination
     */
    public Page<ArticleCategory> findByStatus(Boolean status, Pageable pageable) {
        return articleCategoryRepository.findByStatus(status, pageable);
    }

    /**
     * Find all active categories ordered by name
     */
    public List<ArticleCategory> findAllActiveOrderByName() {
        return articleCategoryRepository.findAllActiveOrderByName();
    }

    /**
     * Search categories by keyword
     */
    public List<ArticleCategory> searchByKeyword(String keyword) {
        return articleCategoryRepository.searchByKeyword(keyword);
    }

    /**
     * Search categories by keyword with pagination
     */
    public Page<ArticleCategory> searchByKeyword(String keyword, Pageable pageable) {
        return articleCategoryRepository.searchByKeyword(keyword, pageable);
    }

    /**
     * Find categories with article count
     */
    public List<Object[]> findCategoriesWithArticleCount() {
        return articleCategoryRepository.findCategoriesWithArticleCount();
    }

    /**
     * Find categories ordered by article count
     */
    public List<ArticleCategory> findCategoriesOrderByArticleCount() {
        return articleCategoryRepository.findCategoriesOrderByArticleCount();
    }

    /**
     * Find categories ordered by article count with pagination
     */
    public Page<ArticleCategory> findCategoriesOrderByArticleCount(Pageable pageable) {
        return articleCategoryRepository.findCategoriesOrderByArticleCount(pageable);
    }

    /**
     * Find categories with published articles
     */
    public List<ArticleCategory> findCategoriesWithPublishedArticles() {
        return articleCategoryRepository.findCategoriesWithPublishedArticles();
    }

    /**
     * Find root categories
     */
    public List<ArticleCategory> findRootCategories() {
        return articleCategoryRepository.findRootCategories();
    }

    /**
     * Find categories by parent category ID
     */
    public List<ArticleCategory> findByParentCategoryId(Integer parentId) {
        return articleCategoryRepository.findByParentCategoryId(parentId);
    }

    /**
     * Find root categories with pagination
     */
    public Page<ArticleCategory> findRootCategories(Pageable pageable) {
        return articleCategoryRepository.findRootCategories(pageable);
    }

    /**
     * Count active categories
     */
    public Long countActiveCategories() {
        return articleCategoryRepository.countActiveCategories();
    }

    /**
     * Count published articles in category
     */
    public Long countPublishedArticlesInCategory(Integer categoryId) {
        return articleCategoryRepository.countPublishedArticlesInCategory(categoryId);
    }

    /**
     * Find recent categories
     */
    public List<ArticleCategory> findRecentCategories(Pageable pageable) {
        return articleCategoryRepository.findRecentCategories(pageable);
    }

    /**
     * Find popular categories
     */
    public List<ArticleCategory> findPopularCategories(Pageable pageable) {
        return articleCategoryRepository.findPopularCategories(pageable);
    }

    /**
     * Find featured categories
     */
    public List<ArticleCategory> findFeaturedCategories() {
        return articleCategoryRepository.findFeaturedCategories();
    }

    /**
     * Find all categories ordered by sort order
     */
    public List<ArticleCategory> findAllOrderBySortOrder() {
        return articleCategoryRepository.findAllOrderBySortOrder();
    }
}
