# Theme Animation System - Implementation Guide

This guide provides practical instructions for developers on how to implement the theme animation system in new components.

## Quick Reference

### Adding Animation Classes to Components

1. **Basic Transition**: Add `theme-transition-slow` or `theme-transition-fast` to elements

   ```tsx
   <div className="bg-background theme-transition-slow">
     Content with smooth theme transitions
   </div>
   ```

2. **Element-Specific Transitions**:

   - Large containers: `theme-transition-slow` (400ms)
   - Interactive elements: `theme-transition-fast` (150ms)
   - Text elements: `theme-transition-slow` for better readability

3. **Disabling Transitions**: Use `theme-transition-none` for elements that shouldn't animate
   ```tsx
   <div className="theme-transition-none">
     This content won't animate during theme changes
   </div>
   ```

## Implementation Steps

### 1. Container Elements

Apply transition classes to layout containers and major UI elements:

```tsx
// Example layout component
function MyLayout({ children }) {
  return (
    <div className="bg-background theme-transition-slow flex min-h-screen flex-col">
      <header className="border-border bg-card theme-transition-slow">
        {/* Header content */}
      </header>

      <main className="theme-transition-slow flex-1">{children}</main>

      <footer className="bg-muted theme-transition-slow">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

### 2. Interactive Elements

Apply faster transitions to buttons, inputs, and other interactive elements:

```tsx
<button
  className="bg-primary text-primary-foreground theme-transition-fast hover:bg-primary/90"
  onClick={handleClick}
>
  Click Me
</button>

<input
  className="border-input bg-background theme-transition-fast"
  type="text"
/>
```

### 3. Text Elements

Ensure smooth transitions for text elements:

```tsx
<h1 className="text-foreground theme-transition-slow text-2xl font-bold">
  This is a heading
</h1>

<p className="text-muted-foreground theme-transition-slow">
  This is a paragraph with smooth color transitions
</p>
```

### 4. Special Animations

For more dynamic animations, use the provided animation components:

```tsx
import { AnimateElement } from '@/components/common/PageTransition';

// Fade animation
<AnimateElement animation="fade">
  <div>This content fades in</div>
</AnimateElement>

// Scale animation with delay
<AnimateElement animation="scale" delay={0.2}>
  <div>This content scales in with a delay</div>
</AnimateElement>

// Slide animation
<AnimateElement animation="slide-up" duration={0.8}>
  <div>This content slides up</div>
</AnimateElement>
```

### 5. Page Transitions

To add transitions between pages, use the PageTransition component with React Router:

```tsx
import { PageTransition } from '@/components/common/PageTransition';

// In your route configuration
const MyPage = () => (
  <PageTransition>
    <div>My page content</div>
  </PageTransition>
);

// Or using the withPageTransition helper
const withPageTransition = (Component) => (props) => (
  <PageTransition>
    <Component {...props} />
  </PageTransition>
);

// Then in your routes
<Route path="/my-page" element={withPageTransition(MyPage)()} />;
```

## Testing and Debugging

### Animation Controls

Use the ThemeSettings component to toggle animations on/off for testing:

```tsx
import { ThemeSettings } from '@/components/common/ThemeSettings';

<ThemeSettings />;
```

### Browser Tools

1. Use browser dev tools to check if classes are applied correctly
2. Use the Animation inspector to debug animation timing
3. Test with "Reduced Motion" enabled in browser settings

## Best Practices

1. **Consistency**: Apply similar transition speeds to similar elements
2. **Performance**: Avoid animating expensive properties like `width` or `height`
3. **Accessibility**: Always support reduced motion preferences
4. **Testing**: Test animations in both light and dark modes
5. **Organization**: Group related animations for components

## Common Issues and Solutions

| Issue                   | Solution                                                  |
| ----------------------- | --------------------------------------------------------- |
| Animations not working  | Check if `theme-animated` class is on the root element    |
| Flickering on page load | Ensure `themeScript.ts` is properly injected in HTML head |
| Janky animations        | Use `will-change` property for smoother transitions       |
| Too many animations     | Limit animations to important UI elements only            |

Remember to always consider performance and accessibility when implementing animations!
