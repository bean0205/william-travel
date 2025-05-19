import apiClient from './apiClient';
import { getLocations } from './locationService';

// This service handles map-specific data operations
export const getMapLocations = async (params: Record<string, any> = {}) => {
  // In a real app, you might have a specific endpoint for map data
  // that includes coordinates and other map-relevant information
  // For this demo, we'll reuse the location service but could add map-specific functionality

  // We'll include coordinates and make sure all returned items have lat/lng
  const locations = await getLocations(params);
  
  // Filter out any locations without proper coordinates
  return locations.filter(
    (location) => location.latitude != null && location.longitude != null
  );
};

export const searchNearbyLocations = async (
  latitude: number,
  longitude: number,
  radius: number = 50 // km
) => {
  // In a real app, you would do:
  // const { data } = await apiClient.get('/map/nearby', { 
  //   params: { latitude, longitude, radius } 
  // });
  // return data;
  
  // For demo, we'll simulate this with our mock data
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulated delay
  
  // Get all locations
  const allLocations = await getLocations();
  
  // Calculate distance (this is a simplified calculation)
  // In production, you'd want a proper haversine formula
  return allLocations.filter((location) => {
    if (!location.latitude || !location.longitude) return false;
    
    // Simple distance check - not geographically accurate but works for demo
    const latDiff = Math.abs(location.latitude - latitude);
    const lngDiff = Math.abs(location.longitude - longitude);
    
    // Rough approximation - 1 degree is ~111km
    const approxDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
    
    return approxDistance <= radius;
  });
};
