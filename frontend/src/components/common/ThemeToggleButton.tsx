import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, Monitor } from 'lucide-react';

type ThemeToggleButtonProps = {
  className?: string;
  iconOnly?: boolean;
};

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ className = '', iconOnly = false }) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  // Xác định icon và văn bản dựa trên theme hiện tại
  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <MoonIcon className="h-4 w-4" />;
      case 'light':
        return <SunIcon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'dark':
        return t('theme.dark');
      case 'light':
        return t('theme.light');
      default:
        return t('theme.system');
    }
  };

  // Chuyển đổi theme theo thứ tự: light -> dark -> system -> light...
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Nếu chỉ hiển thị icon, sử dụng nút icon
  if (iconOnly) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className={`rounded-full border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground ${className}`}
        aria-label={t('theme.toggleTheme')}
        title={getThemeText()}
      >
        {getThemeIcon()}
      </Button>
    );
  }

  // Nếu hiển thị cả icon và văn bản
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={`flex items-center justify-start gap-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors ${className}`}
    >
      {getThemeIcon()}
      <span>{getThemeText()}</span>
    </Button>
  );
};
