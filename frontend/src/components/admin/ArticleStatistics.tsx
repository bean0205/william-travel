import React from 'react';

interface ArticleStatisticsProps {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;
  totalViews: number;
  mostViewedArticle?: string;
  loading: boolean;
}

const ArticleStatistics: React.FC<ArticleStatisticsProps> = ({
  totalArticles,
  publishedArticles,
  draftArticles,
  archivedArticles,
  totalViews,
  mostViewedArticle,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Article Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-500 font-medium">Total Articles</p>
          <p className="text-2xl font-bold">{totalArticles}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-green-500 font-medium">Published</p>
          <p className="text-2xl font-bold">{publishedArticles}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((publishedArticles / totalArticles) * 100) || 0}% of total
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <p className="text-sm text-yellow-500 font-medium">Draft</p>
          <p className="text-2xl font-bold">{draftArticles}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((draftArticles / totalArticles) * 100) || 0}% of total
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Archived</p>
          <p className="text-2xl font-bold">{archivedArticles}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((archivedArticles / totalArticles) * 100) || 0}% of total
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-500 font-medium">Total Views</p>
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">
            {mostViewedArticle && `Most viewed: ${mostViewedArticle.length > 20 ? mostViewedArticle.substring(0, 20) + '...' : mostViewedArticle}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleStatistics;
