import React from 'react';

interface EventStatisticProps {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  pastEvents: number;
  eventsThisMonth: number;
  mostPopularLocation?: string;
  loading: boolean;
}

const EventStatistics: React.FC<EventStatisticProps> = ({
  totalEvents,
  upcomingEvents,
  ongoingEvents,
  pastEvents,
  eventsThisMonth,
  mostPopularLocation,
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
      <h2 className="text-lg font-semibold mb-4">Event Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-500 font-medium">Total Events</p>
          <p className="text-2xl font-bold">{totalEvents}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-green-500 font-medium">Upcoming</p>
          <p className="text-2xl font-bold">{upcomingEvents}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((upcomingEvents / totalEvents) * 100) || 0}% of total
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-500 font-medium">Ongoing</p>
          <p className="text-2xl font-bold">{ongoingEvents}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((ongoingEvents / totalEvents) * 100) || 0}% of total
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Past</p>
          <p className="text-2xl font-bold">{pastEvents}</p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((pastEvents / totalEvents) * 100) || 0}% of total
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-500 font-medium">This Month</p>
          <p className="text-2xl font-bold">{eventsThisMonth}</p>
          <p className="text-xs text-gray-500 mt-1">
            {mostPopularLocation && `Most popular: ${mostPopularLocation}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventStatistics;
