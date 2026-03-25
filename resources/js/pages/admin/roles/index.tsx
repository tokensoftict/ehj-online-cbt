import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/template-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/template-ui/card';
import { useToast } from '@/hooks/use-toast';
import DT from 'datatables.net-dt';
import DataTable from 'datatables.net-react';
import { ShieldCheck, Plus, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm, router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/template-ui/dialog';
import { Input } from '@/components/template-ui/input';
import { Label } from '@/components/template-ui/label';
import { Checkbox } from '@/components/template-ui/checkbox';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions_list: string[];
}

export default function RolesIndex({ url, allPermissions }: { url: string, allPermissions: Permission[] }) {
    const tableRef = useRef<any>(null);
    const { toast } = useToast();
    DataTable.use(DT);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        permissions: [] as string[],
    });

    useEffect(() => {
        if (editingRole) {
            setData({
                name: editingRole.name,
                permissions: editingRole.permissions_list,
            });
        } else {
            reset();
        }
    }, [editingRole]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRole) {
            put(`/admin/roles/${editingRole.id}`, {
                onSuccess: () => {
                    closeModal();
                    tableRef.current?.dt().ajax.reload(null, false);
                    toast({ title: 'Success', description: 'Role updated successfully' });
                }
            });
        } else {
            post('/admin/roles', {
                onSuccess: () => {
                    closeModal();
                    tableRef.current?.dt().ajax.reload(null, false);
                    toast({ title: 'Success', description: 'Role created successfully' });
                }
            });
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (name === 'Super Admin') {
            toast({ title: 'Error', description: 'Super Admin role cannot be deleted', variant: 'destructive' });
            return;
        }
        if (window.confirm('Are you sure you want to delete this role?')) {
            destroy(`/admin/roles/${id}`, {
                onSuccess: () => {
                    tableRef.current?.dt().ajax.reload(null, false);
                    toast({ title: 'Success', description: 'Role deleted successfully' });
                }
            });
        }
    };

    const openModal = (role: Role | null = null) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
        reset();
    };

    const togglePermission = (permName: string) => {
        const current = [...data.permissions];
        if (current.includes(permName)) {
            setData('permissions', current.filter(p => p !== permName));
        } else {
            setData('permissions', [...current, permName]);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage access levels and permissions for administrators.
                        </p>
                    </div>
                    <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Role
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            Defined Roles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            ajax={url}
                            ref={tableRef}
                            className="w-full"
                            options={{
                                dom: "<'dt-length-search'<'dt-length'l><'dt-search'f>>rtip",
                                processing: true,
                                serverSide: false,
                            }}
                            columns={[
                                { title: 'S/N', data: 'DT_RowIndex' },
                                { title: 'Role Name', data: 'name' },
                                { 
                                    title: 'Permissions', 
                                    data: 'permissions_list',
                                    render: (data: string[]) => {
                                        return data.length > 5 
                                            ? `${data.slice(0, 5).map(p => p.replace(/_/g, ' ')).join(', ')} ... (+${data.length - 5} more)`
                                            : data.map(p => p.replace(/_/g, ' ')).join(', ') || 'No permissions';
                                    }
                                },
                                {
                                    title: 'Actions',
                                    data: null,
                                    orderable: false,
                                    searchable: false,
                                    render: function (data: any, type: any, row: Role) {
                                        const div = document.createElement('div');
                                        createRoot(div).render(
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openModal(row)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(row.id, row.name)}
                                                    className="h-8 w-8 p-0"
                                                    disabled={row.name === 'Super Admin'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        );
                                        return div;
                                    },
                                },
                            ]}
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Role Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="e.g. Content Manager"
                                disabled={editingRole?.name === 'Super Admin'}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-4">
                            <Label>Permissions</Label>
                            <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/20">
                                {allPermissions.map(permission => (
                                    <div key={permission.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${permission.id}`}
                                            checked={data.permissions.includes(permission.name)}
                                            onCheckedChange={() => togglePermission(permission.name)}
                                            disabled={editingRole?.name === 'Super Admin'}
                                        />
                                        <Label
                                            htmlFor={`perm-${permission.id}`}
                                            className="text-sm font-normal cursor-pointer capitalize"
                                        >
                                            {permission.name.replace(/_/g, ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.permissions && <p className="text-sm text-destructive">{errors.permissions}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing || editingRole?.name === 'Super Admin'}>
                                {editingRole ? 'Update Role' : 'Create Role'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
