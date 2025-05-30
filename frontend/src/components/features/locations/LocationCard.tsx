import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';

type LocationCardProps = {
  location: {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    rating?: number; // Make rating optional
  };
};

const LocationCard = ({ location }: LocationCardProps) => {
  // Default rating to 0 if undefined
  const rating = location.rating || 0;

  return (
    <Card className="bg-card border-border/40 group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={location.imageUrl}
          alt={location.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-card-foreground text-xl font-bold">
            {location.name}
          </h3>
          <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-800">
            {location.category}
          </span>
        </div>
        <div className="mb-3 flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`mr-0.5 h-4 w-4 ${
                i < rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted text-muted'
              }`}
            />
          ))}
          <span className="text-muted-foreground ml-1 text-sm">
            ({rating.toFixed(1)})
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
          <Link to={`/locations/${location.id}`}>Learn more →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocationCard;
