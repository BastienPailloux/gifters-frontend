import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary-500 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">Gifters</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-white hover:text-primary-200 font-medium">
              Fonctionnalités
            </Link>
            <Link to="/pricing" className="text-white hover:text-primary-200 font-medium">
              Tarifs
            </Link>
            <Link to="/about" className="text-white hover:text-primary-200 font-medium">
              À propos
            </Link>
            <Link to="/contact" className="text-white hover:text-primary-200 font-medium">
              Contact
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-primary-600">
                Connexion
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary" size="sm">
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-primary-200 focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-400">
            <nav className="flex flex-col space-y-4 pb-4">
              <Link to="/features" className="text-white hover:text-primary-200 font-medium">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-white hover:text-primary-200 font-medium">
                Tarifs
              </Link>
              <Link to="/about" className="text-white hover:text-primary-200 font-medium">
                À propos
              </Link>
              <Link to="/contact" className="text-white hover:text-primary-200 font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex flex-col space-y-3 pt-4 border-t border-primary-400">
              <Link to="/login">
                <Button variant="outline" fullWidth className="text-white border-white hover:bg-primary-600">
                  Connexion
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary" fullWidth>
                  S'inscrire
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
