import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/template-ui/card';
import { Input } from '@/components/template-ui/input';
import { Label } from '@/components/template-ui/label';
import { Button } from '@/components/template-ui/button';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Lock } from 'lucide-react';
import { useEffect } from 'react';

export default function EditPassword() {
    const { toast } = useToast();

    const { data, setData, patch, errors, processing, recentlySuccessful, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast({
                    title: 'Password Updated',
                    description: 'Your password has been changed successfully.',
                });
            },
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your administrator account security.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-college-maroon" />
                            Update Password
                        </CardTitle>
                        <CardDescription>
                            Ensure your account is using a long, random password to stay secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Current Password</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    placeholder="Enter your current password"
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter a new secure password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm new password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} type="submit" className="bg-college-maroon hover:bg-college-maroon-dark">
                                    {processing && <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />}
                                    Save Password
                                </Button>
                                
                                {recentlySuccessful && (
                                    <p className="text-sm font-medium text-green-600">Saved.</p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
