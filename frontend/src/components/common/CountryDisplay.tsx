import { useNavigate } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { Button } from '@/components/ui/button';
import { MapPinIcon, GlobeIcon } from 'lucide-react';

const CountryDisplay = () => {
  const { selectedCountry, resetSelectedCountry } = useCountryStore();
  const navigate = useNavigate();

  if (!selectedCountry) return null;

  const handleChangeCountry = () => {
    resetSelectedCountry();
    navigate('/');
  };

  return (
    <div className="border-b border-primary-100 bg-primary-50/50 py-2 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {selectedCountry.flagUrl ? (
              <img
                src={selectedCountry.flagUrl}
                alt={`${selectedCountry.name} flag`}
                className="border-border/40 h-4 w-6 rounded-sm border shadow-sm dark:border-slate-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/24x16?text=Flag';
                }}
              />
            ) : (
              <div className="flex h-4 w-6 items-center justify-center rounded-sm bg-primary-100 dark:bg-slate-800">
                <MapPinIcon className="h-3 w-3 text-primary-700 dark:text-primary-400" />
              </div>
            )}
            <span className="text-foreground text-sm font-medium dark:text-slate-200">
              {selectedCountry.name}
            </span>
          </div>

          <div className="hidden items-center md:flex">
            <div className="bg-border mx-2 h-3 w-px dark:bg-slate-700"></div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs dark:text-slate-400">
              <GlobeIcon className="h-3 w-3" />
              <span>Browsing {selectedCountry.name} travel experiences</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleChangeCountry}
          variant="outline"
          size="sm"
          className="bg-background h-7 border-primary-200 text-xs text-primary-700 hover:bg-primary-50 hover:text-primary-800 dark:border-slate-700 dark:bg-slate-800 dark:text-primary-300 dark:hover:bg-slate-700"
        >
          Change country
        </Button>
      </div>
    </div>
  );
};

export default CountryDisplay;
