import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  List,
  Plus,
  Map,
  Building,
  Landmark,
  Mountain,
  Palmtree,
  Globe
} from 'lucide-react';

export interface LocationNavigationMenuProps {
  currentSection?: string;
}

/**
 * Navigation menu for the location management section of the admin panel
 */
const LocationNavigationMenu: React.FC<LocationNavigationMenuProps> = ({
  currentSection = 'locations'
}) => {
  const navigate = useNavigate();

  // Menu items for location management
  const menuItems = [
    {
      id: 'continents',
      label: 'Continents',
      icon: <Globe className="mr-2 h-4 w-4" />,
      path: '/admin/locations/continents'
    },
    {
      id: 'countries',
      label: 'Countries',
      icon: <MapPin className="mr-2 h-4 w-4" />,
      path: '/admin/locations/countries'
    },
    {
      id: 'regions',
      label: 'Regions',
      icon: <Map className="mr-2 h-4 w-4" />,
      path: '/admin/locations/regions'
    },
    {
      id: 'districts',
      label: 'Districts',
      icon: <MapPin className="mr-2 h-4 w-4" />,
      path: '/admin/locations/districts'
    },
    {
      id: 'wards',
      label: 'Wards',
      icon: <MapPin className="mr-2 h-4 w-4" />,
      path: '/admin/locations/wards'
    },
    {
      id: 'categories',
      label: 'Location Categories',
      icon: <List className="mr-2 h-4 w-4" />,
      path: '/admin/locations/categories'
    },
  ];

  return (
    <div className="space-y-2 pb-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 flex items-center px-4 text-lg font-semibold tracking-tight">
          <MapPin className="mr-2 h-5 w-5" />
          Location Management
        </h2>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationNavigationMenu;
