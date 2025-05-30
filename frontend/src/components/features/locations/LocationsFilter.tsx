import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, FilterIcon, MapPinIcon } from 'lucide-react';
import { useLocationsStore } from '@/store/locationsStore';
import { Country } from '@/store/countryStore';
import {
  getCountries,
  getRegions,
  getDistricts,
  getLocationCategories
} from '@/services/api/locationService';

type FilterType = {
  searchQuery: string;
  countryId: number | null;
  regionId: number | null;
  districtId: number | null;
  categoryId: number | null;
};

type LocationsFilterProps = {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  isCountrySelected?: boolean;
  selectedCountry?: Country | null;
};

const LocationsFilter = ({
  filter,
  onFilterChange,
  isCountrySelected = false,
  selectedCountry = null
}: LocationsFilterProps) => {
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all filter data on component mount
  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true);
      try {
        const [countriesData, categoriesData] = await Promise.all([
          getCountries(),
          getLocationCategories()
        ]);
        setCountries(countriesData);
        setCategories(categoriesData);

        // Nếu có selectedCountry từ state, tìm country ID tương ứng từ danh sách API
        if (isCountrySelected && selectedCountry && !filter.countryId) {
          const selectedCountryCode = selectedCountry.code.toLowerCase();
          const matchedCountry = countriesData.find((country: any) =>
            country.code?.toLowerCase() === selectedCountryCode ||
            country.name?.toLowerCase() === selectedCountry.name.toLowerCase()
          );

          if (matchedCountry) {
            console.log('Found matching country from API:', matchedCountry);
            // Cập nhật countryId trong filter để kích hoạt việc tải regions
            onFilterChange({
              ...filter,
              countryId: matchedCountry.id
            });
          } else {
            console.warn(`Could not find country with code ${selectedCountry.code} in API data`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterData();
  }, [isCountrySelected, selectedCountry]);

  // Fetch regions when country changes
  useEffect(() => {
    const fetchRegions = async () => {
      if (!filter.countryId) {
        setRegions([]);
        return;
      }

      try {
        const regionsData = await getRegions(0, 100, filter.countryId);
        setRegions(regionsData);
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    };

    fetchRegions();
  }, [filter.countryId]);

  // Fetch districts when region changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!filter.regionId) {
        setDistricts([]);
        return;
      }

      try {
        const districtsData = await getDistricts(0, 100, filter.regionId);
        setDistricts(districtsData);
      } catch (error) {
        console.error('Failed to fetch districts:', error);
      }
    };

    fetchDistricts();
  }, [filter.regionId]);

  // Reset dependent filters when parent filter changes
  useEffect(() => {
    if (!filter.countryId && (filter.regionId || filter.districtId)) {
      onFilterChange({
        ...filter,
        regionId: null,
        districtId: null
      });
    }
  }, [filter.countryId]);

  useEffect(() => {
    if (!filter.regionId && filter.districtId) {
      onFilterChange({
        ...filter,
        districtId: null
      });
    }
  }, [filter.regionId]);

  return (
    <Card className="bg-card mb-8">
      <CardContent className="grid gap-4 pt-6 md:grid-cols-2 lg:grid-cols-5">
        {/* Search Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SearchIcon className="text-muted-foreground h-4 w-4" />
            <Label
              htmlFor="search"
              className="text-foreground text-sm font-medium"
            >
              Search
            </Label>
          </div>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Search destinations..."
              className="w-full pl-3"
              value={filter.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filter, searchQuery: e.target.value })
              }
            />
          </div>
        </div>

        {/* Country Select / Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPinIcon className="text-muted-foreground h-4 w-4" />
            <Label
              htmlFor="country"
              className="text-foreground text-sm font-medium"
            >
              Country
            </Label>
          </div>

          {isCountrySelected && selectedCountry ? (
            // Hiển thị quốc gia đã chọn từ màn hình trước đó
            <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
              {selectedCountry.flagUrl && (
                <img
                  src={selectedCountry.flagUrl}
                  alt={selectedCountry.name}
                  className="h-5 w-5 rounded-sm object-cover"
                />
              )}
              <span className="text-sm font-medium">{selectedCountry.name}</span>
            </div>
          ) : (
            // Dropdown để chọn quốc gia nếu chưa được chọn từ màn hình trước
            <Select
              value={filter.countryId?.toString() || "all"}
              onValueChange={(value) =>
                onFilterChange({
                  ...filter,
                  countryId: value === "all" ? null : parseInt(value),
                  regionId: null,  // Reset dependent selects
                  districtId: null
                })
              }
            >
              <SelectTrigger id="country" className="w-full" disabled={isLoading}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Region Select */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilterIcon className="text-muted-foreground h-4 w-4" />
            <Label
              htmlFor="region"
              className="text-foreground text-sm font-medium"
            >
              Region
            </Label>
          </div>
          <Select
            value={filter.regionId?.toString() || "all"}
            onValueChange={(value) =>
              onFilterChange({
                ...filter,
                regionId: value === "all" ? null : parseInt(value),
                districtId: null  // Reset district when region changes
              })
            }
            disabled={!filter.countryId}
          >
            <SelectTrigger id="region" className="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id.toString()}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District Select */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilterIcon className="text-muted-foreground h-4 w-4" />
            <Label
              htmlFor="district"
              className="text-foreground text-sm font-medium"
            >
              District
            </Label>
          </div>
          <Select
            value={filter.districtId?.toString() || "all"}
            onValueChange={(value) =>
              onFilterChange({
                ...filter,
                districtId: value === "all" ? null : parseInt(value)
              })
            }
            disabled={!filter.regionId}
          >
            <SelectTrigger id="district" className="w-full">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilterIcon className="text-muted-foreground h-4 w-4" />
            <Label
              htmlFor="category"
              className="text-foreground text-sm font-medium"
            >
              Category
            </Label>
          </div>
          <Select
            value={filter.categoryId?.toString() || "all"}
            onValueChange={(value) =>
              onFilterChange({
                ...filter,
                categoryId: value === "all" ? null : parseInt(value)
              })
            }
          >
            <SelectTrigger id="category" className="w-full" disabled={isLoading}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsFilter;

