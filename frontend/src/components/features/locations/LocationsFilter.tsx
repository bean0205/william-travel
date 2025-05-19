import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon, FilterIcon } from 'lucide-react';

type LocationsFilterProps = {
  filter: {
    category: string;
    searchQuery: string;
  };
  onFilterChange: (filter: { category: string; searchQuery: string }) => void;
};

const LocationsFilter = ({ filter, onFilterChange }: LocationsFilterProps) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beach', label: 'Beaches' },
    { value: 'mountain', label: 'Mountains' },
    { value: 'city', label: 'Cities' },
    { value: 'countryside', label: 'Countryside' },
    { value: 'historical', label: 'Historical' },
  ];

  return (
    <Card className="bg-card mb-8">
      <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SearchIcon className="text-muted-foreground h-4 w-4" />
            <Label
              htmlFor="search"
              className="text-foreground text-sm font-medium"
            >
              Search
            </Label>
          </div>
          <div className="relative">
            <Input
              id="search"
              type="text"
              placeholder="Search destinations..."
              className="w-full pl-3"
              value={filter.searchQuery}
              onChange={(e) =>
                onFilterChange({ ...filter, searchQuery: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilterIcon className="text-muted-foreground h-4 w-4" />
            <Label
              htmlFor="category"
              className="text-foreground text-sm font-medium"
            >
              Category
            </Label>
          </div>
          <Select
            value={filter.category}
            onValueChange={(value) =>
              onFilterChange({ ...filter, category: value })
            }
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>{' '}
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationsFilter;
