// filepath: src/components/common/ThemeSettings.tsx
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Settings2Icon,
  MoonIcon,
  SunIcon,
  MonitorIcon,
  ZapIcon,
  ZapOffIcon,
} from 'lucide-react';

export function ThemeSettings() {
  const { theme, setTheme, enableAnimations, toggleAnimations } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full bg-transparent"
          aria-label="Theme settings"
        >
          <Settings2Icon className="text-muted-foreground h-[18px] w-[18px] transition-all duration-300 ease-in-out" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="animate-in slide-in-from-top-2 theme-transition-slow w-56 duration-300"
      >
        <div className="flex flex-col gap-2 p-2">
          <p className="text-muted-foreground text-xs font-medium">Theme</p>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setTheme('light')}
            >
              <SunIcon className="h-[14px] w-[14px] text-amber-500" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setTheme('dark')}
            >
              <MoonIcon className="h-[14px] w-[14px] text-sky-300" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setTheme('system')}
            >
              <MonitorIcon className="h-[14px] w-[14px]" />
              <span>System</span>
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="flex flex-col gap-2 p-2">
          <p className="text-muted-foreground text-xs font-medium">
            Animations
          </p>
          <Button
            variant={enableAnimations ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start gap-2"
            onClick={toggleAnimations}
          >
            {enableAnimations ? (
              <>
                <ZapIcon className="h-[14px] w-[14px] text-yellow-400" />
                <span>Animations enabled</span>
              </>
            ) : (
              <>
                <ZapOffIcon className="h-[14px] w-[14px]" />
                <span>Animations disabled</span>
              </>
            )}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
