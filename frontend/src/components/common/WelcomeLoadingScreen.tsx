import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Country } from '@/store/countryStore';
import { PlaneTakeoff, Compass, MapPin } from 'lucide-react';

interface WelcomeLoadingScreenProps {
  country: Country;
  onComplete: () => void;
  duration?: number; // Duration in milliseconds
}

const WelcomeLoadingScreen: React.FC<WelcomeLoadingScreenProps> = ({
  country,
  onComplete,
  duration = 3000,
}) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  // Create gradient colors based on country flag or continent
  const getGradientColors = (countryCode: string): string => {
    // Map of country codes to gradient styles
    const gradientMap: Record<string, string> = {
      // Asia - Warm colors
      VN: 'from-red-600 to-yellow-500',
      JP: 'from-red-500 to-white',
      CN: 'from-red-600 to-yellow-500',
      IN: 'from-orange-500 to-green-600',
      TH: 'from-blue-600 to-white via-red-600',
      SG: 'from-red-600 to-white',

      // Europe - Cool blues and purples
      FR: 'from-blue-600 to-white via-red-600',
      DE: 'from-black to-red-600 via-yellow-500',
      IT: 'from-green-600 to-white via-red-600',
      ES: 'from-red-600 to-yellow-500',
      GB: 'from-blue-600 to-red-600 via-white',

      // North America
      US: 'from-blue-600 to-red-600 via-white',
      CA: 'from-red-600 to-white',
      MX: 'from-green-600 to-white via-red-600',

      // South America - Vibrant greens and yellows
      BR: 'from-green-600 to-yellow-500 via-blue-600',
      AR: 'from-cyan-500 to-white',

      // Africa - Earth tones
      ZA: 'from-green-600 to-yellow-500 via-black',
      EG: 'from-red-600 to-black via-white',

      // Oceania
      AU: 'from-blue-600 to-red-600',
      NZ: 'from-blue-600 to-red-600 via-white',
    };

    // Return the specific gradient if available, otherwise a default
    return gradientMap[countryCode] || 'from-indigo-600 to-purple-500';
  };

  // Animation and timer effects
  useEffect(() => {
    // Animate progress from 0 to 100
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, duration / 100);

    // Complete loading after duration
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${getGradientColors(
        country.code
      )}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Flag */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 shadow-lg">
          <img
            src={country.flagUrl}
            alt={country.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200';
            }}
          />
        </div>

        {/* Welcome Message */}
        <h1 className="mb-2 text-3xl font-bold text-white">
          {t('welcomeLoading.welcomeTo', { countryName: country.name })}
        </h1>
        <p className="mb-6 text-lg text-white/80">
          {t('welcomeLoading.preparingExperience')}
        </p>

        {/* Loading animation */}
        <div className="relative mb-8 flex animate-bounce items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-white/10 blur-md"></div>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <PlaneTakeoff className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mb-2 h-1.5 w-64 overflow-hidden rounded-full bg-white/20">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm font-light text-white/70">
          {t('welcomeLoading.loading', { progress })}
        </p>

        {/* Travel facts */}
        <div className="mt-10 flex max-w-md flex-col gap-2">
          <div className="flex items-center justify-center gap-2 text-sm text-white/80">
            <Compass className="h-4 w-4" />
            <span>{t('welcomeLoading.didYouKnow')}</span>
          </div>
          <p className="text-sm italic text-white/60">
            "{t(`welcomeLoading.facts.${country.code}`, {
              defaultValue: t('welcomeLoading.facts.default', { countryName: country.name }),
            })}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLoadingScreen;
