import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Country } from '@/store/countryStore';
import {
  PlaneTakeoff,
  Compass,
  Clock,
  Cloud,
  Sun,
  Volume2,
  VolumeX,
  SkipForward,
  InfoIcon,
  X
} from 'lucide-react';

interface WelcomeLoadingScreenProps {
  country: Country;
  onComplete: () => void;
  duration?: number; // Duration in milliseconds
  userName?: string;
}

// Cultural landmarks by country
const culturalLandmarks: Record<string, {icon: string, name: string}[]> = {
  FR: [
    { icon: '🗼', name: 'Eiffel Tower' },
    { icon: '🥖', name: 'Baguette' },
    { icon: '🍷', name: 'Wine' }
  ],
  IT: [
    { icon: '🏛️', name: 'Colosseum' },
    { icon: '🍕', name: 'Pizza' },
    { icon: '🍝', name: 'Pasta' }
  ],
  JP: [
    { icon: '⛩️', name: 'Torii Gate' },
    { icon: '🗻', name: 'Mt. Fuji' },
    { icon: '🍣', name: 'Sushi' }
  ],
  US: [
    { icon: '🗽', name: 'Statue of Liberty' },
    { icon: '🌉', name: 'Golden Gate Bridge' },
    { icon: '🍔', name: 'Burger' }
  ],
  GB: [
    { icon: '🏰', name: 'Big Ben' },
    { icon: '👑', name: 'Crown' },
    { icon: '🫖', name: 'Tea' }
  ],
  VN: [
    { icon: '🏮', name: 'Lantern' },
    { icon: '🍜', name: 'Pho' },
    { icon: '🛵', name: 'Scooter' }
  ],
  CN: [
    { icon: '🧧', name: 'Red Envelope' },
    { icon: '🐉', name: 'Dragon' },
    { icon: '🥢', name: 'Chopsticks' }
  ],
  IN: [
    { icon: '🕌', name: 'Taj Mahal' },
    { icon: '🐘', name: 'Elephant' },
    { icon: '🍛', name: 'Curry' }
  ],
  // Add more countries as needed
};

// Default landmarks for countries not in the map
const defaultLandmarks = [
  { icon: '✈️', name: 'Travel' },
  { icon: '🏨', name: 'Hotel' },
  { icon: '📸', name: 'Camera' }
];

