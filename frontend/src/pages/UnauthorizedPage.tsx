import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Không có quyền truy cập</h1>
        
        <p className="mt-2 text-gray-600">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn
          cần quyền truy cập.
        </p>
        
        <div className="mt-6 flex justify-center space-x-4">
          <Link
            to="/"
            className="rounded-md bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Về trang chủ
          </Link>
          <Link
            to="auth/login"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Đăng nhập với tài khoản khác
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
