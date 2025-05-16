import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/store/authStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleProfileDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the document click handler from firing
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const isGuide = user?.role === UserRole.GUIDE;

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              {/* <img
                className="h-8 w-auto mr-2"
                src="/logo.png"
                alt="William Travel"
              /> */}
              <span className="text-xl font-semibold text-primary-600">William Travel</span>
            </Link>
          </div>

          {/* Navigation for desktop */}
          <div className="hidden md:block flex-1 ml-10">
            <div className="flex items-center justify-center space-x-4">
              <Link
                to="/"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                Trang chủ
              </Link>
              <Link
                to="/locations"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  location.pathname === '/locations' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                Địa điểm
              </Link>
              <Link
                to="/guides"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  location.pathname === '/guides' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                Hướng dẫn viên
              </Link>
              <Link
                to="/map-explorer"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  location.pathname === '/map-explorer' 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                Khám phá bản đồ
              </Link>
            </div>
          </div>

          {/* Right side menu with auth buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <div>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Mở menu người dùng</span>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-200 text-center leading-8">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                      <svg
                        className="ml-1 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Profile dropdown menu */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Trang cá nhân
                    </Link>
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Yêu thích
                    </Link>

                    {/* Guide specific links */}
                    {(isGuide || isAdmin) && (
                      <>
                        <div className="border-t border-gray-100"></div>
                        <Link
                          to="/guide"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Trang HDV
                        </Link>
                        <Link
                          to="/guides/my-guides"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Hướng dẫn của tôi
                        </Link>
                        <Link
                          to="/guides/create"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Tạo hướng dẫn mới
                        </Link>
                      </>
                    )}

                    {/* Admin specific links */}
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100"></div>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Quản trị
                        </Link>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Quản lý người dùng
                        </Link>
                        <Link
                          to="/admin/locations/manage"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Quản lý địa điểm
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="rounded-md border border-transparent bg-primary-100 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden ml-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Mở menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              to="/"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === '/' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/locations"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === '/locations' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
              }`}
            >
              Địa điểm
            </Link>
            <Link
              to="/guides"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === '/guides' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
              }`}
            >
              Hướng dẫn viên
            </Link>
            <Link
              to="/map-explorer"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === '/map-explorer' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700'
              }`}
            >
              Khám phá bản đồ
            </Link>
          </div>

          {/* Mobile authentication buttons or user menu */}
          {isAuthenticated ? (
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-200 text-center text-lg leading-10">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name || 'Người dùng'}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/profile"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Trang cá nhân
                </Link>
                <Link
                  to="/favorites"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Yêu thích
                </Link>

                {/* Guide specific links */}
                {(isGuide || isAdmin) && (
                  <>
                    <Link
                      to="/guide"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Trang HDV
                    </Link>
                    <Link
                      to="/guides/my-guides"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Hướng dẫn của tôi
                    </Link>
                    <Link
                      to="/guides/create"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Tạo hướng dẫn mới
                    </Link>
                  </>
                )}

                {/* Admin specific links */}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Quản trị
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Quản lý người dùng
                    </Link>
                    <Link
                      to="/admin/locations/manage"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Quản lý địa điểm
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="w-full rounded-md bg-primary-100 px-4 py-2 text-center text-base font-medium text-primary-700 hover:bg-primary-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="w-full rounded-md bg-primary-600 px-4 py-2 text-center text-base font-medium text-white hover:bg-primary-700"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;