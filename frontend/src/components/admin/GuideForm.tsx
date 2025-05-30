// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/components/admin/GuideForm.tsx
import React, { useState, useEffect } from 'react';
import { Guide } from '@/services/api/guideService';
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

interface GuideFormProps {
  guide?: Partial<Guide>;
  onSubmit: (guideData: Partial<Guide>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  name?: string;
  languages?: string;
  specialties?: string;
}

const GuideForm: React.FC<GuideFormProps> = ({ guide, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<Partial<Guide>>({
    name: '',
    email: '',
    phoneNumber: '',
    languages: '',
    specialties: '',
    experience: '',
    bio: '',
    profileImage: '',
    rating: '',
    certifications: '',
    isVerified: false,
    isActive: true,
    ...guide,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (guide) {
      setFormData({
        ...guide,
      });
    }
  }, [guide]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.languages?.trim()) {
      newErrors.languages = 'Languages are required';
    }

    if (!formData.specialties?.trim()) {
      newErrors.specialties = 'Specialties are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages">Languages *</Label>
          <Input
            id="languages"
            name="languages"
            value={formData.languages || ''}
            onChange={handleChange}
            className={errors.languages ? 'border-red-500' : ''}
            disabled={loading}
            placeholder="English, Vietnamese, French"
          />
          {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialties">Specialties *</Label>
          <Input
            id="specialties"
            name="specialties"
            value={formData.specialties || ''}
            onChange={handleChange}
            className={errors.specialties ? 'border-red-500' : ''}
            disabled={loading}
            placeholder="Hiking, Food Tours, Cultural Tours"
          />
          {errors.specialties && <p className="text-red-500 text-sm">{errors.specialties}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            name="experience"
            value={formData.experience || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image URL</Label>
          <Input
            id="profileImage"
            name="profileImage"
            value={formData.profileImage || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio/Description</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          className="min-h-[150px]"
          disabled={loading}
          placeholder="Describe the guide's background, expertise, and notable experiences..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications</Label>
        <Input
          id="certifications"
          name="certifications"
          value={formData.certifications || ''}
          onChange={handleChange}
          disabled={loading}
          placeholder="Licensed Tour Guide, First Aid, Wilderness Survival"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isVerified"
            checked={formData.isVerified || false}
            onCheckedChange={(checked) => handleCheckboxChange('isVerified', checked === true)}
            disabled={loading}
          />
          <Label htmlFor="isVerified">Verified Guide</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive !== false}
            onCheckedChange={(checked) => handleCheckboxChange('isActive', checked === true)}
            disabled={loading}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
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
          {loading ? 'Saving...' : guide ? 'Update Guide' : 'Create Guide'}
        </Button>
      </div>
    </form>
  );
};

export default GuideForm;
