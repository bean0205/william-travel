import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Country {
  code: string;
  name: string;
  flagUrl: string;
  description?: string;
}

interface CountryState {
  countries: Country[];
  selectedCountry: Country | null;
  isCountrySelected: boolean;
  setSelectedCountry: (country: Country) => void;
  resetSelectedCountry: () => void;
  getCountryByCode: (code: string) => Country | undefined;
}

// Sample list of countries - in a real app, you might fetch this from an API
const availableCountries: Country[] = [
  // Asia
  {
    code: 'VN',
    name: 'Vietnam',
    flagUrl: '/flags/vn.svg',
    description: 'Discover Vietnam\'s rich heritage, stunning landscapes, and vibrant culture.'
  },
  {
    code: 'JP',
    name: 'Japan',
    flagUrl: '/flags/jp.svg',
    description: 'Experience Japan\'s unique blend of ancient traditions and cutting-edge modernity.'
  },
  {
    code: 'KR',
    name: 'South Korea',
    flagUrl: '/flags/kr.svg',
    description: 'Immerse yourself in South Korea\'s fascinating culture, cuisine, and breathtaking scenery.'
  },
  {
    code: 'SG',
    name: 'Singapore',
    flagUrl: '/flags/sg.svg',
    description: 'Discover the vibrant city-state that blends diverse cultures and futuristic attractions.'
  },
  {
    code: 'TH',
    name: 'Thailand',
    flagUrl: '/flags/th.svg',
    description: 'Explore Thailand\'s tropical beaches, ancient temples, and world-famous cuisine.'
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flagUrl: '/flags/my.svg',
    description: 'Experience Malaysia\'s diverse culture, stunning rainforests, and beautiful islands.'
  },
  {
    code: 'ID',
    name: 'Indonesia',
    flagUrl: '/flags/id.svg',
    description: 'Explore the archipelago\'s incredible diversity of cultures, landscapes, and experiences.'
  },
  {
    code: 'CN',
    name: 'China',
    flagUrl: '/flags/cn.svg',
    description: 'Immerse yourself in China\'s ancient history, breathtaking landscapes, and dynamic cities.'
  },
  {
    code: 'IN',
    name: 'India',
    flagUrl: '/flags/in.svg',
    description: 'Discover India\'s rich cultural tapestry, ancient monuments, and diverse landscapes.'
  },
  {
    code: 'PH',
    name: 'Philippines',
    flagUrl: '/flags/ph.svg',
    description: 'Explore over 7,000 tropical islands with stunning beaches, volcanoes, and vibrant local culture.'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flagUrl: '/flags/ae.svg',
    description: 'Experience luxurious modernity alongside traditional Bedouin culture in this desert nation.'
  },

  // Europe
  {
    code: 'GB',
    name: 'United Kingdom',
    flagUrl: '/flags/gb.svg',
    description: 'Explore historic castles, charming countryside, and vibrant cities across the British Isles.'
  },
  {
    code: 'FR',
    name: 'France',
    flagUrl: '/flags/fr.svg',
    description: 'Discover world-class cuisine, art, fashion, and iconic landmarks in the heart of Europe.'
  },
  {
    code: 'IT',
    name: 'Italy',
    flagUrl: '/flags/it.svg',
    description: 'Experience ancient history, Renaissance art, and incredible cuisine in this Mediterranean gem.'
  },
  {
    code: 'ES',
    name: 'Spain',
    flagUrl: '/flags/es.svg',
    description: 'Immerse yourself in lively culture, stunning architecture, and beautiful beaches.'
  },
  {
    code: 'DE',
    name: 'Germany',
    flagUrl: '/flags/de.svg',
    description: 'Explore picturesque villages, historic cities, and stunning alpine landscapes.'
  },
  {
    code: 'PT',
    name: 'Portugal',
    flagUrl: '/flags/pt.svg',
    description: 'Discover charming coastal towns, historic architecture, and delicious cuisine.'
  },
  {
    code: 'GR',
    name: 'Greece',
    flagUrl: '/flags/gr.svg',
    description: 'Experience ancient ruins, stunning islands, and Mediterranean hospitality.'
  },

  // North America
  {
    code: 'US',
    name: 'United States',
    flagUrl: '/flags/us.svg',
    description: 'Explore the vast diversity of landscapes, cities, and attractions across America.'
  },
  {
    code: 'CA',
    name: 'Canada',
    flagUrl: '/flags/ca.svg',
    description: 'Explore stunning natural landscapes, cosmopolitan cities, and friendly local culture.'
  },
  {
    code: 'MX',
    name: 'Mexico',
    flagUrl: '/flags/mx.svg',
    description: 'Discover ancient ruins, vibrant culture, and beautiful beaches in this diverse nation.'
  },
  {
    code: 'CR',
    name: 'Costa Rica',
    flagUrl: '/flags/cr.svg',
    description: 'Experience incredible biodiversity, rainforests, and beautiful beaches in this eco-friendly paradise.'
  },

  // South America
  {
    code: 'BR',
    name: 'Brazil',
    flagUrl: '/flags/br.svg',
    description: 'Explore the Amazon rainforest, vibrant cities, and stunning beaches in South America\'s largest country.'
  },
  {
    code: 'AR',
    name: 'Argentina',
    flagUrl: '/flags/ar.svg',
    description: 'Discover diverse landscapes from Patagonian glaciers to the vibrant streets of Buenos Aires.'
  },
  {
    code: 'PE',
    name: 'Peru',
    flagUrl: '/flags/pe.svg',
    description: 'Experience ancient Incan ruins, the Amazon rainforest, and vibrant indigenous cultures.'
  },
  {
    code: 'CO',
    name: 'Colombia',
    flagUrl: '/flags/co.svg',
    description: 'Discover lush rainforests, colonial architecture, and warm hospitality in this diverse nation.'
  },

  // Africa
  {
    code: 'ZA',
    name: 'South Africa',
    flagUrl: '/flags/za.svg',
    description: 'Experience incredible wildlife, diverse landscapes, and rich cultural heritage.'
  },
  {
    code: 'MA',
    name: 'Morocco',
    flagUrl: '/flags/ma.svg',
    description: 'Explore ancient medinas, desert landscapes, and vibrant markets in this North African gem.'
  },
  {
    code: 'EG',
    name: 'Egypt',
    flagUrl: '/flags/eg.svg',
    description: 'Discover ancient pyramids, temples, and the stunning Nile River in this historic nation.'
  },
  {
    code: 'KE',
    name: 'Kenya',
    flagUrl: '/flags/ke.svg',
    description: 'Experience incredible wildlife safaris, diverse landscapes, and rich tribal cultures.'
  },

  // Oceania
  {
    code: 'AU',
    name: 'Australia',
    flagUrl: '/flags/au.svg',
    description: 'Explore stunning beaches, unique wildlife, and vibrant cities in this diverse island continent.'
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flagUrl: '/flags/nz.svg',
    description: 'Discover breathtaking landscapes from mountains to fjords in this adventure paradise.'
  },
  {
    code: 'FJ',
    name: 'Fiji',
    flagUrl: '/flags/fj.svg',
    description: 'Experience tropical paradise with stunning beaches, coral reefs, and friendly local culture.'
  }
];

export const useCountryStore = create<CountryState>()(
  devtools(
    persist(
      (set, get) => ({
        countries: availableCountries,
        selectedCountry: null,
        isCountrySelected: false,

        setSelectedCountry: (country) =>
          set({ selectedCountry: country, isCountrySelected: true }),

        resetSelectedCountry: () =>
          set({ selectedCountry: null, isCountrySelected: false }),

        getCountryByCode: (code) => {
          return get().countries.find(country => country.code === code);
        }
      }),
      {
        name: 'country-storage',
      }
    )
  )
);
