import  { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Globe,
  MoonIcon,
  SunIcon,
  Check,
  Monitor,
  Settings,
  ChevronDown,
} from 'lucide-react';

// Định nghĩa các ngôn ngữ hỗ trợ
const languages = [
  {
    code: 'en',
    name: 'English',
    localName: 'English',
    flag: '/flags/en.svg',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    localName: 'Tiếng Việt',
    flag: '/flags/vn.svg',
  },
];

// Các kiểu hiển thị
type DisplayMode = 'combined' | 'separated' | 'menu' | 'icon-only';
type DisplayStyle = 'minimal' | 'standard' | 'floating' | 'embedded';

interface SettingsToggleProps {
  /**
   * Kiểu hiển thị của component
   * - combined: Hiển thị một nút duy nhất mở dropdown với cả chuyển đổi theme và ngôn ngữ
   * - separated: Hiển thị hai nút riêng biệt cho theme và ngôn ngữ
   * - menu: Hiển thị một nút menu với dropdown chứa tất cả tùy chọn
   * - icon-only: Chỉ hiển thị các icon, không có text
   */
  mode?: DisplayMode;

  /**
   * Phong cách hiển thị
   * - minimal: Giao diện tối giản, chỉ có icon và text cần thiết
   * - standard: Giao diện tiêu chuẩn với viền và hiệu ứng hover
   * - floating: Giao diện nổi với đổ bóng và backdrop blur
   * - embedded: Giao diện nhúng vào header hoặc các thành phần khác
   */
  style?: DisplayStyle;

  /** Nội dung chữ hiển thị bên cạnh icon, áp dụng cho mode 'combined' và 'menu' */
  label?: string;

  /** Vị trí hiển thị dropdown (trái/phải) */
  position?: 'left' | 'right';

  /** Màu sắc theme cho component (auto = theo màu theme hiện tại) */
  colorScheme?: 'light' | 'dark' | 'auto';

  /** Cho phép hiển thị text bên cạnh icon */
  showText?: boolean;

  /** Kích thước của component */
  size?: 'sm' | 'md' | 'lg';

  /** Class bổ sung cho container */
  className?: string;

  /** Hiển thị tên ngôn ngữ hiện tại thay vì mã ngôn ngữ */
  showLanguageName?: boolean;
}

/**
 * Component SettingsToggle - Kết hợp chuyển đổi theme và ngôn ngữ trong một giao diện thống nhất
 */
