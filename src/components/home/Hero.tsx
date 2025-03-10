import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

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

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary-100 rounded-full opacity-30 blur-3xl"></div>
            <img
              src="/images/hero-image.png"
              alt="Gifters platform"
              className="relative w-full h-auto rounded-lg shadow-xl"
              onError={(e) => {
                // Fallback si l'image n'existe pas encore
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/600x400?text=Gifters+Platform";
              }}
            />
          </div>
        </div>

        {/* Badges de confiance */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 mb-6">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            <img src="/images/logos/logo1.svg" alt="Company 1" className="h-8" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/120x40?text=Logo+1";
            }} />
            <img src="/images/logos/logo2.svg" alt="Company 2" className="h-8" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/120x40?text=Logo+2";
            }} />
            <img src="/images/logos/logo3.svg" alt="Company 3" className="h-8" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/120x40?text=Logo+3";
            }} />
            <img src="/images/logos/logo4.svg" alt="Company 4" className="h-8" onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/120x40?text=Logo+4";
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
