// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/components/admin/LocationForm.tsx
import React, { useState, useEffect } from 'react';
import { Location } from '@/services/api/locationService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface LocationFormProps {
  location?: Partial<Location>;
  onSubmit: (locationData: Partial<Location>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  name?: string;
  country?: string;
  description?: string;
}

const LocationForm: React.FC<LocationFormProps> = ({ location, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    slug: '',
    country: '',
    region: '',
    city: '',
    description: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
    featuredImageUrl: '',
    isFeatured: false,
    status: 'active',
    metaTitle: '',
    metaDescription: '',
    ...location,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (location) {
      setFormData({
        ...location,
      });
    }
  }, [location]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="leave-empty-for-auto-generation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            name="country"
            value={formData.country || ''}
            onChange={handleChange}
            className={errors.country ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input
            id="region"
            name="region"
            value={formData.region || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={formData.status || 'active'}
            onValueChange={(value) => handleSelectChange('status', value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className={`min-h-[150px] ${errors.description ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            disabled={loading}
            type="text"
            placeholder="e.g. 21.0278"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            disabled={loading}
            type="text"
            placeholder="e.g. 105.8342"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Main Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="featuredImageUrl">Featured Image URL</Label>
          <Input
            id="featuredImageUrl"
            name="featuredImageUrl"
            value={formData.featuredImageUrl || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">SEO Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            value={formData.metaTitle || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">SEO Meta Description</Label>
          <Input
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFeatured"
          checked={formData.isFeatured || false}
          onCheckedChange={(checked) => handleCheckboxChange('isFeatured', checked === true)}
          disabled={loading}
        />
        <Label htmlFor="isFeatured">Featured Location</Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : location ? 'Update Location' : 'Create Location'}
        </Button>
      </div>
    </form>
  );
};

export default LocationForm;
