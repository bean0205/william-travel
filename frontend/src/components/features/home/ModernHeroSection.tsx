import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Building, 
  Map, 
  Home,
  Globe,
  Compass
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface ModernHeroSectionProps {
  countryName: string;
  countryCode: string;
  countryDescription?: string;
}

// Các kiểu dữ liệu
interface LocationOption {
  id: string;
  name: string;
  code: string;
}

interface SlideImage {
  id: number;
  url: string;
  caption: string;
}

export const ModernHeroSection = ({ countryName, countryCode, countryDescription }: ModernHeroSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideChanging, setIsSlideChanging] = useState(false);
  const slideshowRef = useRef<HTMLDivElement>(null);
  
  // Các trạng thái cho location selector
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  const { t } = useTranslation(['home']);

  // Dữ liệu ảnh slide theo quốc gia
  const getSlidesByCountry = (code: string): SlideImage[] => {
    const defaultSlides = [
      { id: 1, url: 'https://source.unsplash.com/random/1920x1080/?travel,landscape', caption: 'Khám phá điểm đến mới' },
      { id: 2, url: 'https://source.unsplash.com/random/1920x1080/?city,travel', caption: 'Thành phố sôi động' },
      { id: 3, url: 'https://source.unsplash.com/random/1920x1080/?culture,travel', caption: 'Văn hóa độc đáo' },
    ];
    
    const slidesByCountry: Record<string, SlideImage[]> = {
  VN: [
    {
      id: 1,
      url: '../../../../public/images/halong_wal.jpg',
      caption: 'Vịnh Hạ Long - Di sản thiên nhiên thế giới',
    },
    {
      id: 2,
      url: '../../../../public/images/hanoi.jpg',
      caption: 'Hà Nội - Thủ đô ngàn năm văn hiến',
    },
    {
      id: 3,
      url: '../../../../public/images/hoian.jpg',
      caption: 'Hội An - Phố cổ đèn lồng',
    },
    {
      id: 4,
      url: '../../../../public/images/sapa.jpg',
      caption: 'Sapa - Ruộng bậc thang tuyệt đẹp',
    },
    {
      id: 5,
      url: '../../../../public/images/hagiang.jpg',
      caption: 'Đồng bằng sông Cửu Long - Miền sông nước',
    },
  ],
  JP: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c',
      caption: 'Tokyo - Thành phố không ngủ',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1554188248-986adbb73f5b',
      caption: 'Kyoto - Cố đô thanh bình',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      caption: 'Núi Phú Sĩ - Biểu tượng của Nhật Bản',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1578898887893-7b4f1a1c1c1c',
      caption: 'Osaka - Thiên đường ẩm thực',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1586769852836-4b8b1d1a1c1c',
      caption: 'Okinawa - Thiên đường biển xanh',
    },
  ],
  TH: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1549887534-1f1b7c5f0c5b',
      caption: 'Bangkok - Thành phố của những ngôi đền',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      caption: 'Phuket - Thiên đường biển',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1598935886643-3e5b4f1a1c1c',
      caption: 'Chiang Mai - Văn hóa phương bắc',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1586769852836-4b8b1d1a1c1c',
      caption: 'Ayutthaya - Di sản lịch sử',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      caption: 'Koh Samui - Đảo thiên đường',
    },
  ],
  SG: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1549887534-1f1b7c5f0c5b',
      caption: 'Marina Bay Sands - Biểu tượng Singapore',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      caption: 'Sentosa - Đảo giải trí',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1598935886643-3e5b4f1a1c1c',
      caption: 'Gardens by the Bay - Kỳ quan kiến trúc',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1586769852836-4b8b1d1a1c1c',
      caption: 'Merlion Park - Biểu tượng của Đảo quốc Sư tử',
    },
  ],
  KR: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c',
      caption: 'Seoul - Thành phố năng động',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1554188248-986adbb73f5b',
      caption: 'Đảo Jeju - Thiên đường nghỉ dưỡng',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      caption: 'Busan - Thành phố biển',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1578898887893-7b4f1a1c1c1c',
      caption: 'Gyeongju - Di sản lịch sử',
    },
  ],
  US: [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1549887534-1f1b7c5f0c5b',
      caption: 'New York - Thành phố không bao giờ ngủ',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      caption: 'San Francisco - Cầu Cổng Vàng',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1598935886643-3e5b4f1a1c1c',
      caption: 'Las Vegas - Thiên đường giải trí',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1586769852836-4b8b1d1a1c1c',
      caption: 'Grand Canyon - Kỳ quan thiên nhiên',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      caption: 'Hawaii - Thiên đường nhiệt đới',
    },
  ],
};

    
    return slidesByCountry[code] || defaultSlides;
  };
  
  const slides = getSlidesByCountry(countryCode);
  
  // Chuyển slide tự động
  useEffect(() => {
    const nextSlideAuto = () => {
      setIsSlideChanging(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setIsSlideChanging(false);
      }, 500); // Transition duration
    };
    
    const interval = setInterval(() => {
      nextSlideAuto();
    }, 6000); // Longer display time for each slide
    
    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);
  
  // Lấy dữ liệu các tỉnh/thành phố
  useEffect(() => {
    // Mô phỏng API call để lấy danh sách tỉnh thành
    const fetchProvinces = async () => {
      // Trong thực tế, đây sẽ là một API call
      setTimeout(() => {
        // Mock data with more realistic provinces based on selected country
        let mockProvinces: LocationOption[] = [];
        
        if (countryCode === 'VN') {
          mockProvinces = [
            { id: '01', name: 'Hà Nội', code: 'HN' },
            { id: '02', name: 'TP. Hồ Chí Minh', code: 'HCM' },
            { id: '03', name: 'Đà Nẵng', code: 'DN' },
            { id: '04', name: 'Hải Phòng', code: 'HP' },
            { id: '05', name: 'Cần Thơ', code: 'CT' },
            { id: '06', name: 'Khánh Hòa', code: 'KH' },
            { id: '07', name: 'Lâm Đồng', code: 'LD' },
            { id: '08', name: 'Quảng Ninh', code: 'QN' },
          ];
        } else if (countryCode === 'JP') {
          mockProvinces = [
            { id: '01', name: 'Tokyo', code: 'TK' },
            { id: '02', name: 'Kyoto', code: 'KY' },
            { id: '03', name: 'Osaka', code: 'OS' },
            { id: '04', name: 'Hokkaido', code: 'HK' },
            { id: '05', name: 'Okinawa', code: 'OK' },
          ];
        } else if (countryCode === 'TH') {
          mockProvinces = [
            { id: '01', name: 'Bangkok', code: 'BK' },
            { id: '02', name: 'Chiang Mai', code: 'CM' },
            { id: '03', name: 'Phuket', code: 'PK' },
            { id: '04', name: 'Pattaya', code: 'PT' },
            { id: '05', name: 'Krabi', code: 'KB' },
          ];
        } else if (countryCode === 'SG') {
          mockProvinces = [
            { id: '01', name: 'Central Region', code: 'CR' },
            { id: '02', name: 'East Region', code: 'ER' },
            { id: '03', name: 'North Region', code: 'NR' },
            { id: '04', name: 'North-East Region', code: 'NER' },
            { id: '05', name: 'West Region', code: 'WR' },
          ];
        } else {
          // Default provinces for other countries
          mockProvinces = [
            { id: '01', name: 'Province 1', code: 'P1' },
            { id: '02', name: 'Province 2', code: 'P2' },
            { id: '03', name: 'Province 3', code: 'P3' },
            { id: '04', name: 'Province 4', code: 'P4' },
            { id: '05', name: 'Province 5', code: 'P5' },
          ];
        }
        
        setProvinces(mockProvinces);
      }, 500);
    };
    
    fetchProvinces();
  }, [countryCode]);
  
  // Lấy dữ liệu quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      return;
    }
    
    // Mô phỏng API call để lấy danh sách quận/huyện
    const fetchDistricts = async () => {
      setTimeout(() => {
        let mockDistricts: LocationOption[] = [];
        
        // Mapping for districts based on province IDs - for Vietnam
        const districtsByProvince: Record<string, LocationOption[]> = {
          // Hanoi districts
          '01': [
            { id: 'd01', name: 'Ba Đình', code: 'BD' },
            { id: 'd02', name: 'Hoàn Kiếm', code: 'HK' },
            { id: 'd03', name: 'Tây Hồ', code: 'TH' },
            { id: 'd04', name: 'Long Biên', code: 'LB' },
            { id: 'd05', name: 'Cầu Giấy', code: 'CG' },
            { id: 'd06', name: 'Đống Đa', code: 'DD' },
            { id: 'd07', name: 'Hai Bà Trưng', code: 'HBT' },
          ],
          // Ho Chi Minh City districts
          '02': [
            { id: 'd01', name: 'Quận 1', code: 'Q1' },
            { id: 'd02', name: 'Quận 3', code: 'Q3' },
            { id: 'd03', name: 'Quận 4', code: 'Q4' },
            { id: 'd04', name: 'Quận 5', code: 'Q5' },
            { id: 'd05', name: 'Quận 7', code: 'Q7' },
            { id: 'd06', name: 'Bình Thạnh', code: 'BT' },
            { id: 'd07', name: 'Phú Nhuận', code: 'PN' },
          ],
          // Da Nang districts
          '03': [
            { id: 'd01', name: 'Hải Châu', code: 'HC' },
            { id: 'd02', name: 'Thanh Khê', code: 'TK' },
            { id: 'd03', name: 'Sơn Trà', code: 'ST' },
            { id: 'd04', name: 'Ngũ Hành Sơn', code: 'NHS' },
            { id: 'd05', name: 'Liên Chiểu', code: 'LC' },
          ],
          // Hai Phong districts
          '04': [
            { id: 'd01', name: 'Hồng Bàng', code: 'HB' },
            { id: 'd02', name: 'Ngô Quyền', code: 'NQ' },
            { id: 'd03', name: 'Lê Chân', code: 'LC' },
            { id: 'd04', name: 'Kiến An', code: 'KA' },
          ],
          // Can Tho districts
          '05': [
            { id: 'd01', name: 'Ninh Kiều', code: 'NK' },
            { id: 'd02', name: 'Bình Thủy', code: 'BT' },
            { id: 'd03', name: 'Cái Răng', code: 'CR' },
            { id: 'd04', name: 'Ô Môn', code: 'OM' },
          ],
          // Khanh Hoa districts
          '06': [
            { id: 'd01', name: 'Nha Trang', code: 'NT' },
            { id: 'd02', name: 'Cam Ranh', code: 'CR' },
            { id: 'd03', name: 'Ninh Hòa', code: 'NH' },
            { id: 'd04', name: 'Vạn Ninh', code: 'VN' },
          ],
          // Lam Dong districts
          '07': [
            { id: 'd01', name: 'Đà Lạt', code: 'DL' },
            { id: 'd02', name: 'Bảo Lộc', code: 'BL' },
            { id: 'd03', name: 'Đức Trọng', code: 'DT' },
            { id: 'd04', name: 'Lâm Hà', code: 'LH' },
          ],
          // Quang Ninh districts
          '08': [
            { id: 'd01', name: 'Hạ Long', code: 'HL' },
            { id: 'd02', name: 'Cẩm Phả', code: 'CP' },
            { id: 'd03', name: 'Uông Bí', code: 'UB' },
            { id: 'd04', name: 'Móng Cái', code: 'MC' },
          ],
        };
        
        // For other countries or default
        const defaultDistricts = [
          { id: 'd01', name: 'District 1', code: 'D1' },
          { id: 'd02', name: 'District 2', code: 'D2' },
          { id: 'd03', name: 'District 3', code: 'D3' },
          { id: 'd04', name: 'District 4', code: 'D4' },
        ];
        
        // Get districts for the selected province
        mockDistricts = districtsByProvince[selectedProvince] || defaultDistricts;
        
        setDistricts(mockDistricts);
      }, 300);
    };
    
    fetchDistricts();
  }, [selectedProvince]);
  
  // Lấy dữ liệu phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      return;
    }
    
    // Mô phỏng API call để lấy danh sách phường/xã
    const fetchWards = async () => {
      setTimeout(() => {
        // Sample wards for districts in Vietnam
        const wardsByDistrict: Record<string, LocationOption[]> = {
          // District 1 (Quận 1) wards
          'd01': [
            { id: 'w01', name: 'Phường Bến Nghé', code: 'BN' },
            { id: 'w02', name: 'Phường Bến Thành', code: 'BT' },
            { id: 'w03', name: 'Phường Đa Kao', code: 'DK' },
            { id: 'w04', name: 'Phường Cầu Kho', code: 'CK' },
            { id: 'w05', name: 'Phường Cầu Ông Lãnh', code: 'COL' },
          ],
          // District 3 (Quận 3) wards
          'd02': [
            { id: 'w01', name: 'Phường 1', code: 'P1' },
            { id: 'w02', name: 'Phường 2', code: 'P2' },
            { id: 'w03', name: 'Phường 3', code: 'P3' },
            { id: 'w04', name: 'Phường 4', code: 'P4' },
            { id: 'w05', name: 'Phường 5', code: 'P5' },
          ],
          // District 4 (Quận 4) wards
          'd03': [
            { id: 'w01', name: 'Phường 1', code: 'P1' },
            { id: 'w02', name: 'Phường 2', code: 'P2' },
            { id: 'w03', name: 'Phường 3', code: 'P3' },
            { id: 'w04', name: 'Phường 4', code: 'P4' },
          ],
          // Default wards for other districts
          'd04': [
            { id: 'w01', name: 'Phường A', code: 'PA' },
            { id: 'w02', name: 'Phường B', code: 'PB' },
            { id: 'w03', name: 'Phường C', code: 'PC' },
            { id: 'w04', name: 'Phường D', code: 'PD' },
          ],
        };
        
        // Default wards
        const defaultWards = [
          { id: 'w01', name: 'Ward 1', code: 'W1' },
          { id: 'w02', name: 'Ward 2', code: 'W2' },
          { id: 'w03', name: 'Ward 3', code: 'W3' },
          { id: 'w04', name: 'Ward 4', code: 'W4' },
        ];
        
        // Get wards for the selected district
        const mockWards = wardsByDistrict[selectedDistrict] || defaultWards;
        
        setWards(mockWards);
      }, 300);
    };
    
    fetchWards();
  }, [selectedDistrict]);
  
  // Xử lý chuyển slide
  const nextSlide = () => {
    setIsSlideChanging(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setIsSlideChanging(false);
    }, 500); // Match transition duration with auto slideshow
  };
  
  const prevSlide = () => {
    setIsSlideChanging(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsSlideChanging(false);
    }, 500); // Match transition duration with auto slideshow
  };
  
  // Xử lý khi chọn địa điểm
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setSelectedWard('');
  };
  
  // Popular destinations by country
  const getPopularDestinations = (countryCode: string): string[] => {
    const destinations: Record<string, string[]> = {
      'VN': ['Đà Lạt', 'Vịnh Hạ Long', 'Phú Quốc', 'Hội An', 'Sapa', 'Huế', 'Nha Trang'],
      'JP': ['Tokyo', 'Kyoto', 'Osaka', 'Hokkaido', 'Okinawa', 'Hiroshima', 'Nara'],
      'TH': ['Bangkok', 'Phuket', 'Chiang Mai', 'Koh Samui', 'Pattaya', 'Krabi', 'Ayutthaya'],
      'SG': ['Marina Bay', 'Sentosa', 'Gardens by the Bay', 'Orchard Road', 'Chinatown', 'Little India'],
      'KR': ['Seoul', 'Busan', 'Jeju Island', 'Gyeongju', 'Incheon', 'Gangneung', 'Jeonju'],
      'US': ['New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami', 'Chicago', 'Hawaii'],
    };
    
    return destinations[countryCode] || ['Đà Lạt', 'Vịnh Hạ Long', 'Phú Quốc', 'Hội An'];
  };
  
  const popularDestinations = getPopularDestinations(countryCode);
  
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard('');
  };
  
  const handleWardChange = (value: string) => {
    setSelectedWard(value);
  };
  
  // Xử lý tìm kiếm
  const handleSearch = () => {
    // Xử lý tìm kiếm ở đây
    // Log: searchTerm
  };

  return (
    <section className="relative">
      {/* Slide show */}
      <div ref={slideshowRef} className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            } ${isSlideChanging ? 'scale-105' : 'scale-100'}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background"></div>
          </div>
        ))}
        
        {/* Slide navigation */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125 w-5 md:w-6' : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Slide controls */}
        <button 
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20 backdrop-blur-sm transition-all hover:scale-110"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
        
        <button 
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20 backdrop-blur-sm transition-all hover:scale-110"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>
        
        {/* Slide caption */}
        <div className="absolute bottom-32 md:bottom-40 left-1/2 transform -translate-x-1/2 text-center text-white text-sm md:text-xl font-medium z-20 bg-black/20 px-4 md:px-6 py-2 md:py-3 rounded-full backdrop-blur-sm transition-all duration-300 max-w-[90%] md:max-w-[80%]">
          {slides[currentSlide]?.caption}
        </div>
      </div>
      
      {/* Search and Location Selector */}
      <div className="relative -mt-24 md:-mt-32 z-40 container mx-auto px-4 pb-12">
        <Card className="bg-white/95 dark:bg-black/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Thanh tìm kiếm */}
              <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 md:col-span-1">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
                  <Search className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary" />
                  {t('home:hero.searchDestination')}
                </h2>
                <div className="space-y-3 md:space-y-4">
                  <div className="relative">
                    <Input
                      className="pr-10 border-primary/30 focus:border-primary dark:bg-black/40 dark:placeholder:text-gray-400 text-sm md:text-base"
                      placeholder={t('home:hero.locationsIn', { countryName })}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button 
                      size="icon" 
                      className="absolute right-0 top-0 h-full rounded-l-none bg-primary hover:bg-primary/90"
                      onClick={handleSearch}
                    >
                      <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                    </Button>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1.5 md:mb-2">{t('home:hero.popularDestinations')}</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {popularDestinations.slice(0, 4).map((destination, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary/10 bg-primary/5 text-xs md:text-sm"
                          onClick={() => setSearchTerm(destination)}
                        >
                          {destination}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chọn địa điểm */}
              <div className="p-4 md:p-6 md:col-span-2">
                <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-primary" />
                  {t('home:hero.selectExactLocation')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  {/* Tỉnh/Thành phố */}
                  <div>
                    <div className="flex items-center mb-1 md:mb-2 text-xs md:text-sm font-medium text-muted-foreground">
                      <Building className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>{t('home:hero.province')}</span>
                    </div>
                    <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                      <SelectTrigger className="bg-white dark:bg-black/40 h-8 md:h-10 text-xs md:text-sm">
                        <SelectValue placeholder={t('home:hero.chooseProvince')} />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.id} className="text-xs md:text-sm">
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Quận/Huyện */}
                  <div>
                    <div className="flex items-center mb-1 md:mb-2 text-xs md:text-sm font-medium text-muted-foreground">
                      <Map className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>{t('home:hero.district')}</span>
                    </div>
                    <Select 
                      value={selectedDistrict} 
                      onValueChange={handleDistrictChange}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger className="bg-white dark:bg-black/40 h-8 md:h-10 text-xs md:text-sm">
                        <SelectValue placeholder={t('home:hero.chooseDistrict')} />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id} className="text-xs md:text-sm">
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Phường/Xã */}
                  <div>
                    <div className="flex items-center mb-1 md:mb-2 text-xs md:text-sm font-medium text-muted-foreground">
                      <Home className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      <span>{t('home:hero.ward')}</span>
                    </div>
                    <Select 
                      value={selectedWard} 
                      onValueChange={handleWardChange}
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger className="bg-white dark:bg-black/40 h-8 md:h-10 text-xs md:text-sm">
                        <SelectValue placeholder={t('home:hero.chooseWard')} />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.id} value={ward.id} className="text-xs md:text-sm">
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Button tìm kiếm */}
                <div className="mt-4 md:mt-6 flex justify-end">
                  <Button 
                    className="
                      bg-gradient-to-r from-blue-600 to-blue-500 
                      hover:from-blue-500 hover:to-blue-600 
                      text-white gap-1 md:gap-2 
                      shadow transition-all hover:shadow-md 
                      text-xs md:text-sm h-8 md:h-10
                      border-0
                    "
                    disabled={!selectedProvince}
                  >
                    {t('home:hero.explore')} {selectedWard ?
                      t('home:hero.exploreSelectedLocation', { location: 'địa điểm đã chọn' }) :
                      selectedDistrict ?
                      t('home:hero.exploreSelectedLocation', { location: 'khu vực đã chọn' }) :
                      selectedProvince ?
                      t('home:hero.exploreSelectedLocation', { location: 'tỉnh/thành phố đã chọn' }) :
                      countryName}
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
