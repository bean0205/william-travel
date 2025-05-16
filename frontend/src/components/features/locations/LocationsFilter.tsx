type LocationsFilterProps = {
  filter: {
    category: string;
    searchQuery: string;
  };
  onFilterChange: (filter: { category: string; searchQuery: string }) => void;
};

const LocationsFilter = ({ filter, onFilterChange }: LocationsFilterProps) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beach', label: 'Beaches' },
    { value: 'mountain', label: 'Mountains' },
    { value: 'city', label: 'Cities' },
    { value: 'countryside', label: 'Countryside' },
    { value: 'historical', label: 'Historical' },
  ];

  return (
    <div className="mb-8 rounded-lg bg-white p-4 shadow-md md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search destinations..."
            className="input w-full"
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
          />
        </div>
        
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            className="input w-full"
            value={filter.category}
            onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationsFilter;