const WelcomeLoadingScreen: React.FC<WelcomeLoadingScreenProps> = ({
                                                                     country,
                                                                     onComplete,
                                                                     duration = 3500,
                                                                     userName,
                                                                   }) => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const planePathRef = useRef<HTMLDivElement>(null);
  const waypointsRef = useRef<HTMLDivElement[]>([]);

  // Get greeting in local language
  const getLocalGreeting = (countryCode: string): {text: string, language: string} => {
    const greetings: Record<string, {text: string, language: string}> = {
      FR: { text: 'Bonjour!', language: 'French' },
      IT: { text: 'Ciao!', language: 'Italian' },
      ES: { text: '¡Hola!', language: 'Spanish' },
      DE: { text: 'Guten Tag!', language: 'German' },
      JP: { text: 'こんにちは!', language: 'Japanese' },
      CN: { text: '你好!', language: 'Chinese' },
      KR: { text: '안녕하세요!', language: 'Korean' },
      RU: { text: 'Привет!', language: 'Russian' },
      AR: { text: 'مرحبا!', language: 'Arabic' },
      TH: { text: 'สวัสดี!', language: 'Thai' },
      VN: { text: 'Xin chào!', language: 'Vietnamese' },
      PT: { text: 'Olá!', language: 'Portuguese' },
      GR: { text: 'Γειά σου!', language: 'Greek' },
      NL: { text: 'Hallo!', language: 'Dutch' },
      SE: { text: 'Hej!', language: 'Swedish' },
      IL: { text: 'שלום!', language: 'Hebrew' },
      FI: { text: 'Hei!', language: 'Finnish' },
      TR: { text: 'Merhaba!', language: 'Turkish' },
      PL: { text: 'Cześć!', language: 'Polish' },
      CZ: { text: 'Ahoj!', language: 'Czech' },
    };

    return greetings[countryCode] || { text: 'Hello!', language: 'English' };
  };

  // Create gradient colors based on country flag or continent
  const getGradientColors = (countryCode: string): string => {
    // Map of country codes to gradient styles with more vibrant combinations
    const gradientMap: Record<string, string> = {
      // Asia - Warm colors
      VN: 'from-red-600 via-yellow-500 to-red-600',
      JP: 'from-red-500 via-white to-red-500',
      CN: 'from-red-600 via-yellow-500 to-red-600',
      IN: 'from-orange-500 via-white to-green-600',
      TH: 'from-blue-600 via-white to-red-600',
      SG: 'from-red-600 via-white to-red-600',

      // Europe - Cool blues and purples
      FR: 'from-blue-600 via-white to-red-600',
      DE: 'from-black via-red-600 to-yellow-500',
      IT: 'from-green-600 via-white to-red-600',
      ES: 'from-red-600 via-yellow-500 to-red-600',
      GB: 'from-blue-600 via-white to-red-600',

      // North America
      US: 'from-blue-600 via-white to-red-600',
      CA: 'from-red-600 via-white to-red-600',
      MX: 'from-green-600 via-white to-red-600',

      // South America - Vibrant greens and yellows
      BR: 'from-green-600 via-yellow-500 to-blue-600',
      AR: 'from-sky-500 via-white to-sky-500',

      // Africa - Earth tones
      ZA: 'from-green-600 via-yellow-500 to-black',
      EG: 'from-red-600 via-white to-black',

      // Oceania
      AU: 'from-red-600 via-white to-blue-600',
      NZ: 'from-blue-600 via-white to-red-600',
    };

    // Return the specific gradient if available, otherwise a default
    return gradientMap[countryCode] || 'from-indigo-600 via-purple-400 to-indigo-600';
  };

  // Animation for moving particles
  useEffect(() => {
    if (particlesRef.current) {
      const particles = particlesRef.current;
      const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full bg-white/20 backdrop-blur-sm';

        // Random size between 4px and 15px
        const size = Math.floor(Math.random() * 12) + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;

        // Random speed
        const speed = Math.random() * 3 + 1;
        const direction = Math.random() > 0.5 ? 1 : -1;

        // Animation
        const animate = () => {
          const top = parseFloat(particle.style.top);
          const left = parseFloat(particle.style.left);

          if (top <= -50) {
            particles.removeChild(particle);
            return;
          }

          particle.style.top = `${top - speed}px`;
          particle.style.left = `${left + (direction * Math.sin(top / 30))}px`;

          requestAnimationFrame(animate);
        };

        particles.appendChild(particle);
        animate();
      };

      // Create particles at intervals
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance to create a particle
          createParticle();
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, []);

  // Simulate weather and time information
  useEffect(() => {
    // Simulate weather data
    const weatherTypes = ['☀️ Sunny', '🌤️ Partly Cloudy', '⛅ Cloudy', '🌧️ Rainy', '❄️ Snowy'];
    const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    setCurrentWeather(randomWeather);

    // Simulate time based on timezone
    const getLocalTime = () => {
      const timezoneOffsets: Record<string, number> = {
        JP: 9, CN: 8, SG: 8, TH: 7, VN: 7, IN: 5.5,
        FR: 1, DE: 1, IT: 1, ES: 1, GB: 0,
        US: -5, CA: -5, MX: -6,
        BR: -3, AR: -3,
        AU: 10, NZ: 12
      };

      const offset = timezoneOffsets[country.code] || 0;
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const localTime = new Date(utc + (3600000 * offset));
      return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    setCurrentTime(getLocalTime());

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(getLocalTime());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [country.code]);

  // Animate progress from 0 to 100
  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, duration / 100);

    // Show skip button after a delay
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 1500);

    // Complete loading after duration
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      clearTimeout(skipTimer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [duration, onComplete]);

  // Handle plane animation along the path
  useEffect(() => {
    if (planePathRef.current) {
      const planePath = planePathRef.current;
      const planeElement = planePath.querySelector('.plane-indicator') as HTMLDivElement;

      if (planeElement) {
        // Animate the plane along the path based on progress
        const updatePlanePosition = () => {
          const pathLength = planePath.offsetWidth;
          const position = (progress / 100) * pathLength;
          planeElement.style.left = `${position}px`;

          // Update active waypoint
          waypointsRef.current.forEach((waypoint, index) => {
            const waypointPos = (index + 1) * (pathLength / 4);
            if (position >= waypointPos) {
              waypoint.classList.add('active');
            } else {
              waypoint.classList.remove('active');
            }
          });
        };

        updatePlanePosition();
      }
    }
  }, [progress]);

  // Get cultural landmarks for the country
  const getLandmarks = () => {
    return culturalLandmarks[country.code] || defaultLandmarks;
  };

  // Get local greeting
  const greeting = getLocalGreeting(country.code);

  // Handle audio
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(!muted);
    }
  };

  return (
      <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${getGradientColors(country.code)}`}
      >
        {/* Moving background gradient */}
        <div
            className="absolute inset-0 bg-cover bg-center animate-pulse-slow"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&w=1920&q=5')`,
              backgroundBlendMode: 'overlay',
              opacity: 0.1
            }}
        ></div>

        {/* Moving particles */}
        <div ref={particlesRef} className="absolute inset-0 overflow-hidden"></div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl animate-float"></div>
          <div className="absolute top-2/3 right-1/4 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-2/3 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: '1.5s'}}></div>
        </div>

        {/* Cultural symbols floating around */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {getLandmarks().map((landmark, index) => (
              <div
                  key={index}
                  className="absolute animate-float"
                  style={{
                    left: `${10 + (index * 30)}%`,
                    top: `${20 + (index * 20)}%`,
                    animationDelay: `${index * 0.7}s`,
                    animationDuration: `${5 + index}s`
                  }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{landmark.icon}</span>
                  <span className="mt-2 text-xs font-light text-white/60">{landmark.name}</span>
                </div>
              </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
          {/* Local greeting */}
          <div className="mb-3 animate-fade-in">
            <p className="text-lg font-light text-white/80">
              <span className="mr-2 text-2xl">{greeting.text}</span>
              <span className="text-xs opacity-70">({greeting.language})</span>
            </p>
          </div>

          {/* Flag with animation */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 shadow-lg animate-pulse-slow hover:animate-spin">
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
          <h1 className="mb-2 text-3xl font-bold text-white animate-slide-in">
            {userName
                ? t('welcomeLoading.welcomeUserTo', { userName, countryName: country.name })
                : t('welcomeLoading.welcomeTo', { countryName: country.name })}
          </h1>
          <p className="mb-6 text-lg text-white/80 animate-fade-in" style={{animationDelay: '0.3s'}}>
            {t('welcomeLoading.preparingExperience')}
          </p>

          {/* Weather and time info */}
          <div className="mb-6 flex gap-4 rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm animate-slide-in" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/90">{currentTime}</span>
            </div>
            <div className="flex items-center gap-1">
              {currentWeather?.includes('Sunny') ? (
                  <Sun className="h-4 w-4 text-yellow-300" />
              ) : (
                  <Cloud className="h-4 w-4 text-white/70" />
              )}
              <span className="text-sm text-white/90">{currentWeather}</span>
            </div>
          </div>

          {/* Loading animation - Upgraded with plane path */}
          <div className="mb-8 w-64 animate-fade-in" style={{animationDelay: '0.7s'}}>
            <div ref={planePathRef} className="relative h-12 w-full">
              {/* Path with dots */}
              <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/20">
                {/* Waypoints */}
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        ref={(el) => { if (el) waypointsRef.current[i] = el; }}
                        className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 transition-all duration-300"
                        style={{ left: `${(i + 1) * 25}%` }}
                    >
                      {/* Waypoint label */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-light text-white/60">
                        {i === 0 && '🏠'}
                        {i === 1 && '✈️'}
                        {i === 2 && '🌍'}
                        {i === 3 && '🏨'}
                      </div>
                    </div>
                ))}

                {/* Progress overlay */}
                <div
                    className="absolute top-0 h-full rounded-full bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>

                {/* Plane indicator */}
                <div
                    className="plane-indicator absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                    style={{ left: `${progress}%` }}
                >
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <div className="absolute -inset-1 rounded-full bg-white/20 blur-md"></div>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/30 backdrop-blur-md">
                      <PlaneTakeoff className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm font-light text-white/70">
              {t('welcomeLoading.loading', { progress })}
            </p>
          </div>

          {/* Travel facts */}
          <div className="mt-6 flex max-w-md flex-col gap-2 animate-fade-in" style={{animationDelay: '1s'}}>
            <div className="flex items-center justify-center gap-2 text-sm text-white/80">
              <Compass className="h-4 w-4" />
              <span>{t('welcomeLoading.didYouKnow')}</span>
            </div>
            <p className="mb-2 text-sm italic text-white/60">
              "{t(`welcomeLoading.facts.${country.code}`, {
              defaultValue: t('welcomeLoading.facts.default', { countryName: country.name }),
            })}"
            </p>
            {/* Learn more button */}
            <button
                className="mx-auto mt-2 flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 transition-all hover:bg-white/20"
                onClick={() => setShowModal(true)}
            >
              <InfoIcon className="h-3 w-3" />
              <span>{t('welcomeLoading.learnMore')}</span>
            </button>
          </div>
        </div>

        {/* Skip button */}
        {showSkipButton && (
            <button
                className="absolute bottom-8 right-8 flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md transition-all hover:bg-white/20"
                onClick={onComplete}
            >
              <SkipForward className="h-4 w-4" />
              <span>{t('welcomeLoading.skip')}</span>
            </button>
        )}

        {/* Audio controls */}
        <button
            className="absolute right-8 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:bg-white/20"
            onClick={toggleMute}
        >
          {muted ? (
              <VolumeX className="h-5 w-5 text-white/70" />
          ) : (
              <Volume2 className="h-5 w-5 text-white/70" />
          )}
        </button>

        {/* Background audio - with ambient sounds */}
        <audio
            ref={audioRef}
            src="/ambient-travel.mp3" // You'll need to add this file to your public folder
            autoPlay
            loop
            muted={muted}
        />

        {/* Info modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="relative max-h-[80vh] w-full max-w-md overflow-auto rounded-lg bg-white/10 p-6 backdrop-blur-md">
                <button
                    className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
                    onClick={() => setShowModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>

                <h3 className="mb-4 text-xl font-bold text-white">{country.name}</h3>

                <div className="mb-4 flex items-center gap-3">
                  <img
                      src={country.flagUrl}
                      alt={country.name}
                      className="h-12 w-12 rounded-md object-cover shadow-md"
                  />
                  <div>
                    <p className="text-sm text-white/70">{t('welcomeLoading.capital')}: <span className="text-white">Capital City</span></p>
                    <p className="text-sm text-white/70">{t('welcomeLoading.language')}: <span className="text-white">{greeting.language}</span></p>
                  </div>
                </div>

                <p className="mb-4 text-sm text-white/80">
                  {country.description || t('welcomeLoading.noDescription')}
                </p>

                <h4 className="mb-2 font-medium text-white">{t('welcomeLoading.popularDestinations')}</h4>
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="overflow-hidden rounded-md bg-white/5">
                        <div className="h-24 w-full bg-gray-600"></div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-white">Destination {i}</p>
                          <p className="text-[10px] text-white/60">Popular attraction</p>
                        </div>
                      </div>
                  ))}
                </div>

                <button
                    className="mt-2 w-full rounded-md bg-white/20 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
                    onClick={() => setShowModal(false)}
                >
                  {t('welcomeLoading.gotIt')}
                </button>
              </div>
            </div>
        )}

        {/* CSS animations */}
        <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes slide-in {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }

        .animate-slide-in {
          animation: slide-in 1s ease forwards;
        }

        .active {
          background-color: white;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
          transform: translate(-50%, -50%) scale(1.5);
        }
      `}</style>
      </div>
  );
};

export default WelcomeLoadingScreen;
