import AdminLayout from '@/components/admin/AdminLayout';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/template-ui/button';
import { LoaderCircle, Save, User } from 'lucide-react';
import { CardHeader, CardTitle, Card, CardContent } from '@/components/template-ui/card';
import { Label } from '@/components/template-ui/label';
import { Input } from '@/components/template-ui/input';
import InputError from '@/components/input-error';
import { useToast } from '@/hooks/use-toast';

export default function EditProfile() {
    const { auth } = usePage<any>().props;
    const admin = auth.user || auth.admin;
    const { toast } = useToast();

    const { data, setData, patch, processing, errors } = useForm<{ name: string; email: string; username: string }>({
        name: admin?.name || '',
        email: admin?.email || '',
        username: admin?.username || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/profile', {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Profile updated successfully.',
                });
            }
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-2xl">
                <div>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-muted-foreground">
                        Update your account information
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Full Name"
                                    className="focus:ring-2 focus:ring-primary/30"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email Address"
                                    className="focus:ring-2 focus:ring-primary/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    placeholder="Username"
                                    className="focus:ring-2 focus:ring-primary/30"
                                />
                                <InputError message={errors.username} />
                            </div>

                            <Button disabled={processing} type="submit" className="flex items-center gap-2">
                                {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
