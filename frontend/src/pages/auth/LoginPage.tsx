import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  Loader2,
  MapPin,
  Mail,
  Lock,
  ArrowLeft
} from 'lucide-react';

// Define the validation schema
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // If user is already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      clearError();
      await login(data.email, data.password);
      // If successful, navigate to the redirect path
      navigate(from, { replace: true });
    } catch (error: any) {
      // Error handling is done in the store
      console.error('Login failed:', error);
    }
  };

  // Ảnh nền du lịch
  const bgImageUrl = '/images/hanoi.jpg';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background section with travel image */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/70 dark:from-background/95 dark:via-background/90 dark:to-background/80 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        ></div>
      </div>

      <div className="w-full max-w-md mx-auto relative">
        {/* Background decorative elements */}
        <div className="absolute -z-10 -top-12 -right-12 w-24 h-24 bg-primary-200 dark:bg-primary-800 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute -z-10 -bottom-12 -left-12 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-50 blur-3xl"></div>

        <Card className="backdrop-blur-sm border-primary-100 dark:border-primary-900 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              <MapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Đăng Nhập</CardTitle>
            <CardDescription>Nhập thông tin đăng nhập của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    className="pl-10"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Ghi nhớ đăng nhập</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Chưa có tài khoản?{' '}
              <Link
                to="/auth/register"
                className="text-primary hover:underline"
              >
                Đăng ký
              </Link>
            </div>
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Trở về trang chủ
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
