// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/components/admin/ContentForm.tsx
import React, { useState, useEffect } from 'react';
import { Content } from '@/services/api/contentService';
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

interface ContentFormProps {
  content?: Partial<Content>;
  onSubmit: (contentData: Partial<Content>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  title?: string;
  contentType?: string;
  body?: string;
  status?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({ content, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<Partial<Content>>({
    title: '',
    contentType: '',
    body: '',
    slug: '',
    status: 'draft',
    featured: false,
    metaTitle: '',
    metaDescription: '',
    imageUrl: '',
    categoryId: '',
    tags: [],
    ...content,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (content) {
      setFormData({
        ...content,
      });
    }
  }, [content]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.contentType?.trim()) {
      newErrors.contentType = 'Content type is required';
    }

    if (!formData.body?.trim()) {
      newErrors.body = 'Content body is required';
    }

    if (!formData.status?.trim()) {
      newErrors.status = 'Status is required';
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
          <Label htmlFor="contentType">Content Type *</Label>
          <Select
            name="contentType"
            value={formData.contentType || ''}
            onValueChange={(value) => handleSelectChange('contentType', value)}
            disabled={loading}
          >
            <SelectTrigger className={errors.contentType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
            </SelectContent>
          </Select>
          {errors.contentType && <p className="text-red-500 text-sm">{errors.contentType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            name="status"
            value={formData.status || ''}
            onValueChange={(value) => handleSelectChange('status', value)}
            disabled={loading}
          >
            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Content Body *</Label>
        <Textarea
          id="body"
          name="body"
          value={formData.body || ''}
          onChange={handleChange}
          className={`min-h-[200px] ${errors.body ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        {errors.body && <p className="text-red-500 text-sm">{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Featured Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Input
            id="categoryId"
            name="categoryId"
            value={formData.categoryId || ''}
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
          id="featured"
          checked={formData.featured || false}
          onCheckedChange={(checked) => handleCheckboxChange('featured', checked === true)}
          disabled={loading}
        />
        <Label htmlFor="featured">Featured content</Label>
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
          {loading ? 'Saving...' : content ? 'Update Content' : 'Create Content'}
        </Button>
      </div>
    </form>
  );
};

export default ContentForm;
