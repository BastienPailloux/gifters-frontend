import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/forms/Button';
import Input from '../common/forms/Input';
import GiftIdeaManualInput from './GiftIdeaManualInput';
import { metadataService } from '../../services/api';

export interface GiftMetadata {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  link?: string; // Champ correspondant à l'attribut 'link' dans le backend
}

/**
 * Composant pour la création d'une idée cadeau à partir d'une URL
 *
 * TODO: SCRAPING_FEATURE - Ce composant est temporairement désactivé en production
 * en raison de problèmes de scraping. Il sera réactivé lorsque ces problèmes seront résolus.
 * Les problèmes principaux incluent: timeout lors de requêtes, problèmes de CORS, blocage par
 * certains sites, etc. Garder le composant en place pour une réactivation future.
 */
interface GiftIdeaFromUrlProps {
  onMetadataFetched: (metadata: GiftMetadata) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  giftData: GiftMetadata;
  onChange: (field: keyof GiftMetadata, value: string | number) => void;
}

const GiftIdeaFromUrl: React.FC<GiftIdeaFromUrlProps> = ({
  onMetadataFetched,
  isLoading,
  setIsLoading,
  giftData,
  onChange
}) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [metadataFetched, setMetadataFetched] = useState(false);

  // Fonction pour récupérer les métadonnées d'une URL
  // TODO: SCRAPING_FEATURE - Cette fonction est temporairement inactive en production
  // mais est maintenue pour référence et utilisation future.
  const fetchMetadata = async (url: string) => {
    setIsLoading(true);
    setUrlError(null);

    try {
      // Vérification simple du format URL
      if (!url.startsWith('http')) {
        throw new Error(t('giftIdeas.invalidUrl'));
      }

      // Appel à l'API pour récupérer les métadonnées
      const metadata = await metadataService.fetchMetadata(url);

      // Convertir les propriétés pour correspondre à notre format
      const formattedMetadata: GiftMetadata = {
        title: metadata.title,
        description: metadata.description,
        price: metadata.price,
        imageUrl: metadata.image_url
      };

      onMetadataFetched(formattedMetadata);
      setMetadataFetched(true);
    } catch (error: unknown) {
      console.error('Error fetching metadata:', error);

      // Gestion des erreurs spécifiques de l'API
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        if (axiosError.response?.data?.error) {
          setUrlError(axiosError.response.data.error);
        } else if (error instanceof Error) {
          setUrlError(error.message);
        } else {
          setUrlError(t('giftIdeas.metadataError'));
        }
      } else if (error instanceof Error) {
        setUrlError(error.message);
      } else {
        setUrlError(t('giftIdeas.metadataError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: SCRAPING_FEATURE - Ce composant reste inchangé pour une réactivation future
  return (
    <div className="space-y-6">
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

      {metadataFetched && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {t('giftIdeas.editFetchedMetadata')}
          </h3>
          <GiftIdeaManualInput
            giftData={giftData}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
};

export default GiftIdeaFromUrl;
