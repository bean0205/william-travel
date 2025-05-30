// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/pages/admin/CommunityPostManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  getCommunityPosts,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  updatePostStatus,
  CommunityPost,
  PaginationResponse
} from '@/services/api/communityPostService';
import Pagination from '@/components/admin/Pagination';
import SortableColumn, { SortDirection } from '@/components/admin/SortableColumn';
import { getLocations } from '@/services/api/locationService';

// Update interfaces based on API documentation
interface PostUser {
  id: number;
  full_name: string;
}

interface PostLocation {
  id: number;
  name: string;
}

interface PostComment {
  id: number;
  content: string;
  user: PostUser;
  created_at: string;
}

// Update CommunityPost interface to include status field
interface CommunityPost {
  id: number;
  title: string;
  content: string;
  user: PostUser;
  location?: PostLocation;
  images: string[];
  likes_count: number;
  comments_count: number;
  comments?: PostComment[];
  created_at: string;
  updated_at: string;
  flagged?: boolean;
  status?: 'published' | 'pending' | 'flagged';
}

const CommunityPostManagement: React.FC = () => {
  // Main state
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string | null>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filtering state
  const [showFilters, setShowFilters] = useState(false);
  const [userFilter, setUserFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<{start?: string, end?: string}>({});
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'flagged'>('all');

  // Locations for dropdown
  const [locations, setLocations] = useState<PostLocation[]>([]);

  // Modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<CommunityPost> | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<CommunityPost>>({});
  const [locationId, setLocationId] = useState<number | undefined>();
  const [imageUrls, setImageUrls] = useState<string>('');
  
  // Comment modal state
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    flaggedPosts: 0,
    pendingPosts: 0,
    publishedPosts: 0,
    postsToday: 0,
    postsThisWeek: 0,
    mostActiveUser: '',
    mostDiscussedLocation: '',
  });

  // API fetch functions
  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.items || []);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const calculateStatistics = async () => {
    try {
      // For statistics, fetch with larger limit
      const allPostsResponse = await getCommunityPosts({
        limit: 1000
      }) as PaginationResponse<CommunityPost>;

      const allPosts = allPostsResponse.items;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Count posts by user
      const userPostCount: Record<string, number> = {};
      // Count posts by location
      const locationPostCount: Record<string, number> = {};

      allPosts.forEach(post => {
        // Count by user
        const userName = typeof post.user === 'string' ? post.user : post.user?.full_name || 'Unknown';
        userPostCount[userName] = (userPostCount[userName] || 0) + 1;

        // Count by location
        if (post.location) {
          const locationName = typeof post.location === 'string' ? post.location : post.location?.name || 'Unknown';
          locationPostCount[locationName] = (locationPostCount[locationName] || 0) + 1;
        }
      });

      // Find most active user
      let maxUserPosts = 0;
      let mostActiveUser = '';
      Object.entries(userPostCount).forEach(([user, count]) => {
        if (count > maxUserPosts) {
          mostActiveUser = user;
          maxUserPosts = count;
        }
      });

      // Find most discussed location
      let maxLocationPosts = 0;
      let mostDiscussedLocation = '';
      Object.entries(locationPostCount).forEach(([location, count]) => {
        if (count > maxLocationPosts) {
          mostDiscussedLocation = location;
          maxLocationPosts = count;
        }
      });

      // Count posts today and this week
      const postsToday = allPosts.filter(post => {
        const postDate = new Date(post.created_at);
        return postDate >= today;
      }).length;

      const postsThisWeek = allPosts.filter(post => {
        const postDate = new Date(post.created_at);
        return postDate >= weekAgo;
      }).length;

      // Count flagged posts
      const flaggedPosts = allPosts.filter(post => post.status === 'flagged').length;

      // Count pending and published posts
      const pendingPosts = allPosts.filter(post => post.status === 'pending').length;
      const publishedPosts = allPosts.filter(post => post.status === 'published').length;

      setStats({
        total: allPosts.length,
        flaggedPosts,
        pendingPosts,
        publishedPosts,
        postsToday,
        postsThisWeek,
        mostActiveUser,
        mostDiscussedLocation,
      });

    } catch (error) {
      console.error('Failed to calculate statistics:', error);
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        user_id: userFilter || undefined,
        location_id: locationFilter || undefined,
        start_date: dateFilter.start || undefined,
        end_date: dateFilter.end || undefined,
        status: filter !== 'all' ? filter : undefined,
        sort_by: sortField || undefined,
        sort_order: sortDirection || undefined,
      };

      const response = await getCommunityPosts(params) as PaginationResponse<CommunityPost>;

      setPosts(response.items);
      setTotalPages(response.pages);
      setTotalItems(response.total);

      // Calculate statistics
      calculateStatistics();

      setError(null);
    } catch (err) {
      console.error('Failed to fetch community posts:', err);
      setError('Could not load community posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, userFilter, locationFilter, dateFilter, filter, sortField, sortDirection]);

  // Effects
  useEffect(() => {
    fetchPosts();
    fetchLocations();
  }, [fetchPosts]);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounce = setTimeout(() => {
        setCurrentPage(1);
        fetchPosts();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, fetchPosts]);

  // Form handling functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Reset form when opening modal
  useEffect(() => {
    if (showPostModal) {
      if (currentPost) {
        setFormData(currentPost);
        setLocationId(currentPost.location?.id);
        setImageUrls(currentPost.images?.join('\n') || '');
      } else {
        setFormData({
          title: '',
          content: '',
          images: []
        });
        setLocationId(undefined);
        setImageUrls('');
      }
    }
  }, [showPostModal, currentPost]);

  // Event handlers
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteCommunityPost(id);
        setSuccess('Post deleted successfully');
        fetchPosts();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Failed to delete post:', err);
        setError('Failed to delete post');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleEdit = (post: CommunityPost) => {
    setCurrentPost(post);
    setShowPostModal(true);
  };

  const handleAdd = () => {
    setCurrentPost(null); // Reset for new post
    setShowPostModal(true);
  };

  const handleViewComments = (post: CommunityPost) => {
    setCurrentPost(post);
    setShowCommentModal(true);
  };

  const handleStatusChange = async (id: number, status: 'published' | 'pending' | 'flagged') => {
    try {
      await updatePostStatus(id, status);
      setSuccess(`Post status changed to ${status}`);
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update post status:', err);
      setError('Failed to update post status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSavePost = async (postData: Partial<CommunityPost>) => {
    setFormLoading(true);
    try {
      if (currentPost?.id) {
        await updateCommunityPost(currentPost.id, {
          title: postData.title,
          content: postData.content,
          location_id: locationId,
          status: postData.status
        });
        setSuccess('Post updated successfully');
      } else {
        await createCommunityPost({
          title: postData.title || '',
          content: postData.content || '',
          location_id: locationId
        });
        setSuccess('Post created successfully');
      }
      setShowPostModal(false);
      fetchPosts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save post:', err);
      setError('Failed to save post');
      setTimeout(() => setError(null), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSort = useCallback((field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  const applyFilters = () => {
    setCurrentPage(1);
    fetchPosts();
  };

  const clearFilters = () => {
    setUserFilter('');
    setLocationFilter('');
    setDateFilter({});
    setFilter('all');
    setCurrentPage(1);
    fetchPosts();
  };
  
  const handleFilter = (filterType: 'all' | 'published' | 'pending' | 'flagged') => {
    setFilter(filterType);
    setCurrentPage(1);
    fetchPosts();
  };

  // Render functions
  // Render form modal for adding/editing posts
  const renderPostForm = () => {
    if (!showPostModal) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Process image URLs
      const images = imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      handleSavePost({
        ...formData,
        images
      });
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4">
            {currentPost ? 'Edit Community Post' : 'Add New Community Post'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={formData.content || ''}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={locationId || ''}
                  onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full border rounded p-2"
                >
                  <option value="">No Location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URLs (one per line)
                </label>
                <textarea
                  value={imageUrls}
                  onChange={(e) => setImageUrls(e.target.value)}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>

              {currentPost && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="px-4 py-2 border rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render modal for viewing comments
  const renderCommentsModal = () => {
    if (!showCommentModal || !currentPost) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-2">Comments</h2>
          <h3 className="text-gray-600 text-sm mb-4">Post: {currentPost.title}</h3>

          {!currentPost.comments || currentPost.comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments on this post.</p>
          ) : (
            <div className="space-y-4">
              {currentPost.comments.map(comment => (
                <div key={comment.id} className="border rounded p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{comment.user.full_name}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowCommentModal(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Community Post Management</h1>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-gray-700">Total Posts</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-red-700">Flagged Posts</h3>
          <p className="text-3xl font-bold text-red-600">{stats.flaggedPosts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-blue-700">Posts Today</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.postsToday}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-green-700">Posts This Week</h3>
          <p className="text-3xl font-bold text-green-600">{stats.postsThisWeek}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-purple-700">Most Active User</h3>
          <p className="text-base font-bold text-purple-600 truncate" title={stats.mostActiveUser}>
            {stats.mostActiveUser || 'N/A'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-base font-semibold text-yellow-700">Top Location</h3>
          <p className="text-base font-bold text-yellow-600 truncate" title={stats.mostDiscussedLocation}>
            {stats.mostDiscussedLocation || 'N/A'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
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
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded flex items-center ml-2"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Post
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID/Name</label>
              <input
                type="text"
                placeholder="Filter by user"
                className="w-full px-3 py-2 border rounded"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={dateFilter.start || ''}
                  onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                />
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={dateFilter.end || ''}
                  onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border rounded"
            >
              Clear Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
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

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Title"
                  field="title"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
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
                  label="Status"
                  field="status"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Location"
                  field="location"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Created"
                  field="created_at"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No community posts found.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const userName = typeof post.user === 'string' ? post.user : post.user?.full_name || 'Anonymous';
                const locationName = post.location ? (typeof post.location === 'string' ? post.location : post.location?.name || 'Unknown') : 'No location';

                return (
                  <tr key={post.id} className={post.status === 'flagged' ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {post.status === 'flagged' && (
                          <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-red-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                        )}
                        <span className={`${post.status === 'flagged' ? 'text-red-700' : ''} truncate max-w-xs`} title={post.title}>
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${post.status === 'published' ? 'bg-green-100 text-green-800' : 
                          post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {locationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <span className="flex items-center cursor-pointer" onClick={() => handleViewComments(post)}>
                          <svg className="w-5 h-5 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                          </svg>
                          {post.comments_count || 0}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-5 h-5 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                          </svg>
                          {post.likes_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleStatusChange(
                            post.id, 
                            post.status === 'flagged' ? 'published' : 'flagged'
                          )}
                          className={`text-${post.status === 'flagged' ? 'green' : 'red'}-600 hover:text-${post.status === 'flagged' ? 'green' : 'red'}-900`}
                        >
                          {post.status === 'flagged' ? 'Unflag' : 'Flag'}
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
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
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{posts.length}</span> of{' '}
          <span className="font-medium">{totalItems}</span> posts
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Post Modal */}
      {renderPostForm()}

      {/* Comments Modal */}
      {renderCommentsModal()}
    </div>
  );
};

export default CommunityPostManagement;
