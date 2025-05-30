import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Gift, Sparkles, MapPin, Badge } from 'lucide-react';
import { AnimateElement } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';

interface ShoppingSectionProps {
  countryName: string;
}

export const ShoppingSection: React.FC<ShoppingSectionProps> = ({ countryName }) => {
  const { t } = useTranslation(['home']);

  const shoppingItems = [
    {
      id: 1,
      name: t('Traditional Handicrafts'),
      description: t('Handmade local crafts including pottery, weaving, and wood carvings.'),
      image: 'https://images.unsplash.com/photo-1617039570999-baaa51b9c5fe',
      priceRange: '$$ - $$$',
      tags: [t('Souvenirs'), t('Handmade'), t('Cultural')],
    },
    {
      id: 2,
      name: t('Local Fashion'),
      description: t('Contemporary and traditional clothing made with local materials and designs.'),
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
      priceRange: '$$ - $$$',
      tags: [t('Fashion'), t('Textiles'), t('Design')],
    },
    {
      id: 3,
      name: t('Local Food Products'),
      description: t('Packaged delicacies, spices, teas, and other culinary specialties.'),
      image: 'https://images.unsplash.com/photo-1466189561306-d6c1d4039bc9',
      priceRange: '$ - $$',
      tags: [t('Food'), t('Gourmet'), t('Gifts')],
    },
  ];

  const shoppingDistricts = [
    {
      id: 1,
      name: t('Traditional Market District'),
      description: t('Historic markets with a wide variety of local goods and crafts.'),
      icon: <MapPin className="h-6 w-6 text-primary" />,
    },
    {
      id: 2,
      name: t('Modern Shopping Malls'),
      description: t('Contemporary shopping centers with international and local brands.'),
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    },
    {
      id: 3,
      name: t('Artisan Quarter'),
      description: t('Area known for high-quality handmade crafts and art studios.'),
      icon: <Sparkles className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateElement animation="fade" delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t('home:shopping.title')}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {t('The best items to bring home from')} {countryName}
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" onClick={() => window.location.href = '/shopping'}>
              {t('home:shopping.viewAll')}
            </Button>
          </div>
        </AnimateElement>

        <AnimateElement animation="slide-up" delay={0.2}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shoppingItems.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <UIBadge variant="secondary">{item.priceRange}</UIBadge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0 flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <UIBadge key={index} variant="outline">{tag}</UIBadge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </AnimateElement>

        <AnimateElement animation="fade" delay={0.3}>
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">{t('Popular Shopping Districts')}</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {shoppingDistricts.map((district) => (
                <div key={district.id} className="flex items-start gap-4 p-6 bg-muted/20 rounded-lg">
                  <div className="mt-1">{district.icon}</div>
                  <div>
                    <h4 className="font-bold mb-1">{district.name}</h4>
                    <p className="text-sm text-muted-foreground">{district.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateElement>

        <AnimateElement animation="fade" delay={0.4}>
          <div className="mt-12 bg-primary/5 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">{t('Shopping Tips')}</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-primary font-bold">•</span>
                <span>{t('Check if your purchase requires special packaging for international travel')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary font-bold">•</span>
                <span>{t('Most traditional markets expect some bargaining, but do so respectfully')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary font-bold">•</span>
                <span>{t('Look for authentic craft certifications when buying traditional items')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-primary font-bold">•</span>
                <span>{t('Consider custom import regulations before purchasing certain items')}</span>
              </li>
            </ul>
          </div>
        </AnimateElement>
      </div>
    </section>
  );
};
