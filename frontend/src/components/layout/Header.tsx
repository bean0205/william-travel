import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountryStore } from '@/store/countryStore';
import { getNavItems } from '@/routes/routes';
import { Button } from '@/components/ui/button';
import { SearchIcon, UserIcon, MenuIcon, XIcon } from 'lucide-react';
import { SettingsToggle } from '@/components/common/SettingsToggle';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedCountry } = useCountryStore();
  const location = useLocation();
  const navItems = getNavItems();
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
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
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`theme-transition-fast text-sm font-medium transition-colors rounded-md px-3 py-2 ${
                      isActive(item.path)
                        ? 'text-primary-600 underline underline-offset-4'
                        : 'text-foreground hover:text-primary-600 hover:bg-muted/50'
                    }`}
                  >
                    {t(`navigation.${item.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
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
                    className={`theme-transition-fast block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/20'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(`navigation.${item.label.toLowerCase()}`)}
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
