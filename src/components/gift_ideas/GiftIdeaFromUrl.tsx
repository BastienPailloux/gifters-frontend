import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';
import Input from '../common/forms/Input';

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
      <div className="flex space-x-2">
        <Input
          id="gift-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/produit"
          disabled={isLoading}
          label={t('giftIdeas.urlLabel')}
          error={urlError || undefined}
          fullWidth={true}
        />
        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => fetchMetadata(url)}
            disabled={!url || isLoading}
            className="mb-4"
          >
            {isLoading ? t('common.loading') : t('giftIdeas.fetchMetadata')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftIdeaFromUrl;
