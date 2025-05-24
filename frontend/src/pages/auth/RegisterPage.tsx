import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Loader2,
  User,
  Mail,
  Lock,
  ShieldCheck,
  ArrowLeft,
  MapPin
} from 'lucide-react';

// Define the validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số')
    .regex(/[a-zA-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ cái'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      clearError();
      await registerUser(data.email, data.password, data.name);
      setSuccessMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration failed:', error);
    }
  };

  // Background image URLs for travel inspiration
  const bgImageUrl = '/images/sapa.jpg';
  const locationName = 'Sa Pa';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background section with travel image */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/70 dark:from-background/95 dark:via-background/90 dark:to-background/80 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20 transition-opacity duration-1000"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        ></div>
        {/* Location badge */}
        <div className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium z-20 shadow-md dark:bg-background/40">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {locationName}
          </span>
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Background decorative elements */}
        <div className="absolute -z-10 -top-12 -left-12 w-24 h-24 bg-primary-200 dark:bg-primary-800 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute -z-10 -bottom-12 -right-12 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-50 blur-3xl"></div>

        <Card className="border-primary-100 dark:border-primary-900 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              <Compass className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Đăng Ký Tài Khoản</CardTitle>
            <CardDescription>
              Bắt đầu hành trình khám phá thế giới cùng chúng tôi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50 slide-in-from-top-5">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi đăng ký</AlertTitle>
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

            {successMessage && (
              <Alert className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900 animate-in fade-in-50 slide-in-from-top-5">
                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                <AlertTitle>Thành công</AlertTitle>
                <AlertDescription>
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Tên */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={16} className="text-gray-500 dark:text-gray-400 group-focus-within:text-primary" aria-hidden="true" />
                </div>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Tên của bạn"
                  className={`pl-10 h-12 transition-all bg-background border-muted group-hover:border-primary/50 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary/20'}`}
                />
                <Label
                  htmlFor="name"
                  className="absolute left-10 -top-2.5 px-1 text-xs text-muted-foreground bg-background rounded-sm"
                >
                  Tên
                  <span className="text-muted-foreground font-light ml-1">(tùy chọn)</span>
                </Label>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={16} className="text-gray-500 dark:text-gray-400 group-focus-within:text-primary" aria-hidden="true" />
                </div>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="email@example.com"
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
                  <Lock size={16} className="text-gray-500 dark:text-gray-400 group-focus-within:text-primary" aria-hidden="true" />
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
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
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <ShieldCheck size={16} className="text-gray-500 dark:text-gray-400 group-focus-within:text-primary" aria-hidden="true" />
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className={`pl-10 h-12 transition-all bg-background border-muted group-hover:border-primary/50 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary/20'}`}
                />
                <Label
                  htmlFor="confirmPassword"
                  className="absolute left-10 -top-2.5 px-1 text-xs text-muted-foreground bg-background rounded-sm"
                >
                  Xác nhận mật khẩu
                </Label>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  'Đăng ký'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Đã có tài khoản?{' '}
              <Link
                to="/auth/login"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Đăng nhập
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

export default RegisterPage;
