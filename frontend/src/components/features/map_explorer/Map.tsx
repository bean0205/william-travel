import { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore } from '@/store/mapStore';

type MapProps = {
  onLocationSelect: (location: any) => void;
};

const Map = ({ onLocationSelect }: MapProps) => {
  const { mapLocations, fetchMapLocations } = useMapStore();
  const [selectedMarker, setSelectedMarker] = useState<any | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 3,
  });

  useEffect(() => {
    fetchMapLocations();
  }, [fetchMapLocations]);

  const handleMarkerClick = (location: any) => {
    setSelectedMarker(location);
    onLocationSelect(location);
  };

  return (
    <ReactMapGL
      {...viewport}
      style={{ width: '100%', height: '100%' }}
      mapStyle={import.meta.env.VITE_MAPLIBRE_STYLE_URL}
      onMove={(evt) => setViewport(evt.viewState)}
    >
      {mapLocations.map((location) => (
        <Marker
          key={location.id}
          latitude={location.latitude}
          longitude={location.longitude}
          onClick={() => handleMarkerClick(location)}
        >
          <div className="marker cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center ring-2 ring-white">
              <span className="text-xs">📍</span>
            </div>
          </div>
        </Marker>
      ))}

      {selectedMarker && (
        <Popup
          latitude={selectedMarker.latitude}
          longitude={selectedMarker.longitude}
          closeOnClick={false}
          onClose={() => setSelectedMarker(null)}
          anchor="bottom"
          offset={25}
        >
          <div className="p-2">
            <h3 className="font-bold">{selectedMarker.name}</h3>
            <p className="text-xs text-gray-500">{selectedMarker.category}</p>
          </div>
        </Popup>
      )}

      <NavigationControl position="top-right" />
    </ReactMapGL>
  );
};

export default Map;
