import { useState } from 'react';
import Map from '@/components/features/map_explorer/Map';
import LocationPanel from '@/components/features/map_explorer/LocationPanel';
import SearchBar from '@/components/features/map_explorer/SearchBar';

const MapExplorerPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="p-4 bg-white z-10 shadow-sm">
        <SearchBar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-3/4 h-full relative">
          <Map onLocationSelect={setSelectedLocation} />
        </div>
        <div className="hidden md:block md:w-1/4 overflow-y-auto border-l border-gray-200">
          <LocationPanel location={selectedLocation} />
        </div>
      </div>
    </div>
  );
};

export default MapExplorerPage;
