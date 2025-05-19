interface ApiLocation {
  code: string;
  name: string;
  division_type: string;
  codename: string;
  province_code?: string;
  district_code?: string;
}

const BASE_URL = 'https://provinces.open-api.vn/api';

export const locationApi = {
  getProvinces: async () => {
    const response = await fetch(`${BASE_URL}/p/`);
    const data: ApiLocation[] = await response.json();
    return data.map(province => ({
      id: province.code,
      name: province.name,
      code: province.code
    }));
  },

  getDistricts: async (provinceCode: string) => {
    const response = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
    const data = await response.json();
    return data.districts.map((district: ApiLocation) => ({
      id: district.code,
      name: district.name,
      code: district.code
    }));
  },

  getWards: async (districtCode: string) => {
    const response = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`);
    const data = await response.json();
    return data.wards.map((ward: ApiLocation) => ({
      id: ward.code,
      name: ward.name,
      code: ward.code
    }));
  }
};
