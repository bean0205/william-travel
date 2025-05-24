import React, { useState, useEffect } from 'react';
import { getReviews, updateReviewStatus, deleteReview, respondToReview, Review } from '@/services/api/reviewService';
import Pagination from '@/components/admin/Pagination';
import SortableColumn, { SortDirection } from '@/components/admin/SortableColumn';
import ReviewStatistics from '@/components/admin/ReviewStatistics';

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]); // For statistics
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'flagged'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Response modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [respondLoading, setRespondLoading] = useState(false);

  // Review statistics
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    publishedReviews: 0,
    pendingReviews: 0,
    flaggedReviews: 0,
    averageRating: 0,
    mostReviewedLocation: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const filters = filter !== 'all' ? { status: filter } : {};
      const data = await getReviews(filters);
      setAllReviews(data);

      // Calculate statistics
      const stats = {
        totalReviews: data.length,
        publishedReviews: data.filter(review => review.status === 'published').length,
        pendingReviews: data.filter(review => review.status === 'pending').length,
        flaggedReviews: data.filter(review => review.status === 'flagged').length,
        averageRating: calculateAverageRating(data),
        mostReviewedLocation: getMostReviewedLocation(data),
      };
      setReviewStats(stats);

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
      setReviews(paginatedData);

      setError(null);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError('Could not load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate the average rating
  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Get most reviewed location
  const getMostReviewedLocation = (reviews: Review[]): string => {
    if (reviews.length === 0) return '';

    const locationCount: Record<string, number> = {};
    reviews.forEach(review => {
      locationCount[review.location] = (locationCount[review.location] || 0) + 1;
    });

    let mostReviewedLocation = '';
    let maxCount = 0;

    Object.entries(locationCount).forEach(([location, count]) => {
      if (count > maxCount) {
        mostReviewedLocation = location;
        maxCount = count;
      }
    });

    return mostReviewedLocation;
  };

  const handleStatusChange = async (id: number, newStatus: 'published' | 'pending' | 'flagged') => {
    try {
      await updateReviewStatus(id, newStatus);

      // Update local state
      setReviews(reviews.map(review =>
        review.id === id ? { ...review, status: newStatus } : review
      ));

      // Update all reviews for statistics
      setAllReviews(allReviews.map(review =>
        review.id === id ? { ...review, status: newStatus } : review
      ));

      // Recalculate statistics
      const updatedReviews = allReviews.map(review =>
        review.id === id ? { ...review, status: newStatus } : review
      );

      setReviewStats({
        totalReviews: updatedReviews.length,
        publishedReviews: updatedReviews.filter(review => review.status === 'published').length,
        pendingReviews: updatedReviews.filter(review => review.status === 'pending').length,
        flaggedReviews: updatedReviews.filter(review => review.status === 'flagged').length,
        averageRating: calculateAverageRating(updatedReviews),
        mostReviewedLocation: getMostReviewedLocation(updatedReviews),
      });

      setSuccess(`Review status updated to ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update review status:', err);
      setError('Could not update review status. Please try again later.');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);

        // Update local states and refetch for statistics
        fetchReviews();

        setSuccess('Review deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Failed to delete review:', err);
        setError('Could not delete review. Please try again later.');
      }
    }
  };

  const handleViewDetails = (review: Review) => {
    setCurrentReview(review);
    setResponseText(review.responseText || '');
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!currentReview) return;

    setRespondLoading(true);
    try {
      await respondToReview(currentReview.id, responseText);

      // Update reviews with new response
      const updatedReview = { ...currentReview, responseText, responseDate: new Date().toISOString() };

      setReviews(reviews.map(review =>
        review.id === currentReview.id ? updatedReview : review
      ));

      setAllReviews(allReviews.map(review =>
        review.id === currentReview.id ? updatedReview : review
      ));

      setShowResponseModal(false);
      setSuccess('Response submitted successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to submit response:', err);
      setError('Could not submit response. Please try again later.');
    } finally {
      setRespondLoading(false);
    }
  };

  const handleSort = (field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);

    if (direction === null) {
      // Reset to original order
      fetchReviews();
      return;
    }

    const sortedReviews = sortData([...allReviews], field, direction);

    // Update total pages
    setTotalPages(Math.max(1, Math.ceil(sortedReviews.length / itemsPerPage)));

    // Reset to first page when sorting
    setCurrentPage(1);

    // Set current page data
    const startIndex = 0;  // First page
    const paginatedData = sortedReviews.slice(startIndex, startIndex + itemsPerPage);
    setReviews(paginatedData);
  };

  const sortData = (data: Review[], field: string, direction: SortDirection): Review[] => {
    if (!direction) return data;

    return [...data].sort((a, b) => {
      let valueA = a[field as keyof Review];
      let valueB = b[field as keyof Review];

      // Handle dates
      if (field === 'date') {
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
    let filteredData = [...allReviews];
    if (sortField && sortDirection) {
      filteredData = sortData(filteredData, sortField, sortDirection);
    }

    // Get data for the selected page
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    setReviews(paginatedData);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);  // Reset to first page when searching

    // Filter all reviews based on search term
    const filteredReviews = allReviews.filter(review =>
      review.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      review.reviewer.toLowerCase().includes(e.target.value.toLowerCase()) ||
      review.location.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // Apply current sorting if any
    let sortedReviews = [...filteredReviews];
    if (sortField && sortDirection) {
      sortedReviews = sortData(sortedReviews, sortField, sortDirection);
    }

    // Update pagination
    setTotalPages(Math.max(1, Math.ceil(sortedReviews.length / itemsPerPage)));

    // Show first page results
    const paginatedData = sortedReviews.slice(0, itemsPerPage);
    setReviews(paginatedData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Review Management</h1>

      {/* Review Statistics Dashboard */}
      <ReviewStatistics
        totalReviews={reviewStats.totalReviews}
        publishedReviews={reviewStats.publishedReviews}
        pendingReviews={reviewStats.pendingReviews}
        flaggedReviews={reviewStats.flaggedReviews}
        averageRating={reviewStats.averageRating}
        mostReviewedLocation={reviewStats.mostReviewedLocation}
        loading={loading}
      />

      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded ${filter === 'published' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded ${filter === 'flagged' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Flagged
          </button>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search reviews..."
            className="px-3 py-2 border rounded"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {reviews.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No reviews found. Try changing your filters.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableColumn
                      label="Review"
                      field="title"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Rating"
                      field="rating"
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
                      label="Reviewer"
                      field="reviewer"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Location"
                      field="location"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Date"
                      field="date"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4">{review.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`h-5 w-5 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${review.status === 'published' ? 'bg-green-100 text-green-800' : 
                            review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}
                        >
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{review.reviewer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{review.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(review.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => handleViewDetails(review)}
                        >
                          View
                        </button>
                        {review.status === 'pending' && (
                          <>
                            <button
                              className="text-green-600 hover:text-green-900 mr-3"
                              onClick={() => handleStatusChange(review.id, 'published')}
                            >
                              Approve
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 mr-3"
                              onClick={() => handleStatusChange(review.id, 'flagged')}
                            >
                              Flag
                            </button>
                          </>
                        )}
                        {review.status === 'flagged' && (
                          <button
                            className="text-green-600 hover:text-green-900 mr-3"
                            onClick={() => handleStatusChange(review.id, 'published')}
                          >
                            Approve
                          </button>
                        )}
                        {review.status === 'published' && (
                          <button
                            className="text-red-600 hover:text-red-900 mr-3"
                            onClick={() => handleStatusChange(review.id, 'flagged')}
                          >
                            Flag
                          </button>
                        )}
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteReview(review.id)}
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

      {/* Review details modal */}
      {showResponseModal && currentReview && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">Review Details</h3>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xl font-semibold mb-2">{currentReview.title}</h4>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`h-5 w-5 ${index < currentReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      by {currentReview.reviewer} on {new Date(currentReview.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{currentReview.content}</p>

                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Location:</span> {currentReview.location}
                  </div>

                  {currentReview.images && currentReview.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {currentReview.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="h-24 w-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-medium mb-2">Management Response</h5>

                  {currentReview.responseText ? (
                    <div className="bg-blue-50 p-3 rounded mb-4">
                      <p className="text-gray-700">{currentReview.responseText}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Responded on: {currentReview.responseDate ? new Date(currentReview.responseDate).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic mb-4">No response has been provided yet.</p>
                  )}

                  <textarea
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    rows={4}
                    placeholder="Enter your response to this review..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  ></textarea>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowResponseModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim() || respondLoading}
                    className={`px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark ${
                      !responseText.trim() || respondLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {respondLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Response'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
