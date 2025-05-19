// filepath: src/components/common/ThemeAnimationDemo.tsx
import { useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { AnimateElement } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, ZapIcon, ZapOffIcon } from 'lucide-react';

export function ThemeAnimationDemo() {
  const { theme, setTheme, enableAnimations, toggleAnimations } = useTheme();
  const [showDemo, setShowDemo] = useState(false);

  const isDark = theme === 'dark';

  return (
    <div className="border-border bg-card mx-auto max-w-3xl rounded-lg border p-6 shadow-md">
      <h2 className="text-card-foreground theme-transition-slow text-2xl font-bold">
        Theme Animation Demo
      </h2>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant={isDark ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
            className="theme-transition-fast gap-2"
          >
            <MoonIcon className="h-4 w-4 text-sky-300" />
            Dark Mode
          </Button>

          <Button
            variant={!isDark ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
            className="theme-transition-fast gap-2"
          >
            <SunIcon className="h-4 w-4 text-amber-500" />
            Light Mode
          </Button>
        </div>

        <Button
          variant={enableAnimations ? 'default' : 'outline'}
          size="sm"
          onClick={toggleAnimations}
          className="theme-transition-fast gap-2"
        >
          {enableAnimations ? (
            <>
              <ZapIcon className="h-4 w-4 text-yellow-400" />
              Animations On
            </>
          ) : (
            <>
              <ZapOffIcon className="h-4 w-4" />
              Animations Off
            </>
          )}
        </Button>
      </div>

      <div className="mt-8">
        <Button
          onClick={() => setShowDemo((prev) => !prev)}
          variant="outline"
          className="w-full"
        >
          {showDemo ? 'Hide Animations Demo' : 'Show Animations Demo'}
        </Button>
      </div>

      {showDemo && (
        <div className="border-border mt-6 rounded-md border p-4">
          <h3 className="mb-4 text-lg font-semibold">Animation Examples</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Fade Animation</h4>
              <AnimateElement animation="fade" delay={0.1}>
                <div className="bg-primary/10 h-24 rounded-md p-4 text-center">
                  Fade Animation
                </div>
              </AnimateElement>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Slide Up Animation</h4>
              <AnimateElement animation="slide-up" delay={0.2}>
                <div className="bg-primary/20 h-24 rounded-md p-4 text-center">
                  Slide Up Animation
                </div>
              </AnimateElement>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Slide In Animation</h4>
              <AnimateElement animation="slide-in" delay={0.3}>
                <div className="bg-primary/30 h-24 rounded-md p-4 text-center">
                  Slide In Animation
                </div>
              </AnimateElement>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Scale Animation</h4>
              <AnimateElement animation="scale" delay={0.4}>
                <div className="bg-primary/40 h-24 rounded-md p-4 text-center">
                  Scale Animation
                </div>
              </AnimateElement>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <h4 className="font-medium">Theme Transition Examples</h4>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="bg-background theme-transition-slow rounded-md p-4 text-center">
                Slow Transition
              </div>
              <div className="bg-card rounded-md p-4 text-center">
                Default Speed
              </div>
              <div className="bg-muted theme-transition-fast rounded-md p-4 text-center">
                Fast Transition
              </div>
              <div className="bg-accent theme-transition-none rounded-md p-4 text-center">
                No Transition
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
