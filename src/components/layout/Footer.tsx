import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FooterProps } from '../../types';
import { NewsletterSubscriptionForm } from '../../components/newsletter';
import { SocialLinks, SocialNetwork } from '../../components/social';

const Footer: React.FC<FooterProps> = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Configuration des réseaux sociaux à afficher (seulement LinkedIn)
  const socialNetworks: SocialNetwork[] = [
    {
      name: 'linkedin',
      url: 'https://www.linkedin.com/company/gifters-fr/',
      ariaLabel: 'LinkedIn'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-white">Gifters</span>
            </Link>
            <p className="text-gray-400 mb-4">
              {t('hero.description')}
            </p>
            <SocialLinks networks={socialNetworks} />
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.company.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">{t('footer.company.about')}</Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/gifters-fr/jobs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  {t('footer.company.careers')}
                </a>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.product.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white">{t('footer.product.features')}</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white">{t('footer.product.pricing')}</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.newsletter.title')}</h3>
            <p className="text-gray-400 mb-4">{t('footer.newsletter.description')}</p>
            <NewsletterSubscriptionForm
              listId={import.meta.env.VITE_BREVO_LIST_ID}
              redirectUrl={window.location.origin}
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left">
            {t('footer.copyright').replace('2025', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
