import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

// Mock data - would be replaced with API calls
const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Administrator with full access',
    is_default: false,
    permissions: [
      { id: 1, name: 'Create User', code: 'user:create' },
      { id: 2, name: 'Delete User', code: 'user:delete' },
      { id: 3, name: 'Manage Roles', code: 'role:manage' }
    ]
  },
  {
    id: 2,
    name: 'Content Manager',
    description: 'Can manage all content',
    is_default: false,
    permissions: [
      { id: 4, name: 'Create Content', code: 'content:create' },
      { id: 5, name: 'Edit Content', code: 'content:edit' },
      { id: 6, name: 'Delete Content', code: 'content:delete' }
    ]
  },
  {
    id: 3,
    name: 'User',
    description: 'Standard user with basic permissions',
    is_default: true,
    permissions: [
      { id: 7, name: 'View Content', code: 'content:view' },
      { id: 8, name: 'Create Post', code: 'post:create' }
    ]
  }
];

// Mock permissions for selection
const mockAllPermissions = [
  { id: 1, name: 'Create User', code: 'user:create', description: 'Can create new users' },
  { id: 2, name: 'Delete User', code: 'user:delete', description: 'Can delete users' },
  { id: 3, name: 'Manage Roles', code: 'role:manage', description: 'Can manage roles' },
  { id: 4, name: 'Create Content', code: 'content:create', description: 'Can create content' },
  { id: 5, name: 'Edit Content', code: 'content:edit', description: 'Can edit content' },
  { id: 6, name: 'Delete Content', code: 'content:delete', description: 'Can delete content' },
  { id: 7, name: 'View Content', code: 'content:view', description: 'Can view content' },
  { id: 8, name: 'Create Post', code: 'post:create', description: 'Can create posts' },
  { id: 9, name: 'Edit Post', code: 'post:edit', description: 'Can edit posts' },
  { id: 10, name: 'Delete Post', code: 'post:delete', description: 'Can delete posts' }
];

const RolesManagement = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [permissions] = useState(mockAllPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    is_default: false,
    permission_ids: []
  });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    // Would make an API call in a real implementation
    const permissionObjects = permissions.filter(p => newRole.permission_ids.includes(p.id));

    const createdRole = {
      ...newRole,
      id: roles.length + 1,
      permissions: permissionObjects
    };

    setRoles([...roles, createdRole]);
    setNewRole({
      name: '',
      description: '',
      is_default: false,
      permission_ids: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditRole = () => {
    // Would make an API call in a real implementation
    const updatedPermissions = permissions.filter(p => selectedPermissions.includes(p.id));
    const updatedRole = {
      ...editingRole,
      permissions: updatedPermissions
    };

    setRoles(roles.map(role => role.id === editingRole.id ? updatedRole : role));
    setIsEditDialogOpen(false);
  };

  const handleDeleteRole = () => {
    // Would make an API call in a real implementation
    setRoles(roles.filter(role => role.id !== editingRole.id));
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (role) => {
    setEditingRole({ ...role });
    setSelectedPermissions(role.permissions.map(p => p.id));
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (role) => {
    setEditingRole(role);
    setIsDeleteDialogOpen(true);
  };

  const togglePermission = (id) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== id));
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };

  const toggleNewRolePermission = (id) => {
    if (newRole.permission_ids.includes(id)) {
      setNewRole({
        ...newRole,
        permission_ids: newRole.permission_ids.filter(p => p !== id)
      });
    } else {
      setNewRole({
        ...newRole,
        permission_ids: [...newRole.permission_ids, id]
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Roles Management</CardTitle>
            <CardDescription>
              Manage roles and their associated permissions
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusIcon className="mr-2 h-4 w-4" /> Add Role</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Add a new role and assign permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Role Name</Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g., Content Editor"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    className="col-span-3"
                    placeholder="Role description"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_default" className="text-right">Default Role</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="is_default"
                      checked={newRole.is_default}
                      onCheckedChange={(checked) => setNewRole({...newRole, is_default: checked})}
                    />
                    <Label htmlFor="is_default">Make this the default role for new users</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right pt-2">Permissions</Label>
                  <div className="col-span-3 border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={newRole.permission_ids.includes(permission.id)}
                            onCheckedChange={() => toggleNewRolePermission(permission.id)}
                          />
                          <Label htmlFor={`perm-${permission.id}`} className="text-sm">
                            {permission.name} <span className="text-xs text-muted-foreground">({permission.code})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
          <Input
            placeholder="Search roles..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map(role => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map(permission => (
                      <Badge key={permission.id} variant="outline">{permission.name}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {role.is_default ? <Badge>Default</Badge> : 'No'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(role)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500" onClick={() => openDeleteDialog(role)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Role Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Update role details and permissions.
              </DialogDescription>
            </DialogHeader>
            {editingRole && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Role Name</Label>
                  <Input
                    id="edit-name"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-is_default" className="text-right">Default Role</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="edit-is_default"
                      checked={editingRole.is_default}
                      onCheckedChange={(checked) => setEditingRole({...editingRole, is_default: checked})}
                    />
                    <Label htmlFor="edit-is_default">Make this the default role for new users</Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right pt-2">Permissions</Label>
                  <div className="col-span-3 border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-perm-${permission.id}`}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={`edit-perm-${permission.id}`} className="text-sm">
                            {permission.name} <span className="text-xs text-muted-foreground">({permission.code})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditRole}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Role Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the role "{editingRole?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteRole}>Delete Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RolesManagement;
