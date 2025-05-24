import React, { useState, useEffect } from 'react';
import { getEvents, deleteEvent, createEvent, updateEvent, Event } from '@/services/api/eventService';
import Pagination from '@/components/admin/Pagination';
import SortableColumn, { SortDirection } from '@/components/admin/SortableColumn';
import EventStatistics from '@/components/admin/EventStatistics';
import EventForm from '@/components/admin/EventForm';

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Modal state for event form
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event> | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Event statistics
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    pastEvents: 0,
    eventsThisMonth: 0,
    mostPopularLocation: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const filters = filter !== 'all' ? { status: filter } : {};
      const data = await getEvents(filters);
      setAllEvents(data);

      // Calculate statistics
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const stats = {
        totalEvents: data.length,
        upcomingEvents: data.filter(event => event.status === 'upcoming').length,
        ongoingEvents: data.filter(event => event.status === 'ongoing').length,
        pastEvents: data.filter(event => event.status === 'past').length,
        eventsThisMonth: data.filter(event => {
          const eventDate = new Date(event.start_date || event.startDate || '');
          return !isNaN(eventDate.getTime()) && eventDate >= firstDayOfMonth && eventDate <= lastDayOfMonth;
        }).length,
        mostPopularLocation: getMostPopularLocation(data),
      };
      setEventStats(stats);

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
      setEvents(paginatedData);

      setError(null);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Could not load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get most popular location based on event count
  const getMostPopularLocation = (events: Event[]): string => {
    if (events.length === 0) return '';

    const locationCount: Record<string, number> = {};
    events.forEach(event => {
      // Handle different location data structures
      let locationKey = 'Unknown';
      
      if (typeof event.location === 'string') {
        locationKey = event.location;
      } else if (event.location && typeof event.location === 'object' && 'address' in event.location) {
        locationKey = event.location.address;
      } else if (event.region_id) {
        locationKey = `Region ID: ${event.region_id}`;
      }
      
      locationCount[locationKey] = (locationCount[locationKey] || 0) + 1;
    });

    let mostPopularLocation = '';
    let maxCount = 0;

    Object.entries(locationCount).forEach(([location, count]) => {
      if (count > maxCount) {
        mostPopularLocation = location;
        maxCount = count;
      }
    });

    return mostPopularLocation;
  };

  const handleDeleteEvent = async (id: string | undefined) => {
    if (!id) {
      setError('Cannot delete event: Missing ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        // Update events state and refetch to update statistics
        fetchEvents();
      } catch (err) {
        console.error('Failed to delete event:', err);
        setError('Could not delete event. Please try again later.');
      }
    }
  };
  
  const handleSort = (field: string, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);

    if (direction === null) {
      // Reset to original order
      fetchEvents();
      return;
    }

    const sortedEvents = sortData([...allEvents], field, direction);

    // Update total pages
    setTotalPages(Math.max(1, Math.ceil(sortedEvents.length / itemsPerPage)));

    // Reset to first page when sorting
    setCurrentPage(1);

    // Set current page data
    const startIndex = 0;  // First page
    const paginatedData = sortedEvents.slice(startIndex, startIndex + itemsPerPage);
    setEvents(paginatedData);
  };

  const sortData = (data: Event[], field: string, direction: SortDirection): Event[] => {
    if (!direction) return data;

    return [...data].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      // Handle different field naming between API and UI
      switch (field) {
        case 'title':
          valueA = a.title || a.name;
          valueB = b.title || b.name;
          break;
        case 'startDate':
          valueA = a.startDate || a.start_date;
          valueB = b.startDate || b.start_date;
          break;
        case 'endDate':
          valueA = a.endDate || a.end_date;
          valueB = b.endDate || b.end_date;
          break;
        case 'location':
          valueA = typeof a.location === 'string' ? a.location : 
                  (a.location && 'address' in a.location ? a.location.address : '');
          valueB = typeof b.location === 'string' ? b.location : 
                  (b.location && 'address' in b.location ? b.location.address : '');
          break;
        default:
          valueA = (a as any)[field];
          valueB = (b as any)[field];
      }

      // Handle dates
      if (field === 'startDate' || field === 'endDate' || field === 'start_date' || field === 'end_date') {
        valueA = new Date(valueA || '').getTime();
        valueB = new Date(valueB || '').getTime();
        
        // Handle invalid dates
        if (isNaN(valueA)) valueA = 0;
        if (isNaN(valueB)) valueB = 0;
      }

      // Compare based on direction
      if (direction === 'asc') {
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB);
        }
        return (valueA || 0) - (valueB || 0);
      } else {
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueB.localeCompare(valueA);
        }
        return (valueB || 0) - (valueA || 0);
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Apply current filters and sorting
    let filteredData = [...allEvents];
    if (sortField && sortDirection) {
      filteredData = sortData(filteredData, sortField, sortDirection);
    }

    // Get data for the selected page
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    setEvents(paginatedData);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);  // Reset to first page when searching

    // Filter events based on search term
    const filteredEvents = allEvents.filter(event => {
      const searchValue = e.target.value.toLowerCase();
      
      // Search in name/title
      const nameMatch = (event.name?.toLowerCase().includes(searchValue) || 
                        event.title?.toLowerCase().includes(searchValue)) ?? false;
      
      // Search in location
      let locationMatch = false;
      if (typeof event.location === 'string') {
        locationMatch = event.location.toLowerCase().includes(searchValue);
      } else if (event.location && typeof event.location === 'object' && 'address' in event.location) {
        locationMatch = event.location.address.toLowerCase().includes(searchValue);
      }
      
      return nameMatch || locationMatch;
    });

    // Apply current sorting if any
    let sortedEvents = [...filteredEvents];
    if (sortField && sortDirection) {
      sortedEvents = sortData(sortedEvents, sortField, sortDirection);
    }

    // Update pagination
    setTotalPages(Math.max(1, Math.ceil(sortedEvents.length / itemsPerPage)));

    // Show first page results
    const paginatedData = sortedEvents.slice(0, itemsPerPage);
    setEvents(paginatedData);
  };

  const openCreateEventModal = () => {
    setCurrentEvent(null);
    setShowEventModal(true);
  };

  const openEditEventModal = (event: Event) => {
    setCurrentEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setCurrentEvent(null);
  };

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    setFormLoading(true);
    try {
      if (currentEvent?.id) {
        // Update existing event
        await updateEvent(currentEvent.id, eventData);
      } else {
        // Create new event
        await createEvent(eventData);
      }

      // Close modal and refresh data
      closeEventModal();
      fetchEvents();
    } catch (err) {
      console.error('Failed to save event:', err);
      setError('Could not save event. Please try again later.');
    } finally {
      setFormLoading(false);
    }
  };

  // Helper function to get event title/name
  const getEventTitle = (event: Event): string => {
    return event.title || event.name || 'Untitled Event';
  };
  
  // Helper function to get event location display
  const getEventLocation = (event: Event): string => {
    if (typeof event.location === 'string') {
      return event.location;
    } else if (event.location && typeof event.location === 'object' && 'address' in event.location) {
      return event.location.address;
    }
    return `Region ID: ${event.region_id || 'Unknown'}`;
  };
  
  // Helper function to get event start date
  const getEventStartDate = (event: Event): string => {
    const startDate = event.startDate || event.start_date;
    if (!startDate) return 'N/A';
    
    try {
      return new Date(startDate).toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Event Management</h1>
      
      {/* Event Statistics Dashboard */}
      <EventStatistics
        totalEvents={eventStats.totalEvents}
        upcomingEvents={eventStats.upcomingEvents}
        ongoingEvents={eventStats.ongoingEvents}
        pastEvents={eventStats.pastEvents}
        eventsThisMonth={eventStats.eventsThisMonth}
        mostPopularLocation={eventStats.mostPopularLocation}
        loading={loading}
      />

      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            All Events
          </button>
          <button 
            onClick={() => setFilter('upcoming')} 
            className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('ongoing')} 
            className={`px-4 py-2 rounded ${filter === 'ongoing' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Ongoing
          </button>
          <button 
            onClick={() => setFilter('past')} 
            className={`px-4 py-2 rounded ${filter === 'past' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Past
          </button>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search events..."
            className="px-3 py-2 border rounded"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button 
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={openCreateEventModal}
          >
            Create Event
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
            {events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No events found. Try changing your filters or creating a new event.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableColumn
                      label="Event Name"
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
                      label="Location"
                      field="location"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableColumn
                      label="Start Date"
                      field="startDate"
                      currentSortField={sortField}
                      currentSortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEventTitle(event)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {event.status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEventLocation(event)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEventStartDate(event)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={() => openEditEventModal(event)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => window.open(`/events/${event.id}`, '_blank')}
                        >
                          View
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteEvent(event.id)}
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

      {/* Event form modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentEvent?.id ? 'Edit Event' : 'Create New Event'}
                </h3>
              </div>

              <div className="p-4">
                <EventForm
                  event={currentEvent || {}}
                  onSubmit={handleSaveEvent}
                  onCancel={closeEventModal}
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

export default EventManagement;
