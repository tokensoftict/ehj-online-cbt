import AdminLayout from '@/components/admin/AdminLayout';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/template-ui/button';
import { LoaderCircle, Plus, UsersRound } from 'lucide-react';
import { CardHeader, CardTitle, Card, CardContent } from '@/components/template-ui/card';
import DataTable from 'datatables.net-react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DT from 'datatables.net-dt';
import CreateDialog from '@/pages/admin/class_management/pages/components/createdialog';
import { Label } from '@/components/template-ui/label';
import { Input } from '@/components/template-ui/input';
import InputError from '@/components/input-error';
import { DialogFooter } from '@/components/template-ui/dialog';
import { createRoot } from 'react-dom/client';
import TableActions from '@/pages/admin/class_management/pages/components/tableactions';
import AdminManagementController from '@/actions/App/Http/Controllers/Administrator/AdminManagementController';

import { Checkbox } from '@/components/template-ui/checkbox';

export interface Admin {
    id: number;
    name: string;
    email: string;
    username: string;
    roles_list: string[];
}

export default function AdminManager({ url, roles }: { url: string, roles: any[] }) {
    const tableRef = useRef<any>(null);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [admin, setAdmin] = useState<Admin>();

    DataTable.use(DT);
    const adminForm = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[]
    });

    useEffect(() => {
        if (admin?.id !== undefined) {
            adminForm.setData({
                name: admin.name,
                email: admin.email,
                username: admin.username,
                password: '',
                password_confirmation: '',
                roles: admin.roles_list
            });
            adminForm.clearErrors();
        } else {
            adminForm.setData({
                name: '',
                email: '',
                username: '',
                password: '',
                password_confirmation: '',
                roles: []
            });
            adminForm.clearErrors();
        }
    }, [admin]);

    const handleEdit = function (row: Admin) {
        setAdmin(row);
        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const actionUrl = admin?.id
            ? AdminManagementController.update.url({ admin: admin.id })
            : AdminManagementController.store.url();

        const method = admin?.id ? 'put' : 'post';

        adminForm.submit(method, actionUrl, {
            onSuccess: () => {
                toast({
                    title: 'Admin Management',
                    description: `Administrator has been ${admin?.id ? 'updated' : 'created'} successfully.`,
                });
                setOpen(false);
                if (tableRef.current) {
                    tableRef.current.dt().ajax.reload(null, false);
                }
            }
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Management</h1>
                        <p className="text-muted-foreground">
                            Manage administrators e.g create, edit and delete admin data
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            onClick={() => {
                                setAdmin(undefined);
                                setOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Admin
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UsersRound className="h-5 w-5" />
                            Administrators List
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
                                serverSide: true,
                                pageLength: 10,
                            }}
                            columns={[
                                { title: 'ID', data: 'id' },
                                { title: 'Name', data: 'name' },
                                { title: 'Email', data: 'email' },
                                { title: 'Username', data: 'username' },
                                {
                                    title: 'Roles',
                                    data: 'roles_list',
                                    render: (data: any) => {
                                        return Array.isArray(data) ? (data.join(', ') || 'No Roles') : (data || 'No Roles');
                                    }
                                },
                                {
                                    title: 'Actions',
                                    data: null,
                                    orderable: false,
                                    searchable: false,
                                    render: function (data, type, row) {
                                        const div = document.createElement('div');
                                        createRoot(div).render(
                                            <TableActions
                                                onEdit={() => handleEdit(row)}
                                                deleteUrl={AdminManagementController.destroy.url({ admin: row.id })}
                                                onDeleteSuccess={() => {
                                                    toast({
                                                        title: 'Item Deleted',
                                                        description: 'Item has been deleted successfully.',
                                                    });
                                                    tableRef.current?.dt().ajax.reload(null, false);
                                                }}
                                            />
                                        );
                                        return div;
                                    },
                                },
                            ]}
                        />
                    </CardContent>
                </Card>

                <CreateDialog
                    title={admin?.id ? "Update Administrator" : "New Administrator"}
                    open={open}
                    setOpen={setOpen}
                >
                    <form onSubmit={submit} className="space-y-6">
                        <>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={adminForm.data.name || ''}
                                        onChange={(e) => adminForm.setData('name', e.target.value)}
                                        placeholder="Full Name"
                                        className="focus:ring-2 focus:ring-primary/30"
                                    />
                                    <InputError message={adminForm.errors.name} />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={adminForm.data.email || ''}
                                        onChange={(e) => adminForm.setData('email', e.target.value)}
                                        placeholder="Email Address"
                                        className="focus:ring-2 focus:ring-primary/30"
                                    />
                                    <InputError message={adminForm.errors.email} />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={adminForm.data.username || ''}
                                        onChange={(e) => adminForm.setData('username', e.target.value)}
                                        placeholder="Username"
                                        className="focus:ring-2 focus:ring-primary/30"
                                    />
                                    <InputError message={adminForm.errors.username} />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">
                                        Password {admin?.id && <span className="text-xs text-muted-foreground">(Leave blank to keep current)</span>}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={adminForm.data.password || ''}
                                        onChange={(e) => adminForm.setData('password', e.target.value)}
                                        placeholder="Password"
                                        className="focus:ring-2 focus:ring-primary/30"
                                    />
                                    <InputError message={adminForm.errors.password} />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={adminForm.data.password_confirmation || ''}
                                        onChange={(e) => adminForm.setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm Password"
                                        className="focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <Label>Assign Roles</Label>
                                <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/20">
                                    {roles.map(role => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.id}`}
                                                checked={adminForm.data.roles.includes(role.name)}
                                                onCheckedChange={(checked) => {
                                                    const current = [...adminForm.data.roles];
                                                    if (checked) {
                                                        adminForm.setData('roles', [...current, role.name]);
                                                    } else {
                                                        adminForm.setData('roles', current.filter(r => r !== role.name));
                                                    }
                                                }}
                                            />
                                            <Label
                                                htmlFor={`role-${role.id}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={adminForm.errors.roles as string} />
                            </div>

                            <DialogFooter>
                                <Button disabled={adminForm.processing} type="submit" className="flex items-center gap-2">
                                    {adminForm.processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </>
                    </form>
                </CreateDialog>
            </div>
        </AdminLayout>
    );
}
