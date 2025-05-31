package com.williamtravel.app.service;

import com.williamtravel.app.entity.ArticleArticleTag;
import com.williamtravel.app.repository.ArticleArticleTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for ArticleArticleTag entity operations
 */
@Service
@Transactional
public class ArticleArticleTagService {

    @Autowired
    private ArticleArticleTagRepository articleArticleTagRepository;

    /**
     * Find all article-tag relationships
     */
    public List<ArticleArticleTag> findAll() {
        return articleArticleTagRepository.findAll();
    }

    /**
     * Find article-tag relationship by ID
     */
    public Optional<ArticleArticleTag> findById(Integer id) {
        return articleArticleTagRepository.findById(id);
    }

    /**
     * Save article-tag relationship
     */
    public ArticleArticleTag save(ArticleArticleTag articleArticleTag) {
        return articleArticleTagRepository.save(articleArticleTag);
    }

    /**
     * Delete article-tag relationship by ID
     */
    public void deleteById(Integer id) {
        articleArticleTagRepository.deleteById(id);
    }

    /**
     * Find relationships by article ID
     */
    public List<ArticleArticleTag> findByArticleId(Integer articleId) {
        return articleArticleTagRepository.findByArticleId(articleId);
    }

    /**
     * Find relationships by tag ID
     */
    public List<ArticleArticleTag> findByTagId(Integer tagId) {
        return articleArticleTagRepository.findByTagId(tagId);
    }

    /**
     * Find specific relationship by article ID and tag ID
     */
    public ArticleArticleTag findByArticleIdAndTagId(Integer articleId, Integer tagId) {
        return articleArticleTagRepository.findByArticleIdAndTagId(articleId, tagId);
    }

    /**
     * Check if relationship exists between article and tag
     */
    public boolean existsByArticleIdAndTagId(Integer articleId, Integer tagId) {
        return articleArticleTagRepository.existsByArticleIdAndTagId(articleId, tagId);
    }

    /**
     * Delete all relationships for an article
     */
    public void deleteByArticleId(Integer articleId) {
        articleArticleTagRepository.deleteByArticleId(articleId);
    }

    /**
     * Delete all relationships for a tag
     */
    public void deleteByTagId(Integer tagId) {
        articleArticleTagRepository.deleteByTagId(tagId);
    }

    /**
     * Delete specific relationship by article ID and tag ID
     */
    public void deleteByArticleIdAndTagId(Integer articleId, Integer tagId) {
        articleArticleTagRepository.deleteByArticleIdAndTagId(articleId, tagId);
    }

    /**
     * Count articles with specific tag
     */
    public Long countArticlesWithTag(Integer tagId) {
        return articleArticleTagRepository.countArticlesWithTag(tagId);
    }

    /**
     * Count tags for specific article
     */
    public Long countTagsForArticle(Integer articleId) {
        return articleArticleTagRepository.countTagsForArticle(articleId);
    }

    /**
     * Find articles that have all specified tags
     */
    public List<Integer> findArticleIdsWithAllTags(List<Integer> tagIds, Long tagCount) {
        return articleArticleTagRepository.findArticleIdsWithAllTags(tagIds, tagCount);
    }

    /**
     * Find tag usage statistics
     */
    public List<Object[]> findTagUsageStatistics() {
        return articleArticleTagRepository.findTagUsageStatistics();
    }

    /**
     * Count total relationships
     */
    public long count() {
        return articleArticleTagRepository.count();
    }

    /**
     * Check if relationship exists by ID
     */
    public boolean existsById(Integer id) {
        return articleArticleTagRepository.existsById(id);
    }
}