export function SettingsToggle({
  mode = 'combined',
  style = 'standard',
  label = 'Settings',
  position = 'right',
  colorScheme = 'auto',
  showText = false,
  size = 'md',
  className = '',
  showLanguageName = false,
}: SettingsToggleProps) {
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Xác định theme hiện tại
  const isDark = theme === 'dark';

  // Xác định ngôn ngữ hiện tại
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Xác định màu sắc dựa trên colorScheme
  const isDarkMode = colorScheme === 'auto' ? isDark : colorScheme === 'dark';

  // Kích thước dựa trên prop size
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base',
  };

  // Icon kích thước
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  // Xử lý thay đổi theme
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setDropdownOpen(false);
  };

  // Cập nhật theme từ hệ thống
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        // Áp dụng lại theme để cập nhật UI
        setTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme]);

  // Xử lý thay đổi ngôn ngữ
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setDropdownOpen(false);
  };

  // Xác định style cho container
  const getContainerStyle = () => {
    switch (style) {
      case 'minimal':
        return 'bg-transparent';
      case 'floating':
        return 'bg-black/30 backdrop-blur-md border border-white/20 shadow-lg rounded-full p-1';
      case 'embedded':
        return 'bg-transparent border-none';
      default: // standard
        return isDarkMode
          ? 'bg-gray-900/50 hover:bg-gray-800/50'
          : 'bg-white/80 hover:bg-gray-100/80';
    }
  };

  // Xác định style cho button
  const getButtonStyle = () => {
    const baseStyle = `transition-all duration-300 ${sizeClasses[size]}`;

    switch (style) {
      case 'minimal':
        return `${baseStyle} ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200/50'}`;
      case 'floating':
        return `${baseStyle} ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200/50'}`;
      case 'embedded':
        return `${baseStyle} ${isDarkMode ? 'text-white hover:bg-transparent' : 'text-gray-700 hover:bg-transparent'}`;
      default: // standard
        return `${baseStyle} ${isDarkMode ? 'text-white' : 'text-gray-700'}`;
    }
  };

  // Component cho hiển thị combined (mode mặc định)
  const CombinedDisplay = () => (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-full ${getButtonStyle()} ${showText ? 'px-3' : ''}`}
        >
          <div className="flex items-center gap-2">
            <Settings size={iconSize} className="text-current" />
            {showText && <span>{label}</span>}
            {mode === 'menu' && <ChevronDown size={14} className="ml-1" />}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={position === 'left' ? 'start' : 'end'}
        className={`w-56 rounded-xl p-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}
      >
        <DropdownMenuLabel>{t('settings.preferences')}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-gray-500 dark:text-gray-400">
            {t('theme.settings')}
          </DropdownMenuLabel>

          <DropdownMenuItem
            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${
              theme === 'light' ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : ''
            }`}
            onClick={() => handleThemeChange('light')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <SunIcon size={16} className="text-amber-500" />
            </div>
            <span className="flex-1">{t('theme.light')}</span>
            {theme === 'light' && <Check size={16} className="text-primary-500" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${
              theme === 'dark' ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : ''
            }`}
            onClick={() => handleThemeChange('dark')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <MoonIcon size={16} className="text-indigo-500" />
            </div>
            <span className="flex-1">{t('theme.dark')}</span>
            {theme === 'dark' && <Check size={16} className="text-primary-500" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${
              theme === 'system' ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : ''
            }`}
            onClick={() => handleThemeChange('system')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Monitor size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
            <span className="flex-1">{t('theme.system')}</span>
            {theme === 'system' && <Check size={16} className="text-primary-500" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-gray-500 dark:text-gray-400">
            {t('language.changeLanguage')}
          </DropdownMenuLabel>

          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${
                currentLanguage.code === lang.code ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                {lang.flag ? (
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="h-4 w-4 rounded-sm object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-xs font-bold">{lang.code.toUpperCase()}</span>
                )}
              </div>
              <span className="flex-1">{lang.localName}</span>
              {currentLanguage.code === lang.code && <Check size={16} className="text-primary-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Component hiển thị riêng biệt cho theme và ngôn ngữ
  const SeparatedDisplay = () => (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={`relative rounded-full ${getButtonStyle()}`}
        onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="relative flex items-center justify-center">
          {isDark ? (
              <MoonIcon size={iconSize} className="text-indigo-500" />
          ) : (
              <SunIcon size={iconSize} className="text-amber-400" />
          )}
        </div>
      </Button>

      {/* Language Toggle - Đã cải thiện dropdown để tránh tràn */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`relative rounded-full ${getButtonStyle()} ${showText ? 'px-2.5' : ''}`}
            aria-label={t('language.changeLanguage')}
          >
            <div className="flex items-center">
              {/* Đã bỏ icon Globe */}
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                {showLanguageName
                  ? currentLanguage.name.substring(0, 2)
                  : currentLanguage.code.toUpperCase()}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={position === 'left' ? 'start' : 'end'}
          sideOffset={5}
          className="min-w-[180px] max-w-[200px] overflow-hidden rounded-xl p-1 bg-white text-gray-800 border border-gray-200 shadow-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                currentLanguage.code === lang.code
                  ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="flex w-6 items-center justify-center">
                {lang.flag ? (
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="h-4 w-4 rounded-sm object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-xs font-bold">{lang.code.toUpperCase()}</span>
                )}
              </span>
              <span className="flex-1 truncate">
                {lang.localName}
              </span>
              {currentLanguage.code === lang.code && (
                <Check className="h-4 w-4 flex-shrink-0 text-primary-500 dark:text-primary-400" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // Component hiển thị chỉ icon
  const IconOnlyDisplay = () => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full ${getButtonStyle()}`}
        onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
      >
        {isDark ? (
          <SunIcon size={16} className="text-amber-400" />
        ) : (
          <MoonIcon size={16} className="text-indigo-500" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${getButtonStyle()}`}
          >
            <Globe size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={position === 'left' ? 'start' : 'end'}
          className="min-w-[150px] overflow-hidden rounded-xl p-1 bg-white text-gray-800 border border-gray-200 shadow-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                currentLanguage.code === lang.code
                  ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="flex w-5 items-center justify-center">
                {lang.flag ? (
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="h-3 w-3 rounded-sm object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[10px] font-bold">{lang.code.toUpperCase()}</span>
                )}
              </span>
              <span className="flex-1">{lang.localName}</span>
              {currentLanguage.code === lang.code && (
                <Check className="h-3 w-3 text-primary-500 dark:text-primary-400" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // Render theo mode được chọn
  return (
    <div className={`inline-flex ${getContainerStyle()} ${className}`}>
      {mode === 'combined' && <CombinedDisplay />}
      {mode === 'separated' && <SeparatedDisplay />}
      {mode === 'menu' && <CombinedDisplay />}
      {mode === 'icon-only' && <IconOnlyDisplay />}
    </div>
  );
}
