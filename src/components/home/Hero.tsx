import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import VideoPlayer from '../common/VideoPlayer';
import TestimonialSlider from '../common/TestimonialSlider';

// Données de témoignages
const testimonials = [
  {
    content: "Gifters a complètement transformé la façon dont nous organisons les anniversaires dans notre famille. Plus de cadeaux en double et tout le monde trouve quelque chose qui lui plaît vraiment !",
    author: {
      name: "Marie Dupont",
      title: "Mère de famille",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    rating: 5
  },
  {
    content: "J'ai utilisé Gifters pour mon mariage et c'était incroyable ! Nos invités ont adoré pouvoir choisir parmi notre liste de souhaits et nous avons reçu exactement ce dont nous avions besoin.",
    author: {
      name: "Thomas Martin",
      title: "Jeune marié",
      company: "Architecte",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    rating: 5
  },
  {
    content: "En tant qu'organisatrice d'événements, je recommande Gifters à tous mes clients. La plateforme est intuitive et le service client est exceptionnel.",
    author: {
      name: "Sophie Leclerc",
      title: "Organisatrice d'événements",
      company: "EventPro",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    rating: 4
  },
  {
    content: "Gifters m'a sauvé pour les fêtes de fin d'année ! Plus besoin de se casser la tête pour trouver des idées, tout est centralisé et facile à utiliser.",
    author: {
      name: "Lucas Bernard",
      title: "Étudiant",
      avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg"
    },
    rating: 5
  }
];

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simplifiez la gestion de vos cadeaux et événements
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Créez des listes de souhaits, organisez des événements et trouvez l'inspiration pour des cadeaux parfaits. Gifters connecte les gens à travers des moments de partage mémorables.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">
                  En savoir plus
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
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Ce que nos utilisateurs disent</h2>
          <p className="text-center text-gray-500 mb-8">Découvrez comment Gifters transforme l'expérience des cadeaux</p>
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
