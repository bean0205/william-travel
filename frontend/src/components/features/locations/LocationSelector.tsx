import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  MapPin,
  ChevronRight,
  Compass,
  Building,
  Navigation,
  Home,
  Map,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Location {
  id: string;
  name: string;
  code: string;
}

interface LocationSelectorProps {
  onLocationChange: (location: {
    province?: Location;
    district?: Location;
    ward?: Location;
  }) => void;
  className?: string;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'compact' | 'modern';
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  onConfirm?: () => void;
}

export const LocationSelector = ({
  onLocationChange,
  className = '',
  title = 'Choose Location',
  subtitle = 'Select your desired destination',
  variant = 'modern',
  showConfirmButton = false,
  confirmButtonText = 'Confirm Location',
  onConfirm,
}: LocationSelectorProps) => {
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Location | null>(null);
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading((prev) => ({ ...prev, provinces: true }));
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(
          data.map((p: any) => ({
            id: p.code,
            name: p.name,
            code: p.code,
          }))
        );
        setError(null);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Failed to load provinces');
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          setLoading((prev) => ({ ...prev, districts: true }));
          const response = await fetch(
            `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
          );
          const data = await response.json();
          setDistricts(
            data.districts.map((d: any) => ({
              id: d.code,
              name: d.name,
              code: d.code,
            }))
          );
          setError(null);
        } catch (err) {
          console.error('Error fetching districts:', err);
          setError('Failed to load districts');
        } finally {
          setLoading((prev) => ({ ...prev, districts: false }));
        }
      };
      fetchDistricts();
      setSelectedDistrict(null);
      setSelectedWard(null);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          setLoading((prev) => ({ ...prev, wards: true }));
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
          );
          const data = await response.json();
          setWards(
            data.wards.map((w: any) => ({
              id: w.code,
              name: w.name,
              code: w.code,
            }))
          );
          setError(null);
        } catch (err) {
          console.error('Error fetching wards:', err);
          setError('Failed to load wards');
        } finally {
          setLoading((prev) => ({ ...prev, wards: false }));
        }
      };
      fetchWards();
      setSelectedWard(null);
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  // Notify parent component of changes
  useEffect(() => {
    onLocationChange({
      province: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      ward: selectedWard || undefined,
    });
  }, [selectedProvince, selectedDistrict, selectedWard, onLocationChange]);
  // Location summary display
  const hasSelectedLocation =
    selectedProvince || selectedDistrict || selectedWard;

  // Generate class names based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'p-3';
      case 'modern':
        return 'bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm';
      default:
        return '';
    }
  };

  // Function to handle confirmation
  const handleConfirm = () => {
    if (onConfirm && hasSelectedLocation) {
      onConfirm();
    }
  };

  // Render based on variant
  if (variant === 'modern') {
    return (
      <Card className={`overflow-hidden ${getVariantClasses()} ${className}`}>
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Compass className="text-primary h-5 w-5" />
                {title}
              </CardTitle>
              <CardDescription className="mt-1">{subtitle}</CardDescription>
            </div>
            {hasSelectedLocation && (
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {
                  [
                    selectedProvince?.name,
                    selectedDistrict?.name,
                    selectedWard?.name,
                  ].filter(Boolean).length
                }{' '}
                Selected
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-5">
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full">
                  <Building className="text-primary h-4 w-4" />
                </div>
                <Label className="text-sm font-medium">Province/City</Label>
              </div>
              <div className="mt-2">
                <Select
                  disabled={loading.provinces}
                  value={selectedProvince?.code}
                  onValueChange={(value) => {
                    const province = provinces.find((p) => p.code === value);
                    setSelectedProvince(province || null);
                  }}
                >
                  <SelectTrigger className="border-primary/20 w-full bg-white/50 backdrop-blur-sm dark:bg-black/20">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Provinces</SelectLabel>
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {loading.provinces && (
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center pt-2">
                    <Loader2 className="text-primary h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full">
                  <Map className="text-primary h-4 w-4" />
                </div>
                <Label className="text-sm font-medium">District</Label>
              </div>
              <div className="mt-2">
                <Select
                  disabled={!selectedProvince || loading.districts}
                  value={selectedDistrict?.code}
                  onValueChange={(value) => {
                    const district = districts.find((d) => d.code === value);
                    setSelectedDistrict(district || null);
                  }}
                >
                  <SelectTrigger className="border-primary/20 w-full bg-white/50 backdrop-blur-sm dark:bg-black/20">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Districts</SelectLabel>
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {loading.districts && (
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center pt-2">
                    <Loader2 className="text-primary h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-full">
                  <Home className="text-primary h-4 w-4" />
                </div>
                <Label className="text-sm font-medium">Ward</Label>
              </div>
              <div className="mt-2">
                <Select
                  disabled={!selectedDistrict || loading.wards}
                  value={selectedWard?.code}
                  onValueChange={(value) => {
                    const ward = wards.find((w) => w.code === value);
                    setSelectedWard(ward || null);
                  }}
                >
                  <SelectTrigger className="border-primary/20 w-full bg-white/50 backdrop-blur-sm dark:bg-black/20">
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Wards</SelectLabel>
                      {wards.map((ward) => (
                        <SelectItem key={ward.code} value={ward.code}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {loading.wards && (
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center pt-2">
                    <Loader2 className="text-primary h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {showConfirmButton && (
            <Button
              onClick={handleConfirm}
              disabled={!hasSelectedLocation}
              className="mt-4 w-full gap-1"
            >
              {confirmButtonText}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {hasSelectedLocation && (
            <div className="bg-primary/5 mt-4 rounded-lg p-3">
              <h4 className="mb-2 text-sm font-medium">Selected Location</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProvince && (
                  <Badge variant="outline" className="bg-primary/10 gap-1">
                    <Building className="h-3 w-3" />
                    {selectedProvince.name}
                  </Badge>
                )}
                {selectedDistrict && (
                  <Badge variant="outline" className="bg-primary/10 gap-1">
                    <Map className="h-3 w-3" />
                    {selectedDistrict.name}
                  </Badge>
                )}
                {selectedWard && (
                  <Badge variant="outline" className="bg-primary/10 gap-1">
                    <Home className="h-3 w-3" />
                    {selectedWard.name}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default or compact variant
  return (
    <Card className={`shadow-sm ${getVariantClasses()} ${className}`}>
      <CardContent className="space-y-4 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-medium">
            <MapPin className="text-primary h-4 w-4" />
            {title}
          </h3>

          {hasSelectedLocation && (
            <div className="flex flex-wrap justify-end gap-1.5">
              {selectedProvince && (
                <Badge variant="outline" className="bg-primary/10">
                  {selectedProvince.name}
                </Badge>
              )}
              {selectedDistrict && (
                <Badge variant="outline" className="bg-primary/10">
                  {selectedDistrict.name}
                </Badge>
              )}
              {selectedWard && (
                <Badge variant="outline" className="bg-primary/10">
                  {selectedWard.name}
                </Badge>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Province/City</Label>
            <Select
              disabled={loading.provinces}
              value={selectedProvince?.code}
              onValueChange={(value) => {
                const province = provinces.find((p) => p.code === value);
                setSelectedProvince(province || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Provinces</SelectLabel>
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {loading.provinces && (
              <div className="flex items-center justify-center pt-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">District</Label>
            <Select
              disabled={!selectedProvince || loading.districts}
              value={selectedDistrict?.code}
              onValueChange={(value) => {
                const district = districts.find((d) => d.code === value);
                setSelectedDistrict(district || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Districts</SelectLabel>
                  {districts.map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {loading.districts && (
              <div className="flex items-center justify-center pt-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Ward</Label>
            <Select
              disabled={!selectedDistrict || loading.wards}
              value={selectedWard?.code}
              onValueChange={(value) => {
                const ward = wards.find((w) => w.code === value);
                setSelectedWard(ward || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Wards</SelectLabel>
                  {wards.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {loading.wards && (
              <div className="flex items-center justify-center pt-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {showConfirmButton && (
          <Button
            onClick={handleConfirm}
            disabled={!hasSelectedLocation}
            className="mt-4 w-full gap-1"
          >
            {confirmButtonText}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
