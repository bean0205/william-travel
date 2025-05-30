// filepath: /Users/williamnguyen/Documents/william travel/frontend/src/components/admin/RoleForm.tsx
import React, { useState, useEffect } from 'react';
import { Role, Permission } from '@/services/api/roleService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoleFormProps {
  role?: Partial<Role>;
  permissions?: Permission[];
  onSubmit: (roleData: Partial<Role>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ValidationErrors {
  name?: string;
  description?: string;
}

const RoleForm: React.FC<RoleFormProps> = ({
  role,
  permissions = [],
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissionIds: [],
    isSystem: false,
    ...role,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (role) {
      setFormData({
        ...role,
      });
    }
  }, [role]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Role name is required';
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

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = formData.permissionIds || [];

    if (checked) {
      setFormData({
        ...formData,
        permissionIds: [...currentPermissions, permissionId]
      });
    } else {
      setFormData({
        ...formData,
        permissionIds: currentPermissions.filter(id => id !== permissionId)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  // Group permissions by category for better organization
  const groupedPermissions = permissions.reduce<Record<string, Permission[]>>((groups, permission) => {
    const category = permission.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Role Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={errors.name ? 'border-red-500' : ''}
            disabled={loading || (role?.isSystem === true)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          {role?.isSystem === true && (
            <p className="text-amber-500 text-sm">System roles cannot be renamed</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className={errors.description ? 'border-red-500' : ''}
            disabled={loading}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Permissions</Label>
        <ScrollArea className="h-64 border rounded-md p-4">
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([category, perms]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {perms.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={formData.permissionIds?.includes(permission.id) || false}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(permission.id, checked === true)
                        }
                        disabled={loading}
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {role?.isSystem === true && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            This is a system role and some restrictions apply. You can adjust permissions but cannot delete system roles or change their names.
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
          {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;
