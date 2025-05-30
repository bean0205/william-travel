// filepath: src/components/common/ThemeSwitch.tsx
import { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';

export function ThemeSwitch() {
  const { theme, setTheme, enableAnimations } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // After mounting, we can safely show the UI without hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme change with animation
  const handleThemeChange = () => {
    if (!enableAnimations) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      return;
    }

    setIsChanging(true);
    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');

      // Reset after animation completes
      setTimeout(() => {
        setIsChanging(false);
      }, 500);
    }, 50);
  };

  if (!mounted) {
    return <div className="h-10 w-10"></div>; // Placeholder to prevent layout shift
  }

  const isDark = theme === 'dark';

  return (
    <div className="relative inline-flex items-center">
      <div
        className={`relative ${isChanging ? 'scale-110 transform' : ''} transition-transform duration-300`}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`relative h-9 w-9 rounded-full border border-transparent bg-transparent transition-all duration-300 
                     ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'} 
                     ${isChanging ? 'shadow-lg' : ''}`}
          onClick={handleThemeChange}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <div className="theme-transition-slow absolute inset-0 overflow-hidden rounded-full">
            <div
              className={`absolute inset-0 bg-gradient-to-br from-blue-100 to-white transition-all duration-500 
                           ${isDark ? 'opacity-0' : 'opacity-100'}`}
            ></div>
            <div
              className={`absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 transition-all duration-500 
                           ${isDark ? 'opacity-100' : 'opacity-0'}`}
            ></div>
          </div>

          {/* Sun/Moon with enhanced animations */}
          <div className="relative z-10 flex h-9 w-9 items-center justify-center overflow-hidden">
            <SunIcon
              className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-in-out
                               ${
                                 isDark
                                   ? 'translate-y-10 rotate-[-90deg] scale-0 text-amber-500'
                                   : 'translate-y-0 rotate-0 scale-100 text-amber-500'
                               }`}
            />

            <MoonIcon
              className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-in-out
                               ${
                                 isDark
                                   ? 'translate-y-0 rotate-0 scale-100 text-sky-300'
                                   : '-translate-y-10 rotate-90 scale-0 text-sky-300'
                               }`}
            />

            {/* Additional visual effects */}
            <div
              className={`absolute h-10 w-10 rounded-full bg-yellow-300/20 transition-all duration-700 
                          ${isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-30'}`}
            ></div>

            <div
              className={`absolute h-10 w-10 rounded-full bg-blue-900/30 transition-all duration-700 
                          ${isDark ? 'scale-100 opacity-30' : 'scale-0 opacity-0'}`}
            ></div>
          </div>
        </Button>

        {/* Tooltip with animation */}
        <div
          className={`pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-1 text-xs 
                       font-medium transition-all duration-300
                       ${
                         isDark
                           ? 'bg-slate-800 text-slate-200'
                           : 'bg-slate-100 text-slate-800'
                       } 
                       ${isChanging ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
          {isDark ? 'Light mode' : 'Dark mode'}
        </div>
      </div>

      {/* Optional animation toggle */}
      {false && ( // Hidden by default, enable if needed
        <button
          onClick={() => {
            const { toggleAnimations } = useTheme();
            toggleAnimations();
          }}
          className="text-muted-foreground hover:text-foreground ml-2 text-xs underline"
        >
          {enableAnimations ? 'Disable animations' : 'Enable animations'}
        </button>
      )}
    </div>
  );
}
