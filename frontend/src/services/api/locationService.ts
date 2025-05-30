// Location service for API communication
import apiClient from './apiClient';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// Interfaces for paginated locations
export interface LocationsParams {
  page?: number;
  limit?: number;
  search?: string;
  country_id?: number;
  region_id?: number;
  district_id?: number;
  category_id?: number;
}

export interface Location {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  featuredImageUrl?: string;
  rating?: number;
  category?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  isFeatured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LocationsResponse {
  items: Location[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Get paginated locations with filters
export const getPaginatedLocations = async (params: LocationsParams): Promise<LocationsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.list, { params });
  return response.data;
};

// Get all locations in parallel
export const getLocations = async () => {
  const [continents, countries, regions, districts, wards, categories] = await Promise.all([
    getContinents(),
    getCountries(),
    getRegions(),
    getDistricts(),
    getWards(),
    getLocationCategories(),
  ]);
  return {
    continents,
    countries,
    regions,
    districts,
    wards,
    categories,
  };
};

// Continent interfaces
export interface Continent {
  id: number;
  name: string;
  code: string;
  name_code: string;
  background_image: string;
  logo: string;
  description: string;
  description_code: string;
  status: number;
  created_at: string;
  updated_at: string;
}

// Interface cho phân trang kết quả continents
export interface ContinentPaginationResponse {
  items: Continent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContinentCreatePayload {
  name: string;
  code: string;
  name_code: string;
  background_image?: string;
  logo?: string;
  description?: string;
  description_code?: string;
  status: number;
}

export interface ContinentUpdatePayload {
  name?: string;
  code?: string;
  name_code?: string;
  background_image?: string;
  logo?: string;
  description?: string;
  description_code?: string;
  status?: number;
}

// Country interfaces
export interface Country {
  id: number;
  name: string;
  code: string;
  name_code: string;
  description: string;
  description_code: string;
  background_image: string;
  logo: string;
  status: number;
  continent_id: number;
  created_at: string;
  updated_at: string;
}

// Interface cho phân trang kết quả countries
export interface CountryPaginationResponse {
  items: Country[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CountryCreatePayload {
  name: string;
  code: string;
  name_code: string;
  description?: string;
  description_code?: string;
  background_image?: string;
  logo?: string;
  status: number;
  continent_id: number;
}

export interface CountryUpdatePayload {
  name?: string;
  code?: string;
  name_code?: string;
  description?: string;
  description_code?: string;
  background_image?: string;
  logo?: string;
  status?: number;
  continent_id?: number;
}

// Region interfaces
export interface Region {
  id: number;
  name: string;
  code: string;
  name_code: string;
  description: string;
  description_code: string;
  background_image: string;
  logo: string;
  status: number;
  country_id: number;
  created_at: string;
  updated_at: string;
}

// Interface cho phân trang kết quả regions
export interface RegionPaginationResponse {
  items: Region[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RegionCreatePayload {
  name: string;
  code: string;
  name_code: string;
  description?: string;
  description_code?: string;
  background_image?: string;
  logo?: string;
  status: number;
  country_id: number;
}

export interface RegionUpdatePayload {
  name?: string;
  code?: string;
  name_code?: string;
  description?: string;
  description_code?: string;
  background_image?: string;
  logo?: string;
  status?: number;
  country_id?: number;
}

// District interfaces
export interface District {
  id: number;
  name: string;
  code: string;
  name_code: string;
  description: string;
  description_code: string;
  status: number;
  region_id: number;
  created_at: string;
  updated_at: string;
}

export interface DistrictCreatePayload {
  name: string;
  code: string;
  name_code: string;
  description?: string;
  description_code?: string;
  status: number;
  region_id: number;
}

export interface DistrictUpdatePayload {
  name?: string;
  code?: string;
  name_code?: string;
  description?: string;
  description_code?: string;
  status?: number;
  region_id?: number;
}

// Ward interfaces
export interface Ward {
  id: number;
  name: string;
  code: string;
  name_code: string;
  status: number;
  district_id: number;
  created_at: string;
  updated_at: string;
}

export interface WardCreatePayload {
  name: string;
  code: string;
  name_code: string;
  status: number;
  district_id: number;
}

export interface WardUpdatePayload {
  name?: string;
  code?: string;
  name_code?: string;
  status?: number;
  district_id?: number;
}

// Location Category interfaces
export interface LocationCategory {
  id: number;
  name: string;
  code: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface LocationCategoryCreatePayload {
  name: string;
  code: string;
  status: number;
}

export interface LocationCategoryUpdatePayload {
  name?: string;
  code?: string;
  status?: number;
}

// Location interface (for general locations/destinations)
export interface Location {
  id: number;
  name: string;
  slug?: string;
  description: string;
  country: string;
  region?: string;
  city?: string;
  latitude: number | string;
  longitude: number | string;
  imageUrl?: string;
  featuredImageUrl?: string;
  category?: string;
  status?: string;
  isFeatured?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Location Create/Update payloads
export interface LocationCreatePayload {
  name: string;
  slug?: string;
  description: string;
  country: string;
  region?: string;
  city?: string;
  latitude?: number | string;
  longitude?: number | string;
  imageUrl?: string;
  featuredImageUrl?: string;
  category?: string;
  status?: string;
  isFeatured?: boolean;
}

export interface LocationUpdatePayload {
  name?: string;
  slug?: string;
  description?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number | string;
  longitude?: number | string;
  imageUrl?: string;
  featuredImageUrl?: string;
  category?: string;
  status?: string;
  isFeatured?: boolean;
}

// Continent API calls
export const getContinents = async (page = 1, pageSize = 10, searchQuery?: string): Promise<ContinentPaginationResponse> => {
  const params: Record<string, any> = {
    page,
    limit: pageSize
  };

  if (searchQuery) {
    params.search = searchQuery;
  }

  const response = await apiClient.get(API_ENDPOINTS.locations.continents.list, { params });

  // Đảm bảo response đúng định dạng, nếu backend chưa trả về đúng cấu trúc
  if (Array.isArray(response.data)) {
    // Nếu API trả về một mảng đơn giản, chuyển đổi nó thành định dạng phân trang
    return {
      items: response.data,
      total: response.data.length, // Hoặc lấy từ response header nếu có
      page: page,
      limit: pageSize,
      totalPages: Math.ceil(response.data.length / pageSize)
    };
  }

  return response.data;
};

export const getContinentById = async (continentId: number): Promise<Continent> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.continents.detail(continentId));
  return response.data;
};

export const createContinent = async (payload: ContinentCreatePayload): Promise<Continent> => {
  const response = await apiClient.post(API_ENDPOINTS.locations.continents.list, payload);
  return response.data;
};

export const updateContinent = async (continentId: number, payload: ContinentUpdatePayload): Promise<Continent> => {
  const response = await apiClient.put(API_ENDPOINTS.locations.continents.detail(continentId), payload);
  return response.data;
};

export const deleteContinent = async (continentId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.locations.continents.detail(continentId));
};

// Country API calls
export const getCountries = async (page = 1, pageSize = 10, searchQuery?: string, continentId?: number): Promise<CountryPaginationResponse> => {
  const params: Record<string, any> = {
    page,
    limit: pageSize
  };

  if (searchQuery) {
    params.search = searchQuery;
  }

  if (continentId) {
    params.continent_id = continentId;
  }

  const response = await apiClient.get(API_ENDPOINTS.locations.countries.list, { params });

  // Đảm bảo response đúng định dạng, nếu backend chưa trả về đúng cấu trúc
  if (Array.isArray(response.data)) {
    // Nếu API trả về một mảng đơn giản, chuyển đổi nó thành định dạng phân trang
    return {
      items: response.data,
      total: response.data.length, // Hoặc lấy từ response header nếu có
      page: page,
      limit: pageSize,
      totalPages: Math.ceil(response.data.length / pageSize)
    };
  }

  return response.data;
};

export const getCountryById = async (countryId: number): Promise<Country> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.countries.detail(countryId));
  return response.data;
};

export const createCountry = async (payload: CountryCreatePayload): Promise<Country> => {
  const response = await apiClient.post(API_ENDPOINTS.locations.countries.list, payload);
  return response.data;
};

export const updateCountry = async (countryId: number, payload: CountryUpdatePayload): Promise<Country> => {
  const response = await apiClient.put(API_ENDPOINTS.locations.countries.detail(countryId), payload);
  return response.data;
};

export const deleteCountry = async (countryId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.locations.countries.detail(countryId));
};

// Region API calls
export const getRegions = async (page = 1, pageSize = 10, countryId?: number): Promise<RegionPaginationResponse> => {
  const params: Record<string, any> = {
    page,
    limit: pageSize
  };

  if (countryId) {
    params.country_id = countryId;
  }

  const response = await apiClient.get(API_ENDPOINTS.locations.regions.list, { params });

  // Đảm bảo response đúng định dạng, nếu backend chưa trả về đúng cấu trúc
  if (Array.isArray(response.data)) {
    // Nếu API trả về một mảng đơn giản, chuyển đổi nó thành định dạng phân trang
    return {
      items: response.data,
      total: response.data.length, // Hoặc lấy từ response header nếu có
      page: page,
      limit: pageSize,
      totalPages: Math.ceil(response.data.length / pageSize)
    };
  }

  return response.data;
};

export const getRegionById = async (regionId: number): Promise<Region> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.regions.detail(regionId));
  return response.data;
};

