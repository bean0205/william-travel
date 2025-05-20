import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Bus, Train, Plane, MapPin } from 'lucide-react';
import { AnimateElement } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TransportationSectionProps {
  countryName: string;
}

export const TransportationSection: React.FC<TransportationSectionProps> = ({ countryName }) => {
  const { t } = useTranslation(['home']);

  // Sample transportation data
  const transportationOptions = [
    {
      id: 1,
      type: 'car',
      title: t('Rental Cars'),
      description: t('Explore at your own pace with affordable rental cars available throughout the country.'),
      icon: <Car className="h-8 w-8 text-primary" />,
    },
    {
      id: 2,
      type: 'bus',
      title: t('Public Buses'),
      description: t('An extensive network of public buses connects major cities and towns at budget-friendly prices.'),
      icon: <Bus className="h-8 w-8 text-primary" />,
    },
    {
      id: 3,
      type: 'train',
      title: t('Rail Services'),
      description: t('Comfortable and scenic train routes offer a unique way to experience the countryside.'),
      icon: <Train className="h-8 w-8 text-primary" />,
    },
    {
      id: 4,
      type: 'plane',
      title: t('Domestic Flights'),
      description: t('Quick domestic flights save time when traveling between distant locations.'),
      icon: <Plane className="h-8 w-8 text-primary" />,
    },
    {
      id: 5,
      type: 'taxi',
      title: t('Taxis & Ride Sharing'),
      description: t('Convenient taxi services and ride-sharing apps are available in major urban areas.'),
      icon: <MapPin className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateElement animation="fade" delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t('home:transportation.title')}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {t('Getting around in')} {countryName}
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" onClick={() => window.location.href = '/transportation'}>
              {t('home:transportation.viewAll')}
            </Button>
          </div>
        </AnimateElement>

        <AnimateElement animation="slide-up" delay={0.2}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {transportationOptions.map((option) => (
              <Card key={option.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 bg-primary/10 p-3 rounded-full">{option.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                    <p className="text-muted-foreground">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimateElement>

        <AnimateElement animation="fade" delay={0.3}>
          <div className="mt-12 bg-primary/5 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">{t('Transportation Tips')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-primary font-bold">•</span>
                <span>{t('Book long-distance transportation in advance during peak tourist seasons')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary font-bold">•</span>
                <span>{t('Download local transportation apps before your trip for convenience')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary font-bold">•</span>
                <span>{t('Consider purchasing transportation passes for significant savings')}</span>
              </li>
            </ul>
          </div>
        </AnimateElement>
      </div>
    </section>
  );
};
