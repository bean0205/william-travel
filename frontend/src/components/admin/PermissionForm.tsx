// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/components/admin/PermissionForm.tsx
import React, { useState, useEffect } from 'react';
import { Permission } from '@/services/api/roleService';
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

interface PermissionFormProps {
  permission?: Partial<Permission>;
  categories?: string[];
  onSubmit: (permissionData: Partial<Permission>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  name?: string;
  code?: string;
  category?: string;
}

const PermissionForm: React.FC<PermissionFormProps> = ({
  permission,
  categories = [],
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<Permission>>({
    name: '',
    code: '',
    description: '',
    category: 'General',
    isSystem: false,
    ...permission,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [newCategory, setNewCategory] = useState<string>('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    if (permission) {
      setFormData({
        ...permission,
      });
    }
  }, [permission]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Permission name is required';
    }

    if (!formData.code?.trim()) {
      newErrors.code = 'Permission code is required';
    } else if (!/^[a-z0-9:_-]+$/.test(formData.code)) {
      newErrors.code = 'Permission code should contain only lowercase letters, numbers, colons, underscores, and hyphens';
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (value === 'new-category') {
      setShowNewCategoryInput(true);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData({ ...formData, category: newCategory.trim() });
      setShowNewCategoryInput(false);
      setNewCategory('');
    }
  };

  const handleCancelNewCategory = () => {
    setShowNewCategoryInput(false);
    setNewCategory('');
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
          <Label htmlFor="name">Permission Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
            disabled={loading || (permission?.isSystem === true)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          {permission?.isSystem === true && (
            <p className="text-amber-500 text-sm">System permissions cannot be renamed</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Permission Code *</Label>
          <Input
            id="code"
            name="code"
            value={formData.code || ''}
            onChange={handleChange}
            className={errors.code ? 'border-red-500' : ''}
            placeholder="user:read, content:write, etc."
            disabled={loading || (permission?.isSystem === true)}
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
          {permission?.isSystem === true && (
            <p className="text-amber-500 text-sm">System permission codes cannot be changed</p>
          )}
        </div>

        {!showNewCategoryInput ? (
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              name="category"
              value={formData.category || ''}
              onValueChange={(value) => handleSelectChange('category', value)}
              disabled={loading}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
                <SelectItem value="new-category">+ Add New Category</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="newCategory">New Category *</Label>
            <div className="flex space-x-2">
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="flex-1"
                autoFocus
              />
              <Button type="button" onClick={handleAddCategory} disabled={!newCategory.trim()}>
                Add
              </Button>
              <Button type="button" variant="outline" onClick={handleCancelNewCategory}>
                Cancel
              </Button>
            </div>
          </div>
        )}
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
          placeholder="Describe what this permission allows users to do"
        />
      </div>

      {!permission && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSystem"
            checked={formData.isSystem || false}
            onCheckedChange={(checked) => handleCheckboxChange('isSystem', checked === true)}
            disabled={loading}
          />
          <div className="space-y-1">
            <Label htmlFor="isSystem">System Permission</Label>
            <p className="text-gray-500 text-xs">
              System permissions cannot be deleted and have special protections
            </p>
          </div>
        </div>
      )}

      {permission?.isSystem === true && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            This is a system permission and some restrictions apply. You can update the description or category but cannot change the code or name.
          </p>
        </div>
      )}

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
          {loading ? 'Saving...' : permission ? 'Update Permission' : 'Create Permission'}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm;
