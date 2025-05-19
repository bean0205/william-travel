# Shadcn/UI Implementation in Travel Website

This project uses Shadcn/UI components for a consistent, modern UI design across the application. Below are the components that have been implemented and customized.

## Core Components

### Layout Components

- **Header**: Modern navigation with responsive mobile menu
- **Footer**: Structured layout with Shadcn Button components for social links
- **CountryDisplay**: Banner showing selected country with contextual information
- **CountryIndicator**: Compact country indicator with change option

### Page Components

- **CountrySelectionPage**: Card-based country selection grid
- **HomePage**: Feature-rich homepage with dynamic country-specific content
- **HeroSection**: Gradient background with noise texture and responsive layout

### Feature Components

- **FeaturedLocations**: Grid of location cards with featured destinations
- **LocationCard**: Image card with hover effects for location details
- **GuideCard**: Card component for travel guides with author avatar
- **LocationsFilter**: Filter controls for searching and filtering locations

## UI Components

The following Shadcn/UI components have been implemented:

- **Button**: Various styles including default, outline, ghost, and link variants
- **Card**: Card, CardHeader, CardContent, and CardFooter components
- **Input**: Form input elements with consistent styling
- **Avatar**: User avatars with image and fallback support
- **Select**: Dropdown select menu for filtering options
- **Label**: Form labels with consistent styling

## Theme

The application uses a customized Shadcn/UI theme with:

- Color palette based on primary, secondary, and neutral colors
- Consistent spacing and typography
- Light theme with subtle gradients and shadows
- Responsive design that works across devices

## Styling Approach

- **Tailwind CSS**: Used for utility-based styling
- **CSS Variables**: Theme colors and properties defined in index.css
- **class-variance-authority**: For component variants
- **clsx** and **tailwind-merge**: For conditional class application

## Icons

Lucide React icons are used throughout the application for consistent visual elements.

## Future Enhancements

Potential improvements to consider:

- Dark mode support
- Additional components for more complex UI needs
- Animation refinements for smoother transitions
- Accessibility improvements
