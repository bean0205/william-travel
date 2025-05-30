// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/components/admin/UserForm.tsx
import React, { useState, useEffect } from 'react';
import { User } from '@/services/api/userService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface UserFormProps {
  user?: Partial<User>;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  email?: string;
  fullName?: string;
  role?: string;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    email: '',
    fullName: '',
    username: '',
    role: 'user',
    status: 'active',
    isEmailVerified: false,
    avatar: '',
    phoneNumber: '',
    country: '',
    bio: '',
    ...user,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCreatingNew, setIsCreatingNew] = useState(!user);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
      });
      setIsCreatingNew(false);
    } else {
      setIsCreatingNew(true);
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.role?.trim()) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={errors.email ? 'border-red-500' : ''}
            disabled={loading || (!isCreatingNew)}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            className={errors.fullName ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            disabled={loading || (!isCreatingNew)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select
            name="role"
            value={formData.role || 'user'}
            onValueChange={(value) => handleSelectChange('role', value)}
            disabled={loading}
          >
            <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="guide">Guide</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
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
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>
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
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            name="avatar"
            value={formData.avatar || ''}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isEmailVerified"
          checked={formData.isEmailVerified || false}
          onCheckedChange={(checked) => handleCheckboxChange('isEmailVerified', checked === true)}
          disabled={loading}
        />
        <Label htmlFor="isEmailVerified">Email Verified</Label>
      </div>

      {isCreatingNew && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            When creating a new user, a system-generated temporary password will be created and sent to the user's email.
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
          {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