export const createRegion = async (payload: RegionCreatePayload): Promise<Region> => {
  const response = await apiClient.post(API_ENDPOINTS.locations.regions.list, payload);
  return response.data;
};

export const updateRegion = async (regionId: number, payload: RegionUpdatePayload): Promise<Region> => {
  const response = await apiClient.put(API_ENDPOINTS.locations.regions.detail(regionId), payload);
  return response.data;
};

export const deleteRegion = async (regionId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.locations.regions.detail(regionId));
};

// District API calls
export const getDistricts = async (skip = 0, limit = 100, regionId?: number): Promise<District[]> => {
  const params: Record<string, number> = { skip, limit };
  if (regionId) {
    params.region_id = regionId;
  }
  const response = await apiClient.get(API_ENDPOINTS.locations.districts.list, { params });
  return response.data;
};

export const getDistrictById = async (districtId: number): Promise<District> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.districts.detail(districtId));
  return response.data;
};

export const createDistrict = async (payload: DistrictCreatePayload): Promise<District> => {
  const response = await apiClient.post(API_ENDPOINTS.locations.districts.list, payload);
  return response.data;
};

export const updateDistrict = async (districtId: number, payload: DistrictUpdatePayload): Promise<District> => {
  const response = await apiClient.put(API_ENDPOINTS.locations.districts.detail(districtId), payload);
  return response.data;
};

