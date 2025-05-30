import React, { useState, useEffect } from 'react';
import { Article } from '@/services/api/articleService';

interface ArticleFormProps {
  article?: Partial<Article>;
  onSubmit: (articleData: Partial<Article>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  title?: string;
  content?: string;
  status?: string;
  author?: string;
  thumbnailUrl?: string;
  tags?: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    content: '',
    status: 'draft',
    author: '',
    thumbnailUrl: '',
    tags: [],
    ...article,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (article) {
      setFormData({
        ...article
      });

      if (article.tags && Array.isArray(article.tags)) {
        setTagsInput(article.tags.join(', '));
      }
    }
  }, [article]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.author?.trim()) {
      newErrors.author = 'Author name is required';
    }

    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when field is edited
    if (errors[name as keyof ValidationErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);

    // Convert comma-separated tags to array
    const tagsArray = e.target.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    setFormData({ ...formData, tags: tagsArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            Article Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter article title"
            disabled={loading}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="author">
            Author*
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author || ''}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter author name"
            disabled={loading}
          />
          {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
            Status*
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'draft'}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={loading}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="thumbnailUrl">
            Thumbnail URL
          </label>
          <input
            type="text"
            id="thumbnailUrl"
            name="thumbnailUrl"
            value={formData.thumbnailUrl || ''}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.thumbnailUrl ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter image URL"
            disabled={loading}
          />
          {errors.thumbnailUrl && <p className="mt-1 text-sm text-red-600">{errors.thumbnailUrl}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tags">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tagsInput}
            onChange={handleTagsChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="travel, vietnam, food, etc."
            disabled={loading}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
            Content*
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content || ''}
            onChange={handleChange}
            rows={10}
            className={`w-full p-2 border rounded ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter article content"
            disabled={loading}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Article'
          )}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;
