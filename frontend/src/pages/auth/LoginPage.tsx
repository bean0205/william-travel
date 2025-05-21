import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import authService from '@/services/api/authService';

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
      // Using the new authService instead of direct store login
      await authService.login({
        username: data.email, // API expects 'username' for email field
        password: data.password
      });

      // If successful, navigate to the redirect path
      navigate(from, { replace: true });
    } catch (error: any) {
      // The error handling is already done in authService
      // If you need additional client-side handling, you can add it here
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
            <CardDescription>
              Đăng nhập để khám phá những điểm đến tuyệt vời
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50 slide-in-from-top-5">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi đăng nhập</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <span className="sr-only">Đóng</span>
                    <span aria-hidden="true">&times;</span>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 group-focus-within:text-primary" aria-hidden="true" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="email"
                  {...register('email')}
                  className={`pl-10 h-12 transition-all bg-background border-muted group-hover:border-primary/50 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary/20'}`}
                />
                <Label
                  htmlFor="email"
                  className="absolute left-10 -top-2.5 px-1 text-xs text-muted-foreground bg-background rounded-sm"
                >
                  Email
                </Label>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mật khẩu */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400 group-focus-within:text-primary" aria-hidden="true" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mật khẩu của bạn"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`pl-10 h-12 transition-all bg-background border-muted group-hover:border-primary/50 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary/20'}`}
                />
                <Label
                  htmlFor="password"
                  className="absolute left-10 -top-2.5 px-1 text-xs text-muted-foreground bg-background rounded-sm"
                >
                  Mật khẩu
                </Label>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}

                <div className="absolute right-3 top-full mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-primary/90 font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox id="remember" className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                className="w-full h-12 mt-2 font-medium text-base transition-all relative overflow-hidden group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Đăng nhập
                    <span className="absolute right-4 opacity-0 transform translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      →
                    </span>
                )}
                {/* Shimmer effect on hover */}
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-primary-400/0 via-primary-400/10 to-primary-400/0 opacity-0 group-hover:animate-travel-gradient"></span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Chưa có tài khoản? </span>
              <Link to="/register" className="font-medium text-primary hover:text-primary/90 transition-colors hover:underline">
                Đăng ký ngay
              </Link>
            </div>

            <Link
              to="/"
              className="flex items-center justify-center text-xs text-muted-foreground hover:text-foreground transition-colors gap-1 group"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Quay lại trang chủ
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
