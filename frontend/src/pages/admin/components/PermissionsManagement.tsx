import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@/components/ui/icons';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Mock data - would be replaced with API calls
const mockPermissions = [
  {
    id: 1,
    name: 'Create User',
    code: 'user:create',
    description: 'Can create new users',
    created_at: '2025-05-18T15:30:45',
    updated_at: '2025-05-18T15:30:45'
  },
  {
    id: 2,
    name: 'Delete User',
    code: 'user:delete',
    description: 'Can delete users',
    created_at: '2025-05-18T15:30:45',
    updated_at: '2025-05-18T15:30:45'
  },
  {
    id: 3,
    name: 'Manage Roles',
    code: 'role:manage',
    description: 'Can manage roles and permissions',
    created_at: '2025-05-18T15:30:45',
    updated_at: '2025-05-18T15:30:45'
  },
  {
    id: 4,
    name: 'Create Content',
    code: 'content:create',
    description: 'Can create new content items',
    created_at: '2025-05-18T15:30:45',
    updated_at: '2025-05-18T15:30:45'
  },
  {
    id: 5,
    name: 'Edit Content',
    code: 'content:edit',
    description: 'Can edit existing content',
    created_at: '2025-05-18T15:30:45',
    updated_at: '2025-05-18T15:30:45'
  }
];

const PermissionsManagement = () => {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPermission, setEditingPermission] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newPermission, setNewPermission] = useState({
    name: '',
    code: '',
    description: ''
  });

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePermission = () => {
    // Would make an API call in a real implementation
    const createdPermission = {
      ...newPermission,
      id: permissions.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setPermissions([...permissions, createdPermission]);
    setNewPermission({
      name: '',
      code: '',
      description: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditPermission = () => {
    // Would make an API call in a real implementation
    const updatedPermission = {
      ...editingPermission,
      updated_at: new Date().toISOString()
    };

    setPermissions(permissions.map(permission =>
      permission.id === editingPermission.id ? updatedPermission : permission
    ));
    setIsEditDialogOpen(false);
  };

  const handleDeletePermission = () => {
    // Would make an API call in a real implementation
    setPermissions(permissions.filter(permission => permission.id !== editingPermission.id));
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (permission) => {
    setEditingPermission({ ...permission });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (permission) => {
    setEditingPermission(permission);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Permissions Management</CardTitle>
            <CardDescription>
              Manage system permissions that can be assigned to roles
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusIcon className="mr-2 h-4 w-4" /> Add Permission</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Permission</DialogTitle>
                <DialogDescription>
                  Add a new permission to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newPermission.name}
                    onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g., Edit Article"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">Code</Label>
                  <Input
                    id="code"
                    value={newPermission.code}
                    onChange={(e) => setNewPermission({...newPermission, code: e.target.value})}
                    className="col-span-3"
                    placeholder="e.g., article:edit"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    value={newPermission.description}
                    onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
                    className="col-span-3"
                    placeholder="Permission description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePermission}>Create Permission</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
          <Input
            placeholder="Search permissions..."
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
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.map(permission => (
              <TableRow key={permission.id}>
                <TableCell>{permission.id}</TableCell>
                <TableCell>{permission.name}</TableCell>
                <TableCell><code>{permission.code}</code></TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>{new Date(permission.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(permission.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(permission)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500" onClick={() => openDeleteDialog(permission)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Permission Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Permission</DialogTitle>
              <DialogDescription>
                Update permission details.
              </DialogDescription>
            </DialogHeader>
            {editingPermission && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingPermission.name}
                    onChange={(e) => setEditingPermission({...editingPermission, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-code" className="text-right">Code</Label>
                  <Input
                    id="edit-code"
                    value={editingPermission.code}
                    onChange={(e) => setEditingPermission({...editingPermission, code: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingPermission.description}
                    onChange={(e) => setEditingPermission({...editingPermission, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditPermission}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Permission Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the permission "{editingPermission?.name}"? This action cannot be undone
                and may affect roles that are using this permission.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeletePermission}>Delete Permission</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PermissionsManagement;
