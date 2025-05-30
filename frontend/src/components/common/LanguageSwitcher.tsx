import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

type Language = {
  code: string;
  name: string;
  localName: string;
  flag?: string;
};

const languages: Language[] = [
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

type LanguageSwitcherProps = {
  variant?: 'ghost' | 'outline' | 'minimal' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  position?: 'right' | 'left';
  darkMode?: boolean;
};

export function LanguageSwitcher({
  variant = 'ghost',
  size = 'md',
  showText = false,
  position = 'right',
  darkMode = false,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const lang = languages.find((lang) => lang.code === i18n.language);
    setCurrentLanguage(lang || languages[0]);
  }, [i18n.language]);

  const changeLanguage = (lang: Language) => {
    if (lang.code === currentLanguage?.code) return;

    setIsChanging(true);
    i18n.changeLanguage(lang.code);
    setCurrentLanguage(lang);

    // Reset animation state
    setTimeout(() => {
      setIsChanging(false);
    }, 500);
  };

  if (!currentLanguage) return null;

  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  // Variant mappings
  const getButtonStyles = () => {
    switch (variant) {
      case 'outline':
        return `border ${
          darkMode ? 'border-white/20 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-100'
        } ${showText ? 'px-3' : ''}`;
      case 'minimal':
        return `bg-transparent ${showText ? 'px-3' : ''}`;
      case 'pill':
        return `rounded-full ${
          darkMode
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        } ${showText ? 'px-3' : ''}`;
      default:
        return `${
          darkMode
            ? 'hover:bg-white/10 text-white'
            : 'hover:bg-gray-100'
        } ${showText ? 'px-3' : ''}`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative rounded-full transition-all duration-300 ${sizeClasses[size]} ${getButtonStyles()} ${
            isChanging ? 'scale-110' : ''
          }`}
          aria-label={t('language.changeLanguage')}
        >
          <div className={`flex items-center gap-2 ${isChanging ? 'animate-pulse' : ''}`}>
            <Globe className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
            {showText && (
              <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>
                {currentLanguage.code.toUpperCase()}
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={position === 'right' ? 'end' : 'start'}
        className="min-w-[180px] overflow-hidden rounded-xl p-1"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang)}
            className={`flex cursor-pointer gap-2 rounded-lg px-3 py-2 text-sm ${
              i18n.language === lang.code
                ? 'bg-primary-50 font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
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
            <span className="flex-1">{lang.localName}</span>
            {i18n.language === lang.code && (
              <Check className="h-4 w-4 text-primary-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
