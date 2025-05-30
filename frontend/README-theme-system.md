# Theme System Documentation

This document explains how the theme system (dark mode and light mode) works in the William Travel application.

## Overview

William Travel uses a comprehensive theming system that allows users to toggle between light, dark, and system-preferred themes. The theme system is built on:

1. **Tailwind Dark Mode**: Using the `dark:` variant for styling dark mode
2. **Theme Provider**: React context for managing theme state
3. **Theme Selector**: UI component for switching between themes
4. **Local Storage**: For persisting user theme preferences

## Implementation Details

### Theme Provider

The theme provider is a React context that manages the state of the current theme. It:

- Provides a theme context to all components
- Persists theme preference to localStorage
- Handles system theme preference changes
- Adds the appropriate class to the document root element

```tsx
// src/providers/ThemeProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

// ...theme provider implementation
```

### Theme Selector

The theme selector is a dropdown menu that allows users to switch between light, dark, and system themes.

```tsx
// src/components/common/ThemeSelector.tsx
import { useTheme } from "@/providers/ThemeProvider";
import { DropdownMenu, DropdownMenuContent, ... } from "@/components/ui/dropdown-menu";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";

// ...theme selector implementation
```

### CSS Variables

The theme system uses CSS variables defined in `index.css` to manage colors and other theme-specific values:

```css
:root {
  /* Light theme variables */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ...more variables */
}

.dark {
  /* Dark theme variables */
  --background: 222.2 47.4% 11.2%;
  --foreground: 210 40% 98%;
  /* ...more variables */
}
```

## Using Dark Mode in Components

### Basic Usage

To create components that respond to dark mode, use the `dark:` variant in your Tailwind classes:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  This text changes with the theme
</div>
```

### Best Practices

1. **Use CSS variables** where possible:

   ```tsx
   <div className="bg-background text-foreground">
     This uses theme variables
   </div>
   ```

2. **Test both modes** to ensure contrast and readability:

   - Ensure text remains readable in both modes
   - Use sufficient contrast for interactive elements
   - Test any animations or transitions in both modes

3. **Consider subtle differences** between modes:
   - Dark mode often needs softer shadows
   - Consider reducing brightness of images in dark mode
   - Use different border styles for proper separation

## Component Examples

### Header with Dark Mode Support

```tsx
<header className="bg-background/95 border-b border-border sticky top-0 z-10 shadow-sm backdrop-blur-sm">
  <div className="container px-4 py-3">
    <!-- Header content -->
  </div>
</header>
```

### Card with Dark Mode Support

```tsx
<Card className="overflow-hidden border transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
  <CardHeader>
    <CardTitle className="dark:text-white">Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground dark:text-gray-300">Card content</p>
  </CardContent>
</Card>
```

## Adding Dark Mode to New Components

When creating new components, follow these steps:

1. Use the base Shadcn UI component styling
2. Add `dark:` variants for background, text, and border colors
3. Test the component in both light and dark mode
4. Consider using the slate color palette for dark mode backgrounds
5. Use HSL colors to maintain consistent saturation across modes

## Technical Implementation

The dark mode is implemented using Tailwind's dark mode feature with the `class` strategy. The ThemeProvider component handles setting the `dark` class on the `<html>` element when dark mode is active.

This allows all `dark:` variants in Tailwind classes to take effect when dark mode is enabled.
