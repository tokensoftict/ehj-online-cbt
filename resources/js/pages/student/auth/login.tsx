import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/template-ui/input';
import { Button } from '@/components/template-ui/button';
import { Label } from '@/components/template-ui/label';
import { Form } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import InputError from '@/components/input-error';
import Student from '@/routes/student';


const Login = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-college-maroon-light via-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-elevation">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-white rounded-xl p-3 shadow-card">
            <img src="https://ehjmodelcollegeilorin.com/wp-content/uploads/2023/12/logo-dark.png" alt="EHJ Model College Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-college-maroon-dark">
                Eucharistic Heart of Jesus Model College
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Computer-Based Test System
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>

          <Form
              {...Student.processLogin.form()}
              resetOnSuccess={['surname']} className="space-y-4">
              {({ processing, errors }) => (
                  <>
                      <div className="space-y-2">
                          <Label htmlFor="username">Registration Number</Label>
                          <Input
                              id="username"
                              type="text"
                              name="reg_number"
                              placeholder="Enter your Registration Number"
                              className="h-11"
                          />
                          <InputError message={errors.reg_number} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="password">Surname</Label>
                          <Input
                              id="password"
                              type="password"
                              name="surname"
                              placeholder="Enter your surname"
                              className="h-11"
                          />
                          <InputError message={errors.surname} />
                      </div>
                      <Button
                          type="submit"
                          disabled={processing}
                          className="w-full h-11  from-primary to-college-maroon hover:from-primary-hover hover:to-college-maroon-dark transition-all duration-300"
                      >
                          {processing ? (
                              <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Signing in...
                              </>
                          ) : (
                              'Sign In'
                          )}
                      </Button>
                  </>

              )}
          </Form>

        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
