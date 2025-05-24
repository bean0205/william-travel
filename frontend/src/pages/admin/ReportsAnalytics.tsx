import React, { useState, useEffect, useCallback } from 'react';
import { Spin, message } from 'antd';
import { getAnalytics, getMostViewedPages, getTopReferrers } from '@/services/api/analyticsService';

interface AnalyticsData {
  totalVisits: number;
  uniqueUsers: number;
  pageViews: number;
  avgSessionTime: string;
  bounceRate: string;
  topCountries: string[];
  deviceUsage: { desktop: number; mobile: number; tablet: number };
}

interface PageView {
  id: number;
  title: string;
  views: number;
  avgTime: string;
}

interface Referrer {
  id: number;
  source: string;
  visits: number;
  conversionRate: string;
}

// This is a simplified analytics dashboard
// In a real application, you would use a charting library like Chart.js, Recharts, or D3.js
const ReportsAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [mostViewedPages, setMostViewedPages] = useState<PageView[]>([]);
  const [topReferrers, setTopReferrers] = useState<Referrer[]>([]);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch analytics data
      const analytics = await getAnalytics(timeRange);
      
      // Fetch most viewed pages  
      const pages = await getMostViewedPages(5);

      // Fetch top referrers
      const referrers = await getTopReferrers(5);

      setAnalyticsData(analytics);
      setMostViewedPages(pages || []);
      setTopReferrers(referrers || []);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      message.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics & Reports</h1>

      {/* Time range selector */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setTimeRange('7d')}
          className={`px-4 py-2 rounded ${timeRange === '7d' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setTimeRange('30d')}
          className={`px-4 py-2 rounded ${timeRange === '30d' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Last 30 Days
        </button>
        <button
          onClick={() => setTimeRange('90d')}
          className={`px-4 py-2 rounded ${timeRange === '90d' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Last 90 Days
        </button>
        <button
          onClick={() => setTimeRange('1y')}
          className={`px-4 py-2 rounded ${timeRange === '1y' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Last Year
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Visits</h3>
          <p className="text-2xl font-bold">{analyticsData?.totalVisits?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Unique Users</h3>
          <p className="text-2xl font-bold">{analyticsData?.uniqueUsers?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Page Views</h3>
          <p className="text-2xl font-bold">{analyticsData?.pageViews?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg. Session Duration</h3>
          <p className="text-2xl font-bold">{analyticsData?.avgSessionTime || 'N/A'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Bounce Rate</h3>
          <p className="text-2xl font-bold">{analyticsData?.bounceRate || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic chart placeholder */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Traffic Overview</h2>
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Traffic chart visualization would go here</p>
            {/* In a real app, you'd use a chart component here */}
          </div>
        </div>

        {/* Device usage chart placeholder */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Device Usage</h2>
          <div className="h-64 flex">
            <div className="w-1/2 flex items-center justify-center">
              <div className="h-40 w-40 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <p className="text-sm text-gray-600 text-center">Device chart<br/>placeholder</p>
              </div>
            </div>
            <div className="w-1/2 flex flex-col justify-center">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm">Desktop: {analyticsData?.deviceUsage?.desktop || 0}%</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm">Mobile: {analyticsData?.deviceUsage?.mobile || 0}%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span className="text-sm">Tablet: {analyticsData?.deviceUsage?.tablet || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most viewed pages */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Most Viewed Pages</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Title</th>
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
              </tr>
            </thead>
            <tbody>
              {mostViewedPages.map((page) => (
                <tr key={page.id}>
                  <td className="py-2 whitespace-nowrap">{page.title}</td>
                  <td className="py-2 text-right">{page.views.toLocaleString()}</td>
                  <td className="py-2 text-right">{page.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top referrers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                <th className="py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {topReferrers.map((referrer) => (
                <tr key={referrer.id}>
                  <td className="py-2 whitespace-nowrap">{referrer.source}</td>
                  <td className="py-2 text-right">{referrer.visits.toLocaleString()}</td>
                  <td className="py-2 text-right">{referrer.conversionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default ReportsAnalytics;
