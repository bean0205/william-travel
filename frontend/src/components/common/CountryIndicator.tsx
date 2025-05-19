import { useNavigate } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { Button } from '@/components/ui/button';
import { MapPinIcon, RefreshCwIcon } from 'lucide-react';

interface CountryIndicatorProps {
  showChangeButton?: boolean;
  compact?: boolean;
}

const CountryIndicator = ({
  showChangeButton = true,
  compact = false,
}: CountryIndicatorProps) => {
  const { selectedCountry, resetSelectedCountry } = useCountryStore();
  const navigate = useNavigate();

  if (!selectedCountry) return null;

  const handleChangeCountry = () => {
    resetSelectedCountry();
    navigate('/');
  };

  return (
    <div
      className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}
    >
      <div className="flex items-center gap-1.5">
        <div className="relative">
          {selectedCountry.flagUrl ? (
            <img
              src={selectedCountry.flagUrl}
              alt={`${selectedCountry.name} flag`}
              className={`border-border/40 inline-block rounded-sm border dark:border-slate-700 ${
                compact ? 'h-3 w-4' : 'h-4 w-6'
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/20x12?text=Flag';
              }}
            />
          ) : (
            <MapPinIcon
              className={`text-muted-foreground dark:text-slate-400 ${
                compact ? 'h-3 w-3' : 'h-4 w-4'
              }`}
            />
          )}
        </div>
        <span className="text-foreground/80 font-medium dark:text-slate-300">
          {selectedCountry.name}
        </span>
      </div>

      {showChangeButton && (
        <Button
          onClick={handleChangeCountry}
          variant="ghost"
          size={compact ? 'sm' : 'default'}
          className="h-auto px-2 py-1 text-primary-600 hover:bg-primary-50 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-slate-800 dark:hover:text-primary-300"
        >
          <RefreshCwIcon
            className={compact ? 'mr-1 h-3 w-3' : 'mr-1.5 h-3.5 w-3.5'}
          />
          Change
        </Button>
      )}
    </div>
  );
};

export default CountryIndicator;
