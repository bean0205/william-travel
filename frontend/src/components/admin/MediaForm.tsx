// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/components/admin/MediaForm.tsx
import React, { useState, useEffect } from 'react';
import { Media } from '@/services/api/mediaService';
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

interface MediaFormProps {
  media?: Partial<Media>;
  onSubmit: (mediaData: Partial<Media>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  title?: string;
  fileUrl?: string;
  type?: string;
}

const MediaForm: React.FC<MediaFormProps> = ({ media, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<Partial<Media>>({
    title: '',
    fileUrl: '',
    thumbnailUrl: '',
    type: 'image',
    description: '',
    altText: '',
    tags: [],
    category: '',
    isFeatured: false,
    ...media,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (media) {
      setFormData({
        ...media,
      });
      if (media.fileUrl) {
        setPreviewUrl(media.fileUrl);
      }
    }
  }, [media]);

  useEffect(() => {
    if (formData.fileUrl) {
      setPreviewUrl(formData.fileUrl);
    }
  }, [formData.fileUrl]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.fileUrl?.trim()) {
      newErrors.fileUrl = 'Media URL is required';
    }

    if (!formData.type?.trim()) {
      newErrors.type = 'Media type is required';
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

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagString = e.target.value;
    // Split by commas and trim whitespace
    const tagsArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setFormData({ ...formData, tags: tagsArray });
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
      {previewUrl && (
        <div className="w-full flex justify-center mb-4">
          {formData.type === 'image' ? (
            <img
              src={previewUrl}
              alt="Media preview"
              className="max-h-48 object-contain border rounded-md"
            />
          ) : formData.type === 'video' ? (
            <video
              src={previewUrl}
              controls
              className="max-h-48 object-contain border rounded-md"
            />
          ) : (
            <div className="p-4 border rounded-md bg-gray-100 text-center">
              <p>Preview not available for this media type</p>
              <p className="text-sm text-gray-500">{formData.fileUrl}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={errors.title ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Media Type *</Label>
          <Select
            name="type"
            value={formData.type || 'image'}
            onValueChange={(value) => handleSelectChange('type', value)}
            disabled={loading}
          >
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileUrl">Media URL *</Label>
          <Input
            id="fileUrl"
            name="fileUrl"
            value={formData.fileUrl || ''}
            onChange={handleChange}
            className={errors.fileUrl ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.fileUrl && <p className="text-red-500 text-sm">{errors.fileUrl}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            name="thumbnailUrl"
            value={formData.thumbnailUrl || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="Leave empty if same as Media URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="altText">Alt Text</Label>
          <Input
            id="altText"
            name="altText"
            value={formData.altText || ''}
            onChange={handleChange}
            disabled={loading}
            placeholder="Description for accessibility"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className="min-h-[100px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          name="tags"
          value={formData.tags?.join(', ') || ''}
          onChange={handleTagsChange}
          disabled={loading}
          placeholder="travel, vietnam, beach"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isFeatured"
          checked={formData.isFeatured || false}
          onCheckedChange={(checked) => handleCheckboxChange('isFeatured', checked === true)}
          disabled={loading}
        />
        <Label htmlFor="isFeatured">Featured media</Label>
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
          {loading ? 'Saving...' : media ? 'Update Media' : 'Upload Media'}
        </Button>
      </div>
    </form>
  );
};

export default MediaForm;
