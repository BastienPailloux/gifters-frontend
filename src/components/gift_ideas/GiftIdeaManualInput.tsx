import React from 'react';
import { useTranslation } from 'react-i18next';
import { GiftMetadata } from './GiftIdeaFromUrl';

interface GiftIdeaManualInputProps {
  giftData: GiftMetadata;
  onChange: (field: keyof GiftMetadata, value: string | number) => void;
}

const GiftIdeaManualInput: React.FC<GiftIdeaManualInputProps> = ({
  giftData,
  onChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="gift-title" className="block text-sm font-medium text-gray-700">
          {t('giftIdeas.titleLabel')}
        </label>
        <input
          id="gift-title"
          type="text"
          value={giftData.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="gift-description" className="block text-sm font-medium text-gray-700">
          {t('giftIdeas.descriptionLabel')}
        </label>
        <textarea
          id="gift-description"
          value={giftData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="gift-price" className="block text-sm font-medium text-gray-700">
          {t('giftIdeas.priceLabel')}
        </label>
        <input
          id="gift-price"
          type="number"
          min="0"
          step="0.01"
          value={giftData.price || ''}
          onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="gift-image-url" className="block text-sm font-medium text-gray-700">
          {t('giftIdeas.imageUrlLabel')}
        </label>
        <input
          id="gift-image-url"
          type="text"
          value={giftData.imageUrl || ''}
          onChange={(e) => onChange('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {giftData.imageUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            {t('giftIdeas.previewLabel')}
          </p>
          <img
            src={giftData.imageUrl}
            alt={giftData.title || "Gift preview"}
            className="h-32 w-auto object-contain border rounded"
          />
        </div>
      )}
    </div>
  );
};

export default GiftIdeaManualInput;
