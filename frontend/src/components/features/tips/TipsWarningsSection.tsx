import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Shield, Sun, Thermometer } from 'lucide-react';
import { AnimateElement } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TipsWarningsSectionProps {
  countryName: string;
}

export const TipsWarningsSection: React.FC<TipsWarningsSectionProps> = ({ countryName }) => {
  const { t } = useTranslation(['home']);

  const safetyTips = [
    {
      id: 1,
      title: t('General Safety'),
      description: t('While the country is generally safe for tourists, always be aware of your surroundings in crowded areas and keep valuables secure.'),
      icon: <Shield className="h-5 w-5" />,
      variant: 'info' as const,
    },
    {
      id: 2,
      title: t('Health Precautions'),
      description: t('Drink bottled or filtered water. Consider travel insurance that covers medical emergencies and have basic medications handy.'),
      icon: <CheckCircle className="h-5 w-5" />,
      variant: 'default' as const,
    },
    {
      id: 3,
      title: t('Weather Awareness'),
      description: t('Check seasonal weather conditions before traveling. Some regions experience monsoons and high temperatures during summer months.'),
      icon: <Sun className="h-5 w-5" />,
      variant: 'warning' as const,
    },
    {
      id: 4,
      title: t('Local Regulations'),
      description: t('Familiarize yourself with local laws and customs. Some religious sites have specific dress codes and behavior expectations.'),
      icon: <Info className="h-5 w-5" />,
      variant: 'info' as const,
    },
  ];

  const seasonalWarnings = [
    {
      id: 1,
      season: t('Summer (June-August)'),
      warning: t('High temperatures and humidity in most regions. Stay hydrated and plan outdoor activities for mornings or evenings.'),
      icon: <Thermometer className="h-6 w-6 text-orange-500" />,
    },
    {
      id: 2,
      season: t('Monsoon (September-October)'),
      warning: t('Heavy rainfall may affect transportation and outdoor activities. Check weather forecasts regularly.'),
      icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
    },
    {
      id: 3,
      season: t('Festival Season (varies)'),
      warning: t('Expect crowds and increased prices during major festivals. Book accommodations well in advance.'),
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    },
  ];

  const tips = [
    t('Learn a few basic phrases in the local language'),
    t('Carry a copy of your passport and keep the original in a secure location'),
    t('Respect local customs and traditions, particularly at religious sites'),
    t('Use reputable transportation services, especially for night travel'),
    t('Register with your embassy if staying for an extended period'),
    t('Purchase travel insurance that covers medical emergencies'),
  ];

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateElement animation="fade" delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                {t('home:tipsWarnings.title')}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {t('Essential information for a safe and enjoyable trip to')} {countryName}
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" onClick={() => window.location.href = '/tips-warnings'}>
              {t('home:tipsWarnings.viewAll')}
            </Button>
          </div>
        </AnimateElement>

        <AnimateElement animation="slide-up" delay={0.2}>
          <div className="space-y-4">
            {safetyTips.map((tip) => (
              <Alert key={tip.id} variant={tip.variant}>
                <div className="flex items-start">
                  {tip.icon}
                  <div className="ml-3">
                    <AlertTitle className="font-bold">{tip.title}</AlertTitle>
                    <AlertDescription className="mt-1">{tip.description}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </AnimateElement>

        <AnimateElement animation="fade" delay={0.3}>
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-6">{t('Seasonal Considerations')}</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {seasonalWarnings.map((warning) => (
                <Card key={warning.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {warning.icon}
                      <h4 className="font-bold">{warning.season}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{warning.warning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimateElement>

        <AnimateElement animation="fade" delay={0.4}>
          <div className="mt-12 p-6 bg-primary/5 rounded-lg">
            <h3 className="text-xl font-bold mb-4">{t('Helpful Travel Tips')}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimateElement>

        <AnimateElement animation="fade" delay={0.5}>
          <div className="mt-12 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
              <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-500">{t('Emergency Information')}</h3>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-bold mb-2">{t('Emergency Numbers')}</h4>
                <p className="mb-1"><span className="font-medium">Police:</span> 100</p>
                <p className="mb-1"><span className="font-medium">Ambulance:</span> 108</p>
                <p><span className="font-medium">Tourist Police:</span> 1363</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">{t('Medical Facilities')}</h4>
                <p className="text-sm">
                  {t('Major cities have well-equipped hospitals. Rural areas may have limited medical facilities.')}
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">{t('Embassy Contact')}</h4>
                <p className="text-sm">
                  {t('Keep your embassy\'s contact information handy in case of emergencies.')}
                </p>
              </div>
            </div>
          </div>
        </AnimateElement>
      </div>
    </section>
  );
};
