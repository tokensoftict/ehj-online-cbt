import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import Admin from '@/routes/admin';

const Login = () => {
    const { toast } = useToast();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src="https://www.qualitexpharma.com/qualitex_logo.png"
                        alt="EHJ Model College"
                        className="mx-auto h-20 w-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-primary">EHJ Model College</h1>
                    <p className="text-muted-foreground">Administrator Panel</p>
                </div>

                <Card className="shadow-elevation">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Administrator Login</CardTitle>
                        <CardDescription>
                            Enter your credentials to access the admin panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <Form
                            {...Admin.processLogin.form()}
                            resetOnSuccess={['surname']} className="space-y-4">
                            {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        required
                                    />

                                    <InputError message={errors.username} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? "Signing in..." : "Sign In"}
                                </Button>
                            </>

                            )}
                        </Form>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
