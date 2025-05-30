// filepath: src/utils/themeScript.ts
// Script to be injected in the HTML to prevent flickering when switching themes
// This will detect the user's preference from localStorage or system preference
// and apply the appropriate theme class to the document element before the page loads

export const themeScript = `
(function() {
  try {
    const themeStorageKey = 'william-travel-theme';
    const animationStorageKey = 'william-travel-theme-animations';
    
    // Handle theme preference
    const storedTheme = localStorage.getItem(themeStorageKey);
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = storedTheme || 'system';
    
    if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Handle animation preference
    const storedAnimationPref = localStorage.getItem(animationStorageKey);
    const enableAnimations = storedAnimationPref !== null ? storedAnimationPref === 'true' : true;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldEnableAnimations = enableAnimations && !prefersReducedMotion;
    
    if (shouldEnableAnimations) {
      document.documentElement.classList.add('theme-animated');
      document.documentElement.classList.remove('no-animations');
      
      // Add a class to prevent transitions during page load
      document.documentElement.classList.add('no-transitions');
      
      // Remove the no-transitions class after the page has loaded
      window.addEventListener('load', function() {
        setTimeout(function() {
          document.documentElement.classList.remove('no-transitions');
        }, 100);
      });
    } else {
      document.documentElement.classList.add('no-animations');
      document.documentElement.classList.remove('theme-animated');
    }
  } catch (e) {
    console.error('Theme script error:', e);
  }
})();
`;

// Helper function to create a script element with the theme script
export function createThemeScript(): HTMLScriptElement {
  const script = document.createElement('script');
  script.innerHTML = themeScript;
  return script;
}
