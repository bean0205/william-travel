package com.williamtravel.app.service;

import com.williamtravel.app.entity.ArticleArticleCategory;
import com.williamtravel.app.repository.ArticleArticleCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for ArticleArticleCategory entity operations
 */
@Service
@Transactional
public class ArticleArticleCategoryService {

    @Autowired
    private ArticleArticleCategoryRepository articleArticleCategoryRepository;

    /**
     * Find all article-category relationships
     */
    public List<ArticleArticleCategory> findAll() {
        return articleArticleCategoryRepository.findAll();
    }

    /**
     * Find article-category relationship by ID
     */
    public Optional<ArticleArticleCategory> findById(Integer id) {
        return articleArticleCategoryRepository.findById(id);
    }

    /**
     * Save article-category relationship
     */
    public ArticleArticleCategory save(ArticleArticleCategory articleArticleCategory) {
        return articleArticleCategoryRepository.save(articleArticleCategory);
    }

    /**
     * Delete article-category relationship by ID
     */
    public void deleteById(Integer id) {
        articleArticleCategoryRepository.deleteById(id);
    }

    /**
     * Find relationships by article ID
     */
    public List<ArticleArticleCategory> findByArticleId(Integer articleId) {
        return articleArticleCategoryRepository.findByArticleId(articleId);
    }

    /**
     * Find relationships by category ID
     */
    public List<ArticleArticleCategory> findByCategoryId(Integer categoryId) {
        return articleArticleCategoryRepository.findByCategoryId(categoryId);
    }

    /**
     * Find specific relationship by article ID and category ID
     */
    public ArticleArticleCategory findByArticleIdAndCategoryId(Integer articleId, Integer categoryId) {
        return articleArticleCategoryRepository.findByArticleIdAndCategoryId(articleId, categoryId);
    }

    /**
     * Count total relationships
     */
    public long count() {
        return articleArticleCategoryRepository.count();
    }

    /**
     * Check if relationship exists by ID
     */
    public boolean existsById(Integer id) {
        return articleArticleCategoryRepository.existsById(id);
    }

    /**
     * Check if relationship exists by article ID and category ID
     */
    public boolean existsByArticleIdAndCategoryId(Integer articleId, Integer categoryId) {
        return articleArticleCategoryRepository.existsByArticleIdAndCategoryId(articleId, categoryId);
    }

    /**
     * Delete relationships by article ID
     */
    public void deleteByArticleId(Integer articleId) {
        articleArticleCategoryRepository.deleteByArticleId(articleId);
    }

    /**
     * Delete relationships by category ID
     */
    public void deleteByCategoryId(Integer categoryId) {
        articleArticleCategoryRepository.deleteByCategoryId(categoryId);
    }

    /**
     * Delete specific relationship by article ID and category ID
     */
    public void deleteByArticleIdAndCategoryId(Integer articleId, Integer categoryId) {
        articleArticleCategoryRepository.deleteByArticleIdAndCategoryId(articleId, categoryId);
    }

    /**
     * Count articles in category
     */
    public Long countArticlesInCategory(Integer categoryId) {
        return articleArticleCategoryRepository.countArticlesInCategory(categoryId);
    }

    /**
     * Count categories for article
     */
    public Long countCategoriesForArticle(Integer articleId) {
        return articleArticleCategoryRepository.countCategoriesForArticle(articleId);
    }

    /**
     * Find article IDs with all specified categories
     */
    public List<Integer> findArticleIdsWithAllCategories(List<Integer> categoryIds, Long categoryCount) {
        return articleArticleCategoryRepository.findArticleIdsWithAllCategories(categoryIds, categoryCount);
    }
}
