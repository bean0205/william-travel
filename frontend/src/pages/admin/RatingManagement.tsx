import React, { useState, useEffect, useCallback } from 'react';
import {
  getRatings,
  updateRatingStatus,
  deleteRating, 
  respondToReview,
  RatingWithUser
} from '@/services/api/ratingService';
import Pagination from '@/components/admin/Pagination';
import SortableColumn, { SortDirection } from '@/components/admin/SortableColumn';

const RatingManagement: React.FC = () => {
  const [ratings, setRatings] = useState<RatingWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filtering state
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'flagged'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<{start?: string, end?: string}>({});

  // Response modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentReview, setCurrentReview] = useState<RatingWithUser | null>(null);
  const [responseText, setResponseText] = useState('');

  // Statistics state
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    publishedReviews: 0,
    pendingReviews: 0,
    flaggedReviews: 0,
    averageRating: 0,
    mostReviewedLocation: '',
  });

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: filter !== 'all' ? filter : undefined,
        search: searchTerm || undefined,
        sort_by: sortField || undefined,
        sort_order: sortDirection || undefined,
        rating: ratingFilter,
        location: locationFilter || undefined,
        user_id: userFilter || undefined,
        start_date: dateFilter.start || undefined,
        end_date: dateFilter.end || undefined,
      };

      const response = await getRatings(params);
      setRatings(response.items || []);
      setTotalPages(response.pages || 1);

      // Get all ratings for statistics
      const allReviewsData = await getRatings({ limit: 1000 });
      const allItems = allReviewsData.items || [];

      // Calculate statistics
      const stats = {
        totalReviews: allItems.length,
        publishedReviews: allItems.filter((review) => review.status === 'published').length,
        pendingReviews: allItems.filter((review) => review.status === 'pending').length,
        flaggedReviews: allItems.filter((review) => review.status === 'flagged').length,
        averageRating: calculateAverageRating(allItems),
        mostReviewedLocation: getMostReviewedLocation(allItems),
      };
      setReviewStats(stats);

      setError(null);
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
      setError('Could not load ratings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortField, sortDirection, filter, searchTerm, ratingFilter, locationFilter, userFilter, dateFilter]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounce = setTimeout(() => {
        setCurrentPage(1);
        fetchRatings();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, fetchRatings]);

  // Calculate the average rating
  const calculateAverageRating = (reviews: RatingWithUser[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((totalRating / reviews.length).toFixed(1));
  };

  // Get most reviewed location
  const getMostReviewedLocation = (reviews: RatingWithUser[]): string => {
    if (reviews.length === 0) return '';

    const locationCount: Record<string, number> = {};
    reviews.forEach((review) => {
      const locationName = 
        review.reference_type === 'location' ? `Location: ${review.reference_id}` :
        review.reference_type === 'accommodation' ? `Accommodation: ${review.reference_id}` :
        review.reference_type === 'food' ? `Food: ${review.reference_id}` :
        `Event: ${review.reference_id}`;

      locationCount[locationName] = (locationCount[locationName] || 0) + 1;
    });

    let maxCount = 0;
    let mostReviewedLocation = '';

    Object.entries(locationCount).forEach(([location, count]) => {
      if (count > maxCount) {
        mostReviewedLocation = location;
        maxCount = count;
      }
    });

    return mostReviewedLocation;
  };

  const handleSort = (field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction || 'asc');
  };

  const handleFilter = (filter: 'all' | 'published' | 'pending' | 'flagged') => {
    setFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRatingFilter = (rating: number | undefined) => {
    setRatingFilter(rating);
    setCurrentPage(1);
  };

  const applyAdvancedFilters = () => {
    setCurrentPage(1);
    fetchRatings();
  };

  const clearAdvancedFilters = () => {
    setLocationFilter('');
    setUserFilter('');
    setDateFilter({});
    setRatingFilter(undefined);
    setCurrentPage(1);
    fetchRatings();
  };

  const handleStatusChange = async (id: number, status: 'published' | 'pending' | 'flagged') => {
    try {
      await updateRatingStatus(id, status);
      
      // Update the status in the local state
      setRatings(ratings.map(rating => 
        rating.id === id ? { ...rating, status } : rating
      ));
      
      setSuccess(`Rating status updated to ${status}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update rating status:', err);
      setError('Could not update rating status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }
    
    try {
      await deleteRating(id);
      
      // Remove the deleted rating from the list
      setRatings(ratings.filter(rating => rating.id !== id));
      
      setSuccess('Rating deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to delete rating:', err);
      setError('Could not delete rating');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRespond = (review: RatingWithUser) => {
    setCurrentReview(review);
    setResponseText(''); // Clear previous response
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!currentReview || !responseText.trim()) return;
    
    try {
      await respondToReview(currentReview.id, responseText);
      setSuccess('Response submitted successfully');
      setShowResponseModal(false);
      
      // Refresh ratings list
      fetchRatings();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to submit response:', err);
      setError('Could not submit response');
      setTimeout(() => setError(null), 3000);
    }
  };

  const renderReviewType = (review: RatingWithUser) => {
    switch (review.reference_type) {
      case 'location': 
        return 'Location';
      case 'accommodation': 
        return 'Accommodation';
      case 'food': 
        return 'Food';
      case 'event': 
        return 'Event';
      default: 
        return review.reference_type;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ratings & Reviews Management</h1>

      {/* Statistics */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-gray-700">Total Reviews</h3>
          <p className="text-3xl font-bold">{reviewStats.totalReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-green-700">Published</h3>
          <p className="text-3xl font-bold text-green-600">{reviewStats.publishedReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-yellow-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{reviewStats.pendingReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-red-700">Flagged</h3>
          <p className="text-3xl font-bold text-red-600">{reviewStats.flaggedReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-blue-700">Avg Rating</h3>
          <p className="text-3xl font-bold text-blue-600">
            {reviewStats.averageRating}
            <span className="text-xl text-yellow-500 ml-1">★</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-purple-700">Top Reference</h3>
          <p className="text-base font-bold text-purple-600 truncate" title={reviewStats.mostReviewedLocation}>
            {reviewStats.mostReviewedLocation || 'N/A'}
          </p>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => handleFilter('published')}
            className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Published
          </button>
          <button
            onClick={() => handleFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => handleFilter('flagged')}
            className={`px-4 py-2 rounded ${filter === 'flagged' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Flagged
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search ratings..."
              className="px-3 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex space-x-2">
                {[undefined, 5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating === undefined ? 'all' : rating}
                    onClick={() => handleRatingFilter(rating)}
                    className={`px-3 py-1 rounded ${
                      ratingFilter === rating ? 'bg-yellow-500 text-white' : 'bg-white border'
                    }`}
                  >
                    {rating === undefined ? 'All' : `${rating}★`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Filter by location"
                className="w-full px-3 py-2 border rounded"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <input
                type="text"
                placeholder="Filter by user"
                className="w-full px-3 py-2 border rounded"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={dateFilter.start || ''}
                  onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={dateFilter.end || ''}
                  onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button onClick={clearAdvancedFilters} className="px-4 py-2 border rounded">
              Clear Filters
            </button>
            <button onClick={applyAdvancedFilters} className="px-4 py-2 bg-blue-600 text-white rounded">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Error and Success messages */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p>{success}</p>
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="User"
                  field="user"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Rating"
                  field="rating"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Type"
                  field="reference_type"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Date"
                  field="created_at"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : ratings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No reviews found.
                </td>
              </tr>
            ) : (
              ratings.map((review) => {
                const userName =
                  typeof review.user === 'string' ? review.user : review.user?.full_name || 'Anonymous';

                return (
                  <tr key={review.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="text-yellow-500 mr-1">{review.rating}</span>
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {renderReviewType(review)}
                      <span className="text-xs text-gray-400 ml-1">#{review.reference_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${review.status === 'published' ? 'bg-green-100 text-green-800' : 
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {review.status ? review.status.charAt(0).toUpperCase() + review.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleRespond(review)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Respond to review"
                        >
                          Reply
                        </button>

                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900">Status ▾</button>
                          <div className="absolute right-0 mt-2 w-36 bg-white rounded shadow-lg z-10 hidden group-hover:block">
                            <button
                              onClick={() => handleStatusChange(review.id, 'published')}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Publish
                            </button>
                            <button
                              onClick={() => handleStatusChange(review.id, 'pending')}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Mark Pending
                            </button>
                            <button
                              onClick={() => handleStatusChange(review.id, 'flagged')}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              Flag
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete review"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Respond to Review</h2>
            <div className="mb-4">
              <p className="font-medium">
                Review by:{' '}
                {typeof currentReview?.user === 'string'
                  ? currentReview?.user
                  : currentReview?.user?.full_name || 'Anonymous'}
              </p>
              <div className="flex items-center my-2">
                <span className="text-yellow-500 mr-1">Rating: </span>
                <span>{'★'.repeat(currentReview?.rating || 0)}</span>
                <span className="text-gray-300">{'☆'.repeat(5 - (currentReview?.rating || 0))}</span>
              </div>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{currentReview?.comment}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Response</label>
              <textarea
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response here..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 border rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={submitResponse}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={!responseText.trim()}
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingManagement;
