import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserRole, useAuthStore } from '@/store/authStore';
import { Permission } from '@/utils/permissions';
import { RoleGuard, PermissionGuard, RolesGuard, AuthGuard } from '@/components/common/PermissionGuards';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle clicking outside of menus to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center text-2xl font-bold text-primary-600">
          Travel Explorer
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'
            }
            end
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'
            }
          >
            Bản đồ
          </NavLink>
          <NavLink
            to="/locations"
            className={({ isActive }) =>
              isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'
            }
          >
            Địa điểm
          </NavLink>
          <NavLink
            to="/guides"
            className={({ isActive }) =>
              isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'
            }
          >
            Hướng dẫn
          </NavLink>
          
          {/* Guide-specific navigation items */}
          <RolesGuard roles={[UserRole.GUIDE, UserRole.ADMIN]}>
            <NavLink
              to="/guides/my-guides"
              className={({ isActive }) =>
                isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'
              }
            >
              Quản lý Tour
            </NavLink>
          </RolesGuard>
          
          {/* Admin-specific navigation items */}
          <RoleGuard role={UserRole.ADMIN}>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'
              }
            >
              Quản trị
            </NavLink>
          </RoleGuard>
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                )}
                <span className="flex items-center gap-2">
                  {user.name || user.email.split('@')[0]}
                  {user.role && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      user.role === UserRole.ADMIN 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === UserRole.GUIDE 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Trang cá nhân
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Địa điểm yêu thích
                  </Link>
                  
                  {/* Guide-specific options */}
                  <RolesGuard roles={[UserRole.GUIDE, UserRole.ADMIN]}>
                    <hr className="my-1" />
                    <Link
                      to="/guide"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Bảng điều khiển Hướng dẫn viên
                    </Link>
                    <Link
                      to="/guides/my-guides"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Quản lý Tour
                    </Link>
                    <Link
                      to="/guides/create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Tạo Tour mới
                    </Link>
                  </RolesGuard>
                  
                  {/* Admin-specific options */}
                  <RoleGuard role={UserRole.ADMIN}>
                    <hr className="my-1" />
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Bảng điều khiển Admin
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Quản lý người dùng
                    </Link>
                    <Link
                      to="/admin/locations/manage"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Quản lý địa điểm
                    </Link>
                    <Link
                      to="/admin/guides/manage"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Quản lý hướng dẫn viên
                    </Link>
                  </RoleGuard>
                  
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-secondary">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" ref={mobileMenuRef}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? 'block rounded-md bg-primary-50 px-3 py-2 text-base font-medium text-primary-600'
                  : 'block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600'
              }
              onClick={() => setIsMobileMenuOpen(false)}
              end
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) =>
                isActive
                  ? 'block rounded-md bg-primary-50 px-3 py-2 text-base font-medium text-primary-600'
                  : 'block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600'
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bản đồ
            </NavLink>
            <NavLink
              to="/locations"
              className={({ isActive }) =>
                isActive
                  ? 'block rounded-md bg-primary-50 px-3 py-2 text-base font-medium text-primary-600'
                  : 'block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600'
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Địa điểm
            </NavLink>
            <NavLink
              to="/guides"
              className={({ isActive }) =>
                isActive
                  ? 'block rounded-md bg-primary-50 px-3 py-2 text-base font-medium text-primary-600'
                  : 'block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600'
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hướng dẫn
            </NavLink>
            
            {/* Guide-specific mobile navigation */}
            <RolesGuard roles={[UserRole.GUIDE, UserRole.ADMIN]}>
              <NavLink
                to="/guides/my-guides"
                className={({ isActive }) =>
                  isActive
                    ? 'block rounded-md bg-primary-50 px-3 py-2 text-base font-medium text-primary-600'
                    : 'block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Quản lý Tour
              </NavLink>
            </RolesGuard>
            
            {/* Admin-specific mobile navigation */}
            <RoleGuard role={UserRole.ADMIN}>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? 'block rounded-md bg-primary-50 px-3 py-2 text-base font-medium text-primary-600'
                    : 'block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Quản trị
              </NavLink>
            </RoleGuard>

            {/* Login/Register in mobile menu for non-authenticated users */}
            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng nhập
                </NavLink>
                <NavLink
                  to="/register"
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary-600 bg-primary-50 hover:bg-primary-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng ký
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                )}
                <span className="flex items-center gap-2">
                  {user.name || user.email.split('@')[0]}
                  {user.role && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      user.role === UserRole.ADMIN 
                        ? 'bg-red-100 text-red-800' 
                        : user.role === UserRole.GUIDE 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Trang cá nhân
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Địa điểm yêu thích
                  </Link>
                  <Link
                    to="/trips"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Chuyến đi của tôi
                  </Link>
                  
                  {/* Guide-specific options */}
                  {hasRole(user, UserRole.GUIDE) && (
                    <>
                      <hr className="my-1" />
                      <Link
                        to="/my-tours"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Quản lý Tour
                      </Link>
                      <Link
                        to="/create-tour"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Tạo Tour mới
                      </Link>
                    </>
                  )}
                  
                  {/* Admin-specific options */}
                  {hasRole(user, UserRole.ADMIN) && (
                    <>
                      <hr className="my-1" />
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Bảng điều khiển
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Quản lý người dùng
                      </Link>
                      <Link
                        to="/admin/locations"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Quản lý địa điểm
                      </Link>
                    </>
                  )}
                  
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-secondary">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
