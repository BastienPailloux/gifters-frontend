import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import VideoPlayer from '../common/VideoPlayer';
import TestimonialSlider from '../common/TestimonialSlider';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  // Données de témoignages depuis les traductions
  const testimonials = [
    {
      content: t('testimonials.1.content'),
      author: {
        name: t('testimonials.1.author.name'),
        title: t('testimonials.1.author.title'),
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      rating: 5
    },
    {
      content: t('testimonials.2.content'),
      author: {
        name: t('testimonials.2.author.name'),
        title: t('testimonials.2.author.title'),
        company: t('testimonials.2.author.company'),
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      rating: 5
    },
    {
      content: t('testimonials.3.content'),
      author: {
        name: t('testimonials.3.author.name'),
        title: t('testimonials.3.author.title'),
        company: t('testimonials.3.author.company'),
        avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      rating: 4
    },
    {
      content: t('testimonials.4.content'),
      author: {
        name: t('testimonials.4.author.name'),
        title: t('testimonials.4.author.title'),
        avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg"
      },
      rating: 5
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  {t('hero.cta.primary')}
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">
                  {t('hero.cta.secondary')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Vidéo */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary-100 rounded-full opacity-30 blur-3xl"></div>
            <VideoPlayer
              src="/videos/gifters-demo.mp4"
              fallbackImage="https://via.placeholder.com/600x400?text=Gifters+Platform"
              className="rounded-lg shadow-xl relative z-10"
              aspectRatio="16/9"
              autoPlay={true}
              muted={true}
              loop={true}
              controls={false}
            />
          </div>
        </div>

        {/* Témoignages clients */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {t('hero.testimonials.title')}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {t('hero.testimonials.subtitle')}
          </p>
          <TestimonialSlider
            testimonials={testimonials}
            autoPlay={true}
            autoPlayInterval={6000}
            className="mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
