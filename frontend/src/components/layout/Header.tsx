import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  HeartIcon
} from 'lucide-react';
import { SettingsToggle } from '@/components/common/SettingsToggle';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navItems = getNavItems();
  const { t } = useTranslation();

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
      default:
        return <GlobeIcon className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
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
              <div className="relative mr-2 flex h-8 w-8 overflow-hidden rounded-full bg-primary-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                <GlobeIcon className="m-auto h-5 w-5" />
                <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-amber-500"></div>
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-primary-700 dark:text-primary-500">
                  {t('appName')}
                </span>
                <span className="hidden md:inline-block text-xs font-medium ml-1 text-muted-foreground">
                  | {t('header.tagline')}
                </span>
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
            <div className="hidden sm:block">
              <LanguageSwitcher variant="ghost" size="sm" showText={false} />
            </div>

            {/* Settings toggle */}
            <SettingsToggle
              mode="separated"
              style="embedded"
              size="sm"
              colorScheme="auto"
              position="right"
            />

            {/* Book Now button (call-to-action) */}
            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex items-center gap-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <CameraIcon className="h-3.5 w-3.5" />
              <span>{t('header.bookNow')}</span>
            </Button>

            {/* User menu / login */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 rounded-full bg-transparent border-muted-foreground/20"
              >
                <Link to="/login">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('navigation.login')}</span>
                </Link>
              </Button>
            </div>

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
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <LanguageSwitcher variant="ghost" size="md" showText={true} />

                    <Button
                      variant="default"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white"
                    >
                      <CameraIcon className="h-4 w-4" />
                      {t('header.bookNow')}
                    </Button>
                  </div>

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
