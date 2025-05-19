import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarIcon, MapPinIcon, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  image: string;
  status: 'upcoming' | 'ongoing';
}

interface EventsCarouselProps {
  events: Event[];
}

export const EventsCarousel = ({ events }: EventsCarouselProps) => {
  const getStatusColor = (status: Event['status']) => {
    return status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="group transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <Badge
                  className={`absolute right-4 top-4 ${getStatusColor(event.status)} text-white`}
                >
                  {event.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="mb-2 line-clamp-1">{event.title}</CardTitle>
              <CardDescription className="mb-4 line-clamp-2">
                {event.description}
              </CardDescription>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {format(event.startDate, 'MMM dd')} -{' '}
                    {format(event.endDate, 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{format(event.startDate, 'HH:mm')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
