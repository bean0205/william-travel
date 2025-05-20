import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Play, X, ChevronLeft, ChevronRight, Image as ImageIcon, Film } from 'lucide-react';
import { AnimateElement } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PhotoVideoGalleryProps {
  countryName: string;
}

export const PhotoVideoGallery: React.FC<PhotoVideoGalleryProps> = ({ countryName }) => {
  const { t } = useTranslation(['home']);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<number>(0);

  // Sample photo data
  const photos = [
    {
      id: 1,
      title: t('City Skyline'),
      src: 'https://images.unsplash.com/photo-1513183881046-a5fa074c681d',
      alt: t('Panoramic view of the city skyline'),
      location: t('Capital City'),
      tags: [t('Urban'), t('Architecture')]
    },
    {
      id: 2,
      title: t('Mountain Range'),
      src: 'https://images.unsplash.com/photo-1570641963303-92ce4845ed4c',
      alt: t('Beautiful mountain landscape at sunset'),
      location: t('Northern Highlands'),
      tags: [t('Nature'), t('Landscape')]
    },
    {
      id: 3,
      title: t('Local Market'),
      src: 'https://images.unsplash.com/photo-1527156231393-7023794f363c',
      alt: t('Vibrant local market with various goods'),
      location: t('Old Town District'),
      tags: [t('Culture'), t('Shopping')]
    },
    {
      id: 4,
      title: t('Beach Sunset'),
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      alt: t('Sunset view over the ocean from the beach'),
      location: t('Coastal Region'),
      tags: [t('Beach'), t('Sunset')]
    },
    {
      id: 5,
      title: t('Historical Temple'),
      src: 'https://images.unsplash.com/photo-1580889240911-ede6e1a5b275',
      alt: t('Ancient temple with intricate carvings'),
      location: t('Sacred Valley'),
      tags: [t('History'), t('Religion')]
    },
    {
      id: 6,
      title: t('Rice Terraces'),
      src: 'https://images.unsplash.com/photo-1506057278220-11d8704e2e86',
      alt: t('Green rice terraces in the mountains'),
      location: t('Agricultural Region'),
      tags: [t('Agriculture'), t('Rural')]
    },
  ];

  // Sample video data
  const videos = [
    {
      id: 1,
      title: t('City Tour'),
      thumbnail: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3:45',
      location: t('Capital City'),
      tags: [t('Urban'), t('Travel Guide')]
    },
    {
      id: 2,
      title: t('Cultural Festival'),
      thumbnail: 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5:20',
      location: t('Cultural Center'),
      tags: [t('Culture'), t('Festival')]
    },
    {
      id: 3,
      title: t('Cooking Demonstration'),
      thumbnail: 'https://images.unsplash.com/photo-1556910103-8b75edb7fb56',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '8:12',
      location: t('Local Restaurant'),
      tags: [t('Food'), t('Cooking')]
    },
  ];

  // Open lightbox with selected item
  const openLightbox = (index: number, type: 'photos' | 'videos') => {
    setActiveTab(type);
    setCurrentItem(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Navigate to next item in lightbox
  const nextItem = () => {
    const items = activeTab === 'photos' ? photos : videos;
    setCurrentItem((prev) => (prev + 1) % items.length);
  };

  // Navigate to previous item in lightbox
  const prevItem = () => {
    const items = activeTab === 'photos' ? photos : videos;
    setCurrentItem((prev) => (prev - 1 + items.length) % items.length);
  };

  // Handle keyboard navigation in lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'ArrowLeft') prevItem();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextItem, prevItem]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateElement animation="fade" delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                {t('home:gallery.title')}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {t('home:gallery.subtitle')} {countryName}
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" onClick={() => window.location.href = '/gallery'}>
              {t('home:gallery.viewAll')}
            </Button>
          </div>
        </AnimateElement>

        <AnimateElement animation="slide-up" delay={0.2}>
          <Tabs defaultValue="photos" className="w-full" onValueChange={(value) => setActiveTab(value as 'photos' | 'videos')}>
            <TabsList className="mb-8">
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {t('Photos')}
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                {t('Videos')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square"
                    onClick={() => openLightbox(index, 'photos')}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-white font-bold text-lg">{photo.title}</h3>
                      <p className="text-white/80 text-sm">{photo.location}</p>
                      <div className="flex gap-2 mt-2">
                        {photo.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-white/20 hover:bg-white/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className="rounded-lg overflow-hidden group cursor-pointer"
                    onClick={() => openLightbox(index, 'videos')}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <div className="h-14 w-14 rounded-full bg-white/80 flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary fill-current" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30">
                      <h3 className="font-bold mb-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{video.location}</p>
                      <div className="flex gap-2">
                        {video.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </AnimateElement>

        {/* Photo Tips */}
        <AnimateElement animation="fade" delay={0.3}>
          <div className="mt-12 p-6 bg-primary/5 rounded-lg">
            <h3 className="text-xl font-bold mb-4">{t('Photography Tips')}</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-bold mb-2">{t('Best Photo Spots')}</h4>
                <ul className="space-y-2 text-sm">
                  <li>{t('Sunrise at the Eastern Mountains')}</li>
                  <li>{t('Old Town Square during Golden Hour')}</li>
                  <li>{t('Coastal Cliffs for Dramatic Landscapes')}</li>
                  <li>{t('Night Markets for Vibrant Culture Shots')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">{t('Photography Etiquette')}</h4>
                <ul className="space-y-2 text-sm">
                  <li>{t('Always ask permission before photographing people')}</li>
                  <li>{t('Some religious sites prohibit photography inside')}</li>
                  <li>{t('Be mindful of local customs and privacy')}</li>
                  <li>{t('Avoid using flash in museums and galleries')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">{t('Camera Gear Tips')}</h4>
                <ul className="space-y-2 text-sm">
                  <li>{t('Bring a polarizing filter for vibrant landscapes')}</li>
                  <li>{t('Pack a lightweight tripod for low-light situations')}</li>
                  <li>{t('Protect your gear from humidity and rain')}</li>
                  <li>{t('Extra batteries are essential for long day trips')}</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimateElement>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={prevItem}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
            aria-label="Previous item"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <button
            onClick={nextItem}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
            aria-label="Next item"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="max-w-6xl mx-auto px-4 w-full">
            {activeTab === 'photos' ? (
              <div>
                <img
                  src={photos[currentItem].src}
                  alt={photos[currentItem].alt}
                  className="max-h-[80vh] mx-auto object-contain"
                />
                <div className="mt-4 text-white text-center">
                  <h3 className="text-xl font-bold">{photos[currentItem].title}</h3>
                  <p className="text-gray-300">{photos[currentItem].location}</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="aspect-video w-full">
                  <iframe
                    src={videos[currentItem].videoUrl}
                    title={videos[currentItem].title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-4 text-white text-center">
                  <h3 className="text-xl font-bold">{videos[currentItem].title}</h3>
                  <p className="text-gray-300">{videos[currentItem].location}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
