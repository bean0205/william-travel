import { useState } from 'react';
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
  CalendarIcon
} from 'lucide-react';
import { SettingsToggle } from '@/components/common/SettingsToggle';
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
  const location = useLocation();
  const navItems = getNavItems();
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define primary navigation items to always show
  const primaryNavItems = navItems.slice(0, 3); // Show first 3 items
  
  // Define secondary navigation items for the dropdown
  const secondaryNavItems = navItems.slice(3);

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
        return <BookOpenIcon className="h-4 w-4 mr-2" />;
      case 'accommodations':
        return <BedIcon className="h-4 w-4 mr-2" />;
      case 'food':
        return <UtensilsIcon className="h-4 w-4 mr-2" />;
      case 'articles':
        return <FileTextIcon className="h-4 w-4 mr-2" />;
      case 'events':
        return <CalendarIcon className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <header className="border-border bg-background/95 theme-transition-slow sticky top-0 z-10 border-b shadow-md backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <span className="theme-transition-slow text-xl font-bold text-primary-600">
                {t('appName')}
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Primary nav items always visible */}
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`theme-transition-fast flex items-center text-sm font-medium transition-colors rounded-md px-3 py-2 ${
                  isActive(item.path)
                    ? 'text-primary-600 underline underline-offset-4'
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
                    className={`theme-transition-fast flex items-center text-sm font-medium transition-colors rounded-md px-3 py-2 ${
                      secondaryNavItems.some(item => isActive(item.path))
                        ? 'text-primary-600 underline underline-offset-4'
                        : 'text-foreground hover:text-primary-600 hover:bg-muted/50'
                    }`}
                  >
                    <MoreHorizontalIcon className="h-4 w-4 mr-1" />
                    {t('navigation.more')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t('navigation.exploreMore')}</DropdownMenuLabel>
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
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              className="theme-transition-fast rounded-full"
              aria-label={t('search')}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>

            {/* Settings toggle */}
            <SettingsToggle
              mode="separated"
              style="embedded"
              size="sm"
              colorScheme="auto"
              position="right"
            />

            {/* User menu / login */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="theme-transition-fast gap-2"
              >
                <Link to="/login">
                  <UserIcon className="h-4 w-4" />
                  {t('navigation.login')}
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="theme-transition-fast md:hidden"
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

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="animate-in slide-in-from-top-5 mt-4 duration-300 md:hidden">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`theme-transition-fast flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/20'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {getNavIcon(item.label)}
                    {t(`navigation.${item.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
