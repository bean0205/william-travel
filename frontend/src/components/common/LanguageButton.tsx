import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

type LanguageButtonProps = {
  className?: string;
  iconOnly?: boolean;
};

export const LanguageButton: React.FC<LanguageButtonProps> = ({
  className = '',
  iconOnly = false
}) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);

  useEffect(() => {
    const lang = languages.find((lang) => lang.code === i18n.language);
    setCurrentLanguage(lang || languages[0]);
  }, [i18n.language]);

  const changeLanguage = (lang: Language) => {
    if (lang.code === currentLanguage?.code) return;
    i18n.changeLanguage(lang.code);
    setCurrentLanguage(lang);
  };

  if (!currentLanguage) return null;

  // Compact button for desktop
  if (iconOnly) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground ${className}`}
            aria-label={t('language.changeLanguage')}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                {lang.flag && (
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="mr-2 h-4 w-4 rounded-full"
                  />
                )}
                <span>{lang.localName}</span>
              </div>
              {lang.code === currentLanguage.code && (
                <Check className="ml-1 h-4 w-4 text-primary-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full button for mobile menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center justify-start gap-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors ${className}`}
        >
          {currentLanguage.flag && (
            <img
              src={currentLanguage.flag}
              alt={currentLanguage.name}
              className="h-4 w-4 rounded-full"
            />
          )}
          <span>{currentLanguage.localName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              {lang.flag && (
                <img
                  src={lang.flag}
                  alt={lang.name}
                  className="mr-2 h-4 w-4 rounded-full"
                />
              )}
              <span>{lang.localName}</span>
            </div>
            {lang.code === currentLanguage.code && (
              <Check className="ml-1 h-4 w-4 text-primary-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
