// filepath: src/providers/ThemeProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableAnimations?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  enableAnimations: boolean;
  toggleAnimations: () => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  enableAnimations: true,
  toggleAnimations: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'william-travel-theme',
  enableAnimations = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [animations, setAnimations] = useState<boolean>(() => {
    const savedPref = localStorage.getItem(`${storageKey}-animations`);
    return savedPref !== null ? savedPref === 'true' : enableAnimations;
  });
  useEffect(() => {
    const root = window.document.documentElement;

    // First apply the theme
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Then handle animations
    if (animations) {
      root.classList.add('theme-animated');
      root.classList.remove('no-animations');
    } else {
      root.classList.remove('theme-animated');
      root.classList.add('no-animations');
    }

    // Apply animation class briefly to trigger transitions
    if (animations) {
      root.classList.add('theme-changing');
      const timer = setTimeout(() => {
        root.classList.remove('theme-changing');
      }, 700); // Match this to the longest transition duration

      return () => clearTimeout(timer);
    }
  }, [theme, animations]);

  // Run compatibility check on mount
  useEffect(() => {
    try {
      // Dynamically import compatibility module to avoid issues in SSR
      import('@/utils/themeCompatibility').then(
        ({ initThemeCompatibilityChecks }) => {
          initThemeCompatibilityChecks();
        }
      );
    } catch (error) {
      console.warn('Failed to run theme compatibility checks:', error);
    }
  }, []);

  useEffect(() => {
    // Add the transition styles dynamically
    const style = document.createElement('style');
    style.setAttribute('id', 'theme-transition-styles');
    style.textContent = `
      /* Base transition for themed elements */
      .theme-animated * {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
      }
      
      /* Enhanced transitions for theme-changing state */
      .theme-changing .theme-transition-slow {
        transition-duration: 600ms;
      }
      
      .theme-changing .theme-transition-fast {
        transition-duration: 150ms;
      }
      
      /* Specific element transitions */
      .theme-changing .bg-background {
        transition-duration: 400ms;
      }
      
      .theme-changing .text-foreground {
        transition-duration: 300ms;
      }
      
      /* Disable transitions when needed */
      .no-animations * {
        transition: none !important;
      }
      
      /* Additional animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes scaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes slideInFromTop {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .theme-fade-in {
        animation: fadeIn 300ms ease-out forwards;
      }
      
      .theme-scale-in {
        animation: scaleIn 300ms ease-out forwards;
      }
      
      .theme-slide-in {
        animation: slideInFromTop 300ms ease-out forwards;
      }
    `;

    // Remove any existing styles first
    const existingStyles = document.getElementById('theme-transition-styles');
    if (existingStyles) {
      existingStyles.remove();
    }

    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    enableAnimations: animations,
    toggleAnimations: () => {
      const newValue = !animations;
      localStorage.setItem(`${storageKey}-animations`, String(newValue));
      setAnimations(newValue);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
