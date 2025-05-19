import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useCountryStore } from '@/store/countryStore';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

const FeaturedLocations = () => {
  const { featuredLocations } = useAppStore();
  const { selectedCountry } = useCountryStore();

  // Filter locations based on the selected country if applicable
  const filteredLocations = selectedCountry
    ? featuredLocations.filter(
        (location) =>
          // Assuming location has a countryCode property
          // If your data model is different, adjust this filter accordingly
          location.countryCode === selectedCountry.code ||
          location.region === selectedCountry.name ||
          // Fallback if no country data in locations
          !location.countryCode
      )
    : featuredLocations;

  if (filteredLocations.length === 0) {
    return (
      <Card className="bg-muted/30 border-none">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-lg">
            {selectedCountry
              ? `No featured locations available for ${selectedCountry.name} at the moment.`
              : 'No featured locations available at the moment.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredLocations.map((location) => (
        <Card
          key={location.id}
          className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={location.imageUrl}
              alt={location.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-bold">{location.name}</h3>
              <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-800">
                {location.category}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {location.description}
            </p>
          </CardContent>
          <CardFooter className="px-5 pb-5 pt-0">
            <Button
              asChild
              variant="link"
              className="gap-1.5 px-0 hover:no-underline"
            >
              <Link to={`/locations/${location.id}`}>
                Learn more <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedLocations;
