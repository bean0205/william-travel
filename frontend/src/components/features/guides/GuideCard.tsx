import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';

type GuideCardProps = {
  guide: {
    id: string;
    title: string;
    author: string;
    category: string;
    excerpt: string;
    imageUrl: string;
    date: string;
  };
};

const GuideCard = ({ guide }: GuideCardProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="bg-card border-border/40 group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={guide.imageUrl}
          alt={guide.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-800">
            {guide.category}
          </span>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <CalendarIcon className="h-3.5 w-3.5" />
            {new Date(guide.date).toLocaleDateString()}
          </div>
        </div>
        <h3 className="text-card-foreground mb-3 text-xl font-bold">
          {guide.title}
        </h3>
        <div className="mb-4 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(guide.author)}&background=random`}
              alt={guide.author}
            />
            <AvatarFallback>{getInitials(guide.author)}</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-sm">By {guide.author}</p>
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {guide.excerpt}
        </p>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Button
          asChild
          variant="link"
          className="gap-1.5 px-0 hover:no-underline"
        >
          <Link to={`/guides/${guide.id}`}>Read more →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuideCard;
