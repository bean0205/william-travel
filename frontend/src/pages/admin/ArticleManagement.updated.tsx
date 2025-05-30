import React, { useState, useEffect } from 'react';
import { getArticles, deleteArticle, createArticle, updateArticle, Article } from '@/services/api/articleService';
import Pagination from '@/components/admin/Pagination';
import SortableColumn, { SortDirection } from '@/components/admin/SortableColumn';
import ArticleStatistics from '@/components/admin/ArticleStatistics';
import ArticleForm from '@/components/admin/ArticleForm';

const ArticleManagement: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Modal state for article form
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article> | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Article statistics
  const [articleStats, setArticleStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    archivedArticles: 0,
    totalViews: 0,
    mostViewedArticle: '',
  });

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const filters = filter !== 'all' ? { status: filter } : {};
      const data = await getArticles(filters);
      setAllArticles(data);

      // Calculate statistics
      const stats = {
        totalArticles: data.length,
        publishedArticles: data.filter(article => article.status === 'published').length,
        draftArticles: data.filter(article => article.status === 'draft').length,
        archivedArticles: data.filter(article => article.status === 'archived').length,
        totalViews: data.reduce((sum, article) => sum + (article.views || 0), 0),
        mostViewedArticle: getMostViewedArticle(data),
      };
      setArticleStats(stats);

      // Apply sorting if needed
      let sortedData = [...data];
      if (sortField && sortDirection) {
        sortedData = sortData(sortedData, sortField, sortDirection);
      }

      // Update total pages
      setTotalPages(Math.max(1, Math.ceil(sortedData.length / itemsPerPage)));

      // Set current page data
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
      setArticles(paginatedData);

      setError(null);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError('Could not load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get most viewed article
  const getMostViewedArticle = (articles: Article[]): string => {
    if (articles.length === 0) return '';

    let mostViewed = articles[0];
    articles.forEach(article => {
      if ((article.views || 0) > (mostViewed.views || 0)) {
        mostViewed = article;
      }
    });

    return mostViewed.title || '';
  };

  const handleDeleteArticle = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);

        // Update articles state and refetch to update statistics
        fetchArticles();
      } catch (err) {
        console.error('Failed to delete article:', err);
        setError('Could not delete article. Please try again later.');
      }
    }
  };
  
  const handleSort = (field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);

    if (direction === null) {
      // Reset to original order
      fetchArticles();
      return;
    }

    const sortedArticles = sortData([...allArticles], field, direction);

    // Update total pages
    setTotalPages(Math.max(1, Math.ceil(sortedArticles.length / itemsPerPage)));

    // Reset to first page when sorting
    setCurrentPage(1);

    // Set current page data
    const startIndex = 0;  // First page
    const paginatedData = sortedArticles.slice(startIndex, startIndex + itemsPerPage);
    setArticles(paginatedData);
  };

  const sortData = (data: Article[], field: string, direction: SortDirection): Article[] => {
    if (!direction) return data;

    return [...data].sort((a, b) => {
      let valueA = a[field as keyof Article];
      let valueB = b[field as keyof Article];

      // Handle dates
      if (field === 'createdAt' || field === 'updatedAt') {
        valueA = new Date(valueA as string).getTime();
        valueB = new Date(valueB as string).getTime();
      }

      // Compare based on direction
      if (direction === 'asc') {
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB);
        }
        return (valueA as number) - (valueB as number);
      } else {
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueB.localeCompare(valueA);
        }
        return (valueB as number) - (valueA as number);
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Apply current filters and sorting
    let filteredData = [...allArticles];
    if (sortField && sortDirection) {
      filteredData = sortData(filteredData, sortField, sortDirection);
    }

    // Get data for the selected page
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    setArticles(paginatedData);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);  // Reset to first page when searching

    // Filter all articles based on search term
    const searchValue = e.target.value.toLowerCase();
    const filteredArticles = allArticles.filter(article =>
      (article.title || '').toLowerCase().includes(searchValue) ||
      (article.author || '').toLowerCase().includes(searchValue)
    );

    // Apply current sorting if any
    let sortedArticles = [...filteredArticles];
    if (sortField && sortDirection) {
      sortedArticles = sortData(sortedArticles, sortField, sortDirection);
    }

    // Update pagination
    setTotalPages(Math.max(1, Math.ceil(sortedArticles.length / itemsPerPage)));

    // Show first page results
    const paginatedData = sortedArticles.slice(0, itemsPerPage);
    setArticles(paginatedData);
  };

  const openCreateArticleModal = () => {
    setCurrentArticle(null);
    setShowArticleModal(true);
  };

  const openEditArticleModal = (article: Article) => {
    setCurrentArticle(article);
    setShowArticleModal(true);
  };

  const closeArticleModal = () => {
    setShowArticleModal(false);
    setCurrentArticle(null);
  };

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    setFormLoading(true);
    try {
      if (currentArticle?.id) {
        // Update existing article
        await updateArticle(currentArticle.id, articleData);
      } else {
        // Create new article
        await createArticle(articleData);
      }

      // Close modal and refresh data
      closeArticleModal();
      fetchArticles();
    } catch (err) {
      console.error('Failed to save article:', err);
      setError('Could not save article. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Article Management</h1>
      
      {/* Article Statistics Dashboard */}
      <ArticleStatistics
        totalArticles={articleStats.totalArticles}
        publishedArticles={articleStats.publishedArticles}
        draftArticles={articleStats.draftArticles}
        archivedArticles={articleStats.archivedArticles}
        totalViews={articleStats.totalViews}
        mostViewedArticle={articleStats.mostViewedArticle}
        loading={loading}
      />

      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            All Articles
          </button>
          <button 
            onClick={() => setFilter('published')} 
            className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Published
          </button>
          <button 
            onClick={() => setFilter('draft')} 
            className={`px-4 py-2 rounded ${filter === 'draft' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Drafts
          </button>
          <button 
            onClick={() => setFilter('archived')} 
            className={`px-4 py-2 rounded ${filter === 'archived' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Archived
          </button>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search articles..."
            className="px-3 py-2 border rounded"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button 
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={openCreateArticleModal}
          >
            Create Article
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {articles.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No articles found. Try changing your filters or creating a new article.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableColumn
                      label="Title"
                      field="title"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Status"
                      field="status"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Author"
                      field="author"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Views"
                      field="views"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Created"
                      field="createdAt"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{article.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${article.status === 'published' ? 'bg-green-100 text-green-800' : 
                            article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{article.author || 'No author'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{article.views || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(article.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={() => openEditArticleModal(article)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => window.open(`/articles/${article.id}`, '_blank')}
                        >
                          View
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Article form modal */}
      {showArticleModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentArticle?.id ? 'Edit Article' : 'Create New Article'}
                </h3>
              </div>

              <div className="p-4">
                <ArticleForm
                  article={currentArticle || {}}
                  onSubmit={handleSaveArticle}
                  onCancel={closeArticleModal}
                  loading={formLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;
