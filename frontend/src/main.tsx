import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/transitions-import.css'; // Import transitions first
import './styles/index.css';
import { themeScript } from './utils/themeScript';
import './i18n/i18n'; // Initialize i18n
import LoadingSpinner from './components/common/LoadingSpinner';

// Inject theme script to handle theme before React hydration
// This prevents flashing of wrong theme on page load
const scriptElement = document.createElement('script');
scriptElement.innerHTML = themeScript;
document.head.appendChild(scriptElement);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSpinner />}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
