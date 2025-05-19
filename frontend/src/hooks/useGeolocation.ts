import { useState, useEffect } from 'react';

type UseGeolocationReturn = {
  position: {
    latitude: number;
    longitude: number;
  } | null;
  error: GeolocationPositionError | null;
  loading: boolean;
};

export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError);
      setLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const error = (error: GeolocationPositionError) => {
      setError(error);
      setLoading(false);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    // To clean up and stop watching for changes
    const watchId = navigator.geolocation.watchPosition(success, error, options);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, error, loading };
};

export default useGeolocation;
