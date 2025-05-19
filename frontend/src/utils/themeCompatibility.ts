/**
 * Browser Compatibility Helper for Theme Animations
 * 
 * This script helps detect browser compatibility issues with animations
 * and provides solutions for specific browser quirks.
 */

// Check for browser support of CSS animations
export function checkAnimationSupport() {
  const supportChecks = {
    cssAnimations: 'animation' in document.documentElement.style,
    cssTransitions: 'transition' in document.documentElement.style,
    webkitTransitions: 'webkitTransition' in document.documentElement.style,
    webkitAnimations: 'webkitAnimation' in document.documentElement.style,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  };
  
  return supportChecks;
}

// Detect browser-specific issues
export function detectBrowserIssues() {
  const ua = navigator.userAgent;
  const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
  const isEdgeLegacy = ua.indexOf('Edge/') > -1;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isFirefox = ua.indexOf('Firefox') > -1;
  
  const issues = [];
  
  if (isIE || isEdgeLegacy) {
    issues.push({
      browser: isIE ? 'Internet Explorer' : 'Edge Legacy',
      issue: 'Limited animation support',
      solution: 'Use simplified animations or disable for this browser'
    });
  }
  
  if (isSafari) {
    issues.push({
      browser: 'Safari',
      issue: 'Potential flickering with CSS transitions',
      solution: 'Add -webkit-transform: translateZ(0) to animated elements'
    });
  }
  
  if (isFirefox) {
    issues.push({
      browser: 'Firefox',
      issue: 'Performance issues with complex animations',
      solution: 'Simplify animations and use hardware acceleration'
    });
  }
  
  return { 
    browserName: getBrowserName(ua),
    issues
  };
}

// Apply fixes for browser-specific issues
export function applyBrowserFixes() {
  const { browserName, issues } = detectBrowserIssues();
  
  if (issues.length === 0) return;
  
  // Add browser-specific CSS class to html element
  document.documentElement.classList.add(`browser-${browserName.toLowerCase()}`);
  
  // Add fixes for Safari flickering
  if (browserName === 'Safari') {
    const style = document.createElement('style');
    style.textContent = `
      .theme-animated .theme-transition-slow,
      .theme-animated .theme-transition-fast {
        -webkit-transform: translateZ(0);
        -webkit-backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add fixes for Firefox
  if (browserName === 'Firefox') {
    const style = document.createElement('style');
    style.textContent = `
      .theme-animated * {
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(style);
  }
  
  return issues;
}

// Helper to get browser name
function getBrowserName(ua) {
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Edge/') > -1) return 'EdgeLegacy';
  if (ua.indexOf('Edg/') > -1) return 'Edge';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  if (ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1) return 'IE';
  return 'Unknown';
}

// Monitor animation performance
export function monitorAnimationPerformance() {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  function countFrames() {
    frameCount++;
    const now = performance.now();
    
    if (now - lastTime > 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;
      
      // If FPS drops below 30 during animations, suggest optimizations
      if (fps < 30 && document.documentElement.classList.contains('theme-changing')) {
        console.warn('Animation performance issue detected. Consider simplifying animations.');
      }
    }
    
    requestAnimationFrame(countFrames);
  }
  
  requestAnimationFrame(countFrames);
  
  return {
    getFPS: () => fps
  };
}

// Init function to run all checks and apply fixes
export function initThemeCompatibilityChecks() {
  const support = checkAnimationSupport();
  const issues = applyBrowserFixes();
  
  // Disable animations for browsers with poor support
  if (issues && issues.some(issue => issue.issue === 'Limited animation support')) {
    document.documentElement.classList.remove('theme-animated');
    document.documentElement.classList.add('no-animations');
  }
  
  // Log compatibility info in development mode
  if (process.env.NODE_ENV === 'development') {
    console.info('[Theme Animation System] Browser compatibility check:', { 
      support, 
      issues,
      darkModeSupported: support.darkMode
    });
  }
  
  return { support, issues };
}
