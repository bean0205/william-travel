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
  ChefHatIcon,
  BellIcon
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
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

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define primary navigation items to always show - adjusted for different screen sizes
  const primaryNavItems = navItems.slice(0, 4);

  // Define secondary navigation items for the dropdown
  const secondaryNavItems = navItems.slice(4);

  // Map icons to navigation items with margin-right
  const getNavIcon = (label: string) => {
    switch (label) {
      case 'home':
        return <HomeIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'mapExplorer':
        return <MapIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'locations':
        return <CompassIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'travelGuides':
      case 'guides':
        return <BookOpenIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'accommodations':
        return <BedIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'food':
        return <UtensilsIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'articles':
        return <FileTextIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'events':
        return <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'favorites':
        return <HeartIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      // New feature icons
      case 'tripPlanner':
        return <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'reviews':
        return <StarIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'community':
        return <UsersIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'recommendations':
        return <ThumbsUpIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'analytics':
        return <BarChartIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'support':
        return <HelpCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
      default:
        return <GlobeIcon className="h-4 w-4 mr-2 flex-shrink-0" />;
    }
  };

  // Get just the icon without margin for compact displays
  const getNavIconCompact = (label: string) => {
    switch (label) {
      case 'home':
        return <HomeIcon className="h-4 w-4 flex-shrink-0" />;
      case 'mapExplorer':
        return <MapIcon className="h-4 w-4 flex-shrink-0" />;
      case 'locations':
        return <CompassIcon className="h-4 w-4 flex-shrink-0" />;
      case 'travelGuides':
      case 'guides':
        return <BookOpenIcon className="h-4 w-4 flex-shrink-0" />;
      case 'accommodations':
        return <BedIcon className="h-4 w-4 flex-shrink-0" />;
      case 'food':
        return <UtensilsIcon className="h-4 w-4 flex-shrink-0" />;
      case 'articles':
        return <FileTextIcon className="h-4 w-4 flex-shrink-0" />;
      case 'events':
        return <CalendarIcon className="h-4 w-4 flex-shrink-0" />;
      case 'favorites':
        return <HeartIcon className="h-4 w-4 flex-shrink-0" />;
      // New feature icons
      case 'tripPlanner':
        return <CalendarIcon className="h-4 w-4 flex-shrink-0" />;
      case 'reviews':
        return <StarIcon className="h-4 w-4 flex-shrink-0" />;
      case 'community':
        return <UsersIcon className="h-4 w-4 flex-shrink-0" />;
      case 'recommendations':
        return <ThumbsUpIcon className="h-4 w-4 flex-shrink-0" />;
      case 'analytics':
        return <BarChartIcon className="h-4 w-4 flex-shrink-0" />;
      case 'support':
        return <HelpCircleIcon className="h-4 w-4 flex-shrink-0" />;
      default:
        return <GlobeIcon className="h-4 w-4 flex-shrink-0" />;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 shadow-md backdrop-blur-md' 
          : 'bg-gradient-to-r from-blue-50/90 via-white/80 to-emerald-50/90 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-800/95'
      }`}
    >
      {/* Decorative top border - visible on all devices */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500"></div>

      <div className="container mx-auto px-2 py-2 sm:px-3 sm:py-3 md:px-4 2xl:px-6">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link
              to="/home"
              className="flex items-center group"
              aria-label={t('appName')}
            >
              <div className="hidden sm:flex relative mr-2 h-9 w-9 overflow-hidden rounded-full bg-primary-600 text-white shadow-md">
                <GlobeIcon className="m-auto h-5 w-5" />
                <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-amber-500"></div>
              </div>
              <span className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-600">
                {t('appName')}
              </span>
            </Link>
          </div>

          {/* Desktop large navigation (>=1536px) - show all primary items with text */}
          <nav className="hidden 2xl:flex items-center space-x-1">
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
                aria-current={isActive(item.path) ? 'page' : undefined}
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

          {/* Desktop medium navigation (1280px - 1536px) - show 3 primary items with text, more compact */}
          <nav className="hidden xl:flex 2xl:hidden items-center space-x-0.5">
            {/* Show first 3 items on xl screens */}
            {primaryNavItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center text-sm font-medium transition-colors rounded-full px-2.5 py-2 ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold'
                    : 'text-foreground hover:text-primary-600 hover:bg-muted/50'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {getNavIcon(item.label)}
                <span className="text-xs whitespace-nowrap">{t(`navigation.${item.label}`)}</span>
              </Link>
            ))}

            {/* More dropdown for all remaining items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sm font-medium transition-colors rounded-full px-2.5 py-2"
                >
                  <MoreHorizontalIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs">{t('navigation.more')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  {[...primaryNavItems.slice(3), ...secondaryNavItems].map((item) => (
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
          </nav>

          {/* Tablet navigation - only icons for efficient space usage (md-lg-xl) */}
          <nav className="hidden md:flex xl:hidden items-center space-x-0.5">
            {/* Only show first 3 items as icons */}
            {primaryNavItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center text-sm font-medium transition-colors rounded-full w-9 h-9 ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-semibold'
                    : 'text-foreground hover:text-primary-600 hover:bg-muted/50'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
                title={t(`navigation.${item.label}`)}
              >
                {getNavIconCompact(item.label)}
                <span className="sr-only">{t(`navigation.${item.label}`)}</span>
              </Link>
            ))}

            {/* More dropdown for all remaining items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center justify-center rounded-full w-9 h-9"
                  title={t('navigation.more')}
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">{t('navigation.more')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  {[...primaryNavItems.slice(3), ...secondaryNavItems].map((item) => (
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
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            {/* Search button - Always visible */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground h-9 w-9"
              aria-label={t('search')}
            >
              <SearchIcon className="h-4 w-4" />
            </Button>

            {/* Desktop/Tablet only actions */}
            <div className="hidden sm:flex items-center gap-1">
              {/* Language switcher */}
              <LanguageButton />

              {/* Theme toggle */}
              <ThemeToggleButton />

              {/* Notifications button - only for authenticated users */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground relative h-9 w-9"
                      aria-label={t('notifications')}
                    >
                      <BellIcon className="h-4 w-4" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                        2
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Sample notifications - would come from a notifications store */}
                    <DropdownMenuItem className="flex flex-col items-start py-2">
                      <div className="flex gap-2 items-center w-full">
                        <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full">
                          <CalendarIcon className="h-3 w-3 text-primary-700 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {t('notifications.tripReminder')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('notifications.tripReminderContent')}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">30m</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start py-2">
                      <div className="flex gap-2 items-center w-full">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                          <UsersIcon className="h-3 w-3 text-amber-700 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {t('notifications.newComment')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('notifications.newCommentContent')}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">2h</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex justify-center">
                      <Button variant="ghost" size="sm">
                        {t('seeAll')}
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* User menu / login */}
            <div className="relative">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full bg-transparent border-muted-foreground/20 h-9"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.avatar || ''} alt={user?.full_name || 'User'} />
                        <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-300">
                          {user?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline-block max-w-16 md:max-w-24 truncate text-xs sm:text-sm">
                        {user?.full_name || 'User'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
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
                  className="gap-2 rounded-full bg-transparent border-muted-foreground/20 h-9"
                >
                  <Link to="/auth/login">
                    <UserIcon className="h-4 w-4" />
                    <span className="hidden sm:inline-block text-xs sm:text-sm">{t('navigation.login')}</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-muted-foreground"
                  aria-label={t('toggleMenu')}
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader className="text-left pb-4 border-b">
                  <SheetTitle>
                    <Link
                      to="/home"
                      className="flex items-center gap-2"
                    >
                      <div className="relative flex h-8 w-8 overflow-hidden rounded-full bg-primary-600 text-white shadow-md">
                        <GlobeIcon className="m-auto h-5 w-5" />
                        <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-amber-500"></div>
                      </div>
                      <span className="text-lg font-extrabold tracking-tight text-primary-700 dark:text-primary-500">
                        {t('appName')}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile User Profile */}
                <div className="py-6">
                  <div className="flex items-center gap-4 mb-4">
                    {isAuthenticated ? (
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
                            <Link to="/auth/login">
                              {t('navigation.login')}
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick actions grid */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
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

                    <ThemeToggleButton />
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

                {/* Mobile Navigation List */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-sm uppercase text-muted-foreground font-semibold tracking-wider">
                      {t('header.mainNavigation')}
                    </h3>
                    <nav className="space-y-1.5">
                      {primaryNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive(item.path)
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                              : 'hover:bg-muted/60'
                          }`}
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
                          className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive(item.path)
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                              : 'hover:bg-muted/60'
                          }`}
                        >
                          {getNavIcon(item.label)}
                          {t(`navigation.${item.label}`)}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Footer links */}
                <div className="mt-8 border-t pt-6 border-muted/20">
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                      {t('footer.privacyPolicy')}
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                      {t('footer.termsOfService')}
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                      {t('footer.contactUs')}
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
