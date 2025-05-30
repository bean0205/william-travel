# Travel Explorer Frontend

A modern React application for exploring travel destinations, built with TypeScript, Vite, and Zustand.

## Features

- **Interactive Maps**: Explore locations visually using MapLibre GL JS
- **Location Browsing**: View and filter travel destinations
- **Travel Guides**: Read guides and recommendations for different locations
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Language**: TypeScript
- **Framework**: React.js
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Maps**: MapLibre GL JS with react-map-gl
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Linting/Formatting**: ESLint and Prettier

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/travel-explorer.git
   cd travel-explorer/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root of the project with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_MAPLIBRE_STYLE_URL=https://api.maptiler.com/maps/streets/style.json?key=YOUR_MAPTILER_KEY
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── common/      # Shared components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── config/          # Configuration files
│   ├── features/        # Feature-specific modules
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── pages/           # Page components
│   ├── routes/          # Routing configuration
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── .eslintrc.cjs        # ESLint configuration
├── .gitignore           # Git ignore file
├── .prettierrc.json     # Prettier configuration
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run format` - Format code with Prettier

## License

This project is licensed under the MIT License - see the LICENSE file for details.
