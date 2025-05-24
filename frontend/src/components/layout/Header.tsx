import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getNavItems } from '@/routes/routes';
import { Button } from '@/components/ui/button';
import { 
  SearchIcon, 
  UserIcon, 
  MenuIcon, 
  XIcon, 
  MapIcon,
  HomeIcon,
  CompassIcon,
  BookOpenIcon,
  MoreHorizontalIcon,
  BedIcon,
  UtensilsIcon,
  FileTextIcon,
  CalendarIcon,
  GlobeIcon,
  CameraIcon,
  HeartIcon,
  StarIcon,
  UsersIcon,
  ThumbsUpIcon,
  BarChartIcon,
  HelpCircleIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldIcon,
  BookmarkIcon,
  ChefHatIcon
} from 'lucide-react';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { LanguageButton } from '@/components/common/LanguageButton';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = getNavItems();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth verification failed:', error);
      }
    };
    
    verifyAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Control body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent scrolling on body when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when mobile menu is closed
      document.body.style.overflow = '';
    }

    return () => {
      // Cleanup - ensure scrolling is re-enabled when component unmounts
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define primary navigation items to always show
  const primaryNavItems = navItems.slice(0, 4); // Show first 4 items

  // Define secondary navigation items for the dropdown
  const secondaryNavItems = navItems.slice(4);

  // Map icons to navigation items
  const getNavIcon = (label: string) => {
    switch (label) {
      case 'home':
        return <HomeIcon className="h-4 w-4 mr-2" />;
      case 'mapExplorer':
        return <MapIcon className="h-4 w-4 mr-2" />;
      case 'locations':
        return <CompassIcon className="h-4 w-4 mr-2" />;
      case 'travelGuides':
      case 'guides':
        return <BookOpenIcon className="h-4 w-4 mr-2" />;
      case 'accommodations':
        return <BedIcon className="h-4 w-4 mr-2" />;
      case 'food':
        return <UtensilsIcon className="h-4 w-4 mr-2" />;
      case 'articles':
        return <FileTextIcon className="h-4 w-4 mr-2" />;
      case 'events':
        return <CalendarIcon className="h-4 w-4 mr-2" />;
      case 'favorites':
        return <HeartIcon className="h-4 w-4 mr-2" />;
      // New feature icons
      case 'tripPlanner':
        return <CalendarIcon className="h-4 w-4 mr-2" />;
      case 'reviews':
        return <StarIcon className="h-4 w-4 mr-2" />;
      case 'community':
        return <UsersIcon className="h-4 w-4 mr-2" />;
      case 'recommendations':
        return <ThumbsUpIcon className="h-4 w-4 mr-2" />;
      case 'analytics':
        return <BarChartIcon className="h-4 w-4 mr-2" />;
      case 'support':
        return <HelpCircleIcon className="h-4 w-4 mr-2" />;
      default:
        return <GlobeIcon className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled && !mobileMenuOpen 
          ? 'bg-white/90 dark:bg-slate-900/90 shadow-md backdrop-blur-md' 
          : 'bg-gradient-to-r from-blue-50/90 via-white/80 to-emerald-50/90 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-800/90'
      }`}
    >
      {/* Travel-themed decorative banner */}
      <div className="hidden md:block h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500"></div>

      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center group">
              <div>
                <span className="text-lg font-extrabold tracking-tight text-primary-700 dark:text-primary-500">
                  {t('appName')}
                </span>
                {/*<span className="hidden md:inline-block text-xs font-medium ml-1 text-muted-foreground">*/}
                {/*  | {t('header.tagline')}*/}
                {/*</span>*/}
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Primary nav items always visible */}
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center text-sm font-medium transition-colors rounded-full px-3 py-2 ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold'
                    : 'text-foreground hover:text-primary-600 hover:bg-muted/50'
                }`}
              >
                {getNavIcon(item.label)}
                {t(`navigation.${item.label}`)}
              </Link>
            ))}
            
            {/* More dropdown for secondary nav items */}
            {secondaryNavItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`flex items-center text-sm font-medium transition-colors rounded-full px-3 py-2 ${
                      secondaryNavItems.some(item => isActive(item.path))
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold'
                        : 'text-foreground hover:text-primary-600 hover:bg-muted/50'
                    }`}
                  >
                    <MoreHorizontalIcon className="h-4 w-4 mr-1" />
                    {t('navigation.more')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl overflow-hidden border-none shadow-lg">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 px-3 py-2">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <CompassIcon className="h-4 w-4 text-primary-500" />
                      <span>{t('navigation.exploreMore')}</span>
                    </DropdownMenuLabel>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {secondaryNavItems.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className={`w-full flex items-center ${
                            isActive(item.path) ? 'text-primary-600 font-medium' : ''
                          }`}
                        >
                          {getNavIcon(item.label)}
                          {t(`navigation.${item.label}`)}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop only actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search button */}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={t('search')}
              >
                <SearchIcon className="h-4 w-4" />
              </Button>

              {/* Language switcher - compact mode */}
              <LanguageButton />

              {/* Settings toggle */}
              <ThemeToggleButton />              {/* User menu / login */}
              <div className="relative">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-full bg-transparent border-muted-foreground/20"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user?.avatar || ''} alt={user?.full_name || 'User'} />
                          <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-300">
                            {user?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline-block">{user?.full_name || 'User'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>{user?.full_name}</span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                          {user?.role && (
                            <span className="text-xs mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 rounded-full inline-block w-fit">
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>{t('navigation.profile')}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/favorites" className="flex items-center">
                          <HeartIcon className="mr-2 h-4 w-4" />
                          <span>{t('navigation.favorites')}</span>
                        </Link>
                      </DropdownMenuItem>
                        {/* Admin panel link - only show if user is admin */}
                      {(user?.role === 'admin' || user?.is_superuser) && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center">
                            <ShieldIcon className="mr-2 h-4 w-4" />
                            <span>{t('navigation.adminPanel')}</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      
                      {/* Guide panel link - only show if user is guide */}
                      {user?.role === 'guide' && (
                        <DropdownMenuItem asChild>
                          <Link to="/guides/my-guides" className="flex items-center">
                            <ChefHatIcon className="mr-2 h-4 w-4" />
                            <span>{t('navigation.guidePanel')}</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          <span>{t('navigation.settings')}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center text-red-600 focus:text-red-600" 
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                      >
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>{t('navigation.logout')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2 rounded-full bg-transparent border-muted-foreground/20"
                  >
                    <Link to="auth/login">
                      <UserIcon className="h-4 w-4" />
                      <span>{t('navigation.login')}</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Book Now button visible on mobile */}
            <Button
              variant="default"
              size="sm"
              className="md:hidden flex items-center gap-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <CameraIcon className="h-3.5 w-3.5" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={toggleMobileMenu}
              aria-label={t('toggleMenu')}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile navigation - Redesigned with beautiful animation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="animate-in slide-in-from-top-5 fade-in-20 fixed inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-4 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <Link to="/home" className="flex items-center group" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative mr-2 flex h-8 w-8 overflow-hidden rounded-full bg-primary-600 text-white shadow-md">
                      <GlobeIcon className="m-auto h-5 w-5" />
                      <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-amber-500"></div>
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-primary-700 dark:text-primary-500">
                      {t('appName')}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMobileMenu}
                    aria-label={t('close')}
                    className="text-muted-foreground hover:bg-muted"
                  >
                    <XIcon className="h-5 w-5" />
                  </Button>
                </div>                {/* User Profile and Actions Section */}
                <div className="mb-8 py-4 px-3 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-4 mb-4">                    {isAuthenticated ? (
                      <>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user?.avatar || ''} alt={user?.full_name || ''} />
                          <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                            {user?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{t('header.welcomeBack')}</h3>
                          <p className="text-sm text-muted-foreground">{user?.full_name}</p>
                          <Button
                            variant="link"
                            className="p-0 h-auto font-semibold text-primary-600"
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                          >
                            {t('navigation.logout')}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                          <UserIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{t('header.welcome')}</h3>
                          <Button asChild variant="link" className="p-0 h-auto font-semibold text-primary-600">
                            <Link to="auth/login" onClick={() => setMobileMenuOpen(false)}>
                              {t('navigation.login')}
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>                  <div className="grid grid-cols-2 gap-2">
                    {/* Search Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start gap-2 rounded-lg"
                      aria-label={t('search')}
                    >
                      <SearchIcon className="h-4 w-4" />
                      <span>{t('search')}</span>
                    </Button>
                    
                    {isAuthenticated && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex items-center justify-start gap-2 rounded-lg"
                      >
                        <Link to="/profile">
                          <UserIcon className="h-4 w-4" />
                          <span>{t('navigation.profile')}</span>
                        </Link>
                      </Button>
                    )}

                    {/* Theme Toggle Button */}
                    <ThemeToggleButton />

                    {/* Language Switcher Button */}
                    <LanguageButton />
                    
                    {isAuthenticated && (user?.role === 'admin' || user?.is_superuser) && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex items-center justify-start gap-2 rounded-lg"
                      >
                        <Link to="/admin">
                          <ShieldIcon className="h-4 w-4" />
                          <span>{t('navigation.adminPanel')}</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-sm uppercase text-muted-foreground font-semibold tracking-wider">
                      {t('header.mainNavigation')}
                    </h3>
                    <nav className="space-y-1.5">
                      {primaryNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center rounded-lg px-4 py-3 text-base transition-colors ${
                            isActive(item.path)
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                              : 'hover:bg-muted/60'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {getNavIcon(item.label)}
                          {t(`navigation.${item.label}`)}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm uppercase text-muted-foreground font-semibold tracking-wider">
                      {t('navigation.exploreMore')}
                    </h3>
                    <nav className="space-y-1.5">
                      {secondaryNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center rounded-lg px-4 py-3 text-base transition-colors ${
                            isActive(item.path)
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                              : 'hover:bg-muted/60'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {getNavIcon(item.label)}
                          {t(`navigation.${item.label}`)}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6 border-muted/20">
                  <div className="mt-6 flex items-center justify-center space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                      {t('footer.privacyPolicy')}
                    </a>
                    <span className="text-muted-foreground">•</span>
                    <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                      {t('footer.termsOfService')}
                    </a>
                    <span className="text-muted-foreground">•</span>
                    <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                      {t('footer.contactUs')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
