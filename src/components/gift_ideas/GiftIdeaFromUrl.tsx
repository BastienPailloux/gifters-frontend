import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';

export interface GiftMetadata {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

interface GiftIdeaFromUrlProps {
  onMetadataFetched: (metadata: GiftMetadata) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const GiftIdeaFromUrl: React.FC<GiftIdeaFromUrlProps> = ({
  onMetadataFetched,
  isLoading,
  setIsLoading
}) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Fonction pour récupérer les métadonnées d'une URL
  const fetchMetadata = async (url: string) => {
    setIsLoading(true);
    setUrlError(null);

    try {
      // Vérification simple du format URL
      if (!url.startsWith('http')) {
        throw new Error(t('giftIdeas.invalidUrl'));
      }

      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dans une application réelle, vous appelleriez votre backend
      // const response = await metadataService.fetchMetadata(url);

      // Données factices pour la démonstration
      const mockData = {
        title: 'Produit Exemple',
        description: 'Description détaillée du produit que vous venez de partager.',
        price: 49.99,
        imageUrl: 'https://via.placeholder.com/150'
      };

      onMetadataFetched(mockData);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setUrlError(error instanceof Error ? error.message : t('giftIdeas.metadataError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="gift-url" className="block text-sm font-medium text-gray-700">
          {t('giftIdeas.urlLabel')}
        </label>
        <div className="flex space-x-2">
          <input
            id="gift-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/produit"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fetchMetadata(url)}
            disabled={!url || isLoading}
          >
            {isLoading ? t('common.loading') : t('giftIdeas.fetchMetadata')}
          </Button>
        </div>
        {urlError && (
          <p className="text-sm text-red-600">{urlError}</p>
        )}
      </div>
    </div>
  );
};

export default GiftIdeaFromUrl;
