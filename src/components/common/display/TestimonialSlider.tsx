import React, { useState, useEffect, useRef } from 'react';
import Testimonial from './Testimonial';
import { TestimonialSliderProps } from '../../../types';

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  className = '',
  maxDesktopItems = 3,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion du défilement automatique
  useEffect(() => {
    if (autoPlay && testimonials.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        goToNext();
        if (testimonials.length > maxDesktopItems) {
          goToNextDesktop();
        }
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, currentIndex, desktopIndex, testimonials.length, maxDesktopItems]);

  // Gestion des touches de clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
        if (testimonials.length > maxDesktopItems) {
          goToPreviousDesktop();
        }
      } else if (e.key === 'ArrowRight') {
        goToNext();
        if (testimonials.length > maxDesktopItems) {
          goToNextDesktop();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, desktopIndex, testimonials.length, maxDesktopItems]);

  // Fonctions de navigation pour mobile
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    resetAutoPlayTimer();
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    resetAutoPlayTimer();
  };

  // Fonctions de navigation pour desktop
  const goToPreviousDesktop = () => {
    const isFirstSlide = desktopIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - maxDesktopItems : desktopIndex - 1;
    setDesktopIndex(Math.max(0, Math.min(newIndex, testimonials.length - maxDesktopItems)));
    resetAutoPlayTimer();
  };

  const goToNextDesktop = () => {
    const maxStartIndex = testimonials.length - maxDesktopItems;
    const isLastSlide = desktopIndex >= maxStartIndex;
    const newIndex = isLastSlide ? 0 : desktopIndex + 1;
    setDesktopIndex(newIndex);
    resetAutoPlayTimer();
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
    resetAutoPlayTimer();
  };

  const resetAutoPlayTimer = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      if (autoPlay && testimonials.length > 1) {
        autoPlayTimerRef.current = setInterval(() => {
          goToNext();
          if (testimonials.length > maxDesktopItems) {
            goToNextDesktop();
          }
        }, autoPlayInterval);
      }
    }
  };

  // Gestion du swipe sur mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Si pas de témoignages, ne rien afficher
  if (testimonials.length === 0) {
    return null;
  }

  // Si un seul témoignage, l'afficher sans contrôles
  if (testimonials.length === 1) {
    return (
      <div className={className}>
        <Testimonial {...testimonials[0]} />
      </div>
    );
  }

  // Calculer les témoignages à afficher sur desktop
  const visibleDesktopTestimonials = testimonials.slice(
    desktopIndex,
    Math.min(desktopIndex + maxDesktopItems, testimonials.length)
  );

  // Si on n'a pas assez de témoignages pour remplir la dernière page, on complète avec les premiers
  if (visibleDesktopTestimonials.length < maxDesktopItems && testimonials.length > maxDesktopItems) {
    const remaining = maxDesktopItems - visibleDesktopTestimonials.length;
    visibleDesktopTestimonials.push(...testimonials.slice(0, remaining));
  }

  return (
    <div className={`relative ${className}`}>
      {/* Conteneur du slider avec gestion du toucher */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Affichage des témoignages en grille responsive sur desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleDesktopTestimonials.map((testimonial, index) => (
            <Testimonial key={`desktop-${desktopIndex}-${index}`} {...testimonial} />
          ))}
        </div>

        {/* Version mobile avec slider */}
        <div className="md:hidden">
          <div className="transition-transform duration-500 ease-out">
            <Testimonial {...testimonials[currentIndex]} />
          </div>
        </div>
      </div>

      {/* Contrôles du slider (visible sur mobile et desktop si plus de 3 témoignages) */}
      <div className="flex justify-between mt-4">
        {/* Bouton précédent */}
        <button
          onClick={() => {
            goToPrevious();
            if (testimonials.length > maxDesktopItems) {
              goToPreviousDesktop();
            }
          }}
          className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-primary-500 focus:outline-none"
          aria-label="Témoignage précédent"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Indicateurs de pagination */}
        <div className="flex space-x-2 items-center">
          {testimonials.length <= maxDesktopItems ? (
            // Pagination pour petit nombre de témoignages
            testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full focus:outline-none ${
                  index === currentIndex ? 'bg-primary-500' : 'bg-gray-300'
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))
          ) : (
            // Pagination pour grand nombre de témoignages (groupés)
            Array.from({ length: Math.ceil(testimonials.length / maxDesktopItems) }).map((_, index) => {
              const isActive =
                index === Math.floor(desktopIndex / maxDesktopItems) ||
                (index === 0 && desktopIndex === 0);
              return (
                <button
                  key={index}
                  onClick={() => {
                    setDesktopIndex(index * maxDesktopItems);
                    setCurrentIndex(index * maxDesktopItems);
                  }}
                  className={`w-2 h-2 rounded-full focus:outline-none ${
                    isActive ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Aller au groupe de témoignages ${index + 1}`}
                />
              );
            })
          )}
        </div>

        {/* Bouton suivant */}
        <button
          onClick={() => {
            goToNext();
            if (testimonials.length > maxDesktopItems) {
              goToNextDesktop();
            }
          }}
          className="bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-primary-500 focus:outline-none"
          aria-label="Témoignage suivant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
