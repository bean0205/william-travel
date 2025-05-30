import React, { useState, useEffect, useCallback } from 'react';
import { 
  getEvents, 
  deleteEvent, 
  createEvent, 
  updateEvent, 
  getEventCategories, 
  getEventOrganizers,
  Event,
  EventCategory,
  EventOrganizer,
  PaginationResponse
} from '@/services/api/eventService';
import Pagination from '@/components/admin/Pagination';
import SortableColumn, { SortDirection } from '@/components/admin/SortableColumn';

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string>('start_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filtering state
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [organizerId, setOrganizerId] = useState<number | null>(null);
  const [regionId, setRegionId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Categories and organizers
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [organizers, setOrganizers] = useState<EventOrganizer[]>([]);

  // Modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Event>>({
    name: '',
    description: '',
    category_id: 0,
    organizer_id: 0,
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    location: {
      address: '',
      latitude: 0,
      longitude: 0
    },
    region_id: 1
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    past: 0,
  });

  // Fetch events when dependencies change
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: filter !== 'all' ? filter : undefined,
        search: searchTerm || undefined,
        sort_by: sortField || undefined,
        sort_order: sortDirection || undefined,
        category_id: categoryId || undefined,
        organizer_id: organizerId || undefined,
        region_id: regionId || undefined,
      };

      const response = await getEvents(params);
      setEvents(response.items || []);
      setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
      setTotalItems(response.total || 0);

      // Update statistics
      const allEvents = await getEvents({ limit: 1000 });
      const allEventsData = allEvents.items || [];

      setStats({
        total: allEventsData.length,
        upcoming: allEventsData.filter(e => e.status === 'upcoming').length,
        ongoing: allEventsData.filter(e => e.status === 'ongoing').length,
        past: allEventsData.filter(e => e.status === 'past').length,
      });

      setError(null);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Could not load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter, searchTerm, sortField, sortDirection, categoryId, organizerId, regionId]);

  // Load categories and organizers
  const fetchCategoriesAndOrganizers = useCallback(async () => {
    try {
      const categoriesPromise = getEventCategories();
      const organizersPromise = getEventOrganizers();
      
      const [categoriesResult, organizersResult] = await Promise.all([
        categoriesPromise,
        organizersPromise
      ]);
      
      setCategories(categoriesResult || []);
      setOrganizers(organizersResult || []);
    } catch (error) {
      console.error('Failed to fetch categories or organizers:', error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchCategoriesAndOrganizers();
  }, [fetchEvents, fetchCategoriesAndOrganizers]);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounce = setTimeout(() => {
        setCurrentPage(1);
        fetchEvents();
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchTerm, fetchEvents]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        setSuccess('Event deleted successfully');
        fetchEvents();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Failed to delete event:', err);
        setError('Failed to delete event');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleSort = (field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleFilter = (filter: 'all' | 'upcoming' | 'ongoing' | 'past') => {
    setFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setFormData(event);
    setShowEventModal(true);
  };

  const handleAdd = () => {
    setCurrentEvent(null); // Reset for new event
    setFormData({
      name: '',
      description: '',
      category_id: categories[0]?.id || 0,
      organizer_id: organizers[0]?.id || 0,
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      location: {
        address: '',
        latitude: 0,
        longitude: 0
      },
      region_id: 1,
      ticket_price: '',
      website: ''
    });
    setShowEventModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location!,
        [name]: name === 'address' ? value : Number(value)
      }
    });
  };

  const handleSaveEvent = async () => {
    setFormLoading(true);
    try {
      if (currentEvent?.id) {
        await updateEvent(currentEvent.id, formData);
        setSuccess('Event updated successfully');
      } else {
        await createEvent(formData as any);
        setSuccess('Event created successfully');
      }
      setShowEventModal(false);
      fetchEvents();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save event:', err);
      setError('Failed to save event');
      setTimeout(() => setError(null), 3000);
    } finally {
      setFormLoading(false);
    }
  };

  const clearFilters = () => {
    setCategoryId(null);
    setOrganizerId(null);
    setRegionId(null);
    setCurrentPage(1);
    fetchEvents();
  };
  
  const applyFilters = () => {
    setCurrentPage(1);
    fetchEvents();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Management</h1>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Events</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-700">Upcoming Events</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-green-700">Ongoing Events</h3>
          <p className="text-3xl font-bold text-green-600">{stats.ongoing}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-500">Past Events</h3>
          <p className="text-3xl font-bold text-gray-500">{stats.past}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => handleFilter('upcoming')}
            className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleFilter('ongoing')}
            className={`px-4 py-2 rounded ${filter === 'ongoing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Ongoing
          </button>
          <button
            onClick={() => handleFilter('past')}
            className={`px-4 py-2 rounded ${filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Past
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
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
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>
          
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Event
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border rounded p-2"
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
              <select
                className="w-full border rounded p-2"
                value={organizerId || ''}
                onChange={(e) => setOrganizerId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">All Organizers</option>
                {organizers.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <input
                type="number"
                placeholder="Region ID"
                className="w-full border rounded p-2"
                value={regionId || ''}
                onChange={(e) => setRegionId(e.target.value ? Number(e.target.value) : null)}
              />
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

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Name"
                  field="name"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Category"
                  field="category_id"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={handleSort}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableColumn
                  label="Start Date"
                  field="start_date"
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
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const categoryName = categories.find(c => c.id === event.category_id)?.name || 'Unknown';
                const statusClass = 
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800';
                
                return (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.start_date).toLocaleDateString()}
                      {event.start_time && ` ${event.start_time}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                        {event.status && event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
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
      <div className="mt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">
              {currentEvent ? 'Edit Event' : 'Add New Event'}
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveEvent(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                  <select
                    name="organizer_id"
                    value={formData.organizer_id || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    required
                  >
                    {organizers.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.location?.address || ''}
                    onChange={handleLocationChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    value={formData.location?.latitude || 0}
                    onChange={handleLocationChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    value={formData.location?.longitude || 0}
                    onChange={handleLocationChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region ID</label>
                  <input
                    type="number"
                    name="region_id"
                    value={formData.region_id || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price</label>
                  <input
                    type="text"
                    name="ticket_price"
                    value={formData.ticket_price || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    placeholder="e.g. Free, $10, 200.000 VND"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    name="cover_image"
                    value={formData.cover_image || ''}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