export const deleteDistrict = async (districtId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.locations.districts.detail(districtId));
};

// Ward API calls
export const getWards = async (skip = 0, limit = 100, districtId?: number): Promise<Ward[]> => {
  const params: Record<string, number> = { skip, limit };
  if (districtId) {
    params.district_id = districtId;
  }
  const response = await apiClient.get(API_ENDPOINTS.locations.wards.list, { params });
  return response.data;
};

export const getWardById = async (wardId: number): Promise<Ward> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.wards.detail(wardId));
  return response.data;
};

export const createWard = async (payload: WardCreatePayload): Promise<Ward> => {
  const response = await apiClient.post(API_ENDPOINTS.locations.wards.list, payload);
  return response.data;
};

export const updateWard = async (wardId: number, payload: WardUpdatePayload): Promise<Ward> => {
  const response = await apiClient.put(API_ENDPOINTS.locations.wards.detail(wardId), payload);
  return response.data;
};

export const deleteWard = async (wardId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.locations.wards.detail(wardId));
};

// Location Category API calls
export const getLocationCategories = async (skip = 0, limit = 100): Promise<LocationCategory[]> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.categories.list, {
    params: { skip, limit },
  });
  return response.data;
};

export const getLocationCategoryById = async (categoryId: number): Promise<LocationCategory> => {
  const response = await apiClient.get(API_ENDPOINTS.locations.categories.detail(categoryId));
  return response.data;
};

export const createLocationCategory = async (payload: LocationCategoryCreatePayload): Promise<LocationCategory> => {
  const response = await apiClient.post(API_ENDPOINTS.locations.categories.list, payload);
  return response.data;
};

export const updateLocationCategory = async (
  categoryId: number,
  payload: LocationCategoryUpdatePayload
): Promise<LocationCategory> => {
  const response = await apiClient.put(API_ENDPOINTS.locations.categories.detail(categoryId), payload);
  return response.data;
};

export const deleteLocationCategory = async (categoryId: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.locations.categories.detail(categoryId));
};

// General Location CRUD operations
export const createLocation = async (payload: LocationCreatePayload): Promise<Location> => {
  const response = await apiClient.post('/api/v1/locations/', payload);
  return response.data;
};

export const updateLocation = async (locationId: number, payload: LocationUpdatePayload): Promise<Location> => {
  const response = await apiClient.put(`/api/v1/locations/${locationId}`, payload);
  return response.data;
};

export const deleteLocation = async (locationId: number): Promise<void> => {
  await apiClient.delete(`/api/v1/locations/${locationId}`);
};

export const getLocationById = async (locationId: number): Promise<Location> => {
  const response = await apiClient.get(`/api/v1/locations/${locationId}`);
  return response.data;
};
