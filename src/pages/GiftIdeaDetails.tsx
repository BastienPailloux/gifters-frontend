import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { giftIdeaService } from '../services/api';
import Button from '../components/common/forms/Button';
import PageHeader from '../components/common/layout/PageHeader';
import StatusTag from '../components/common/display/StatusTag';
import GiftIdeaDetailCard from '../components/gift-ideas/GiftIdeaDetailCard';
import useAuth from '../hooks/useAuth';
import { GiftStatus, ExtendedGiftIdea } from '../types';

const GiftIdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [giftIdea, setGiftIdea] = useState<ExtendedGiftIdea | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Formatage du prix en euros
  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Récupérer les détails de l'idée cadeau
  useEffect(() => {
    const fetchGiftIdeaDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await giftIdeaService.getGiftIdea(id);
        setGiftIdea(response.giftIdea as ExtendedGiftIdea);
      } catch (error) {
        console.error('Error fetching gift idea details:', error);
        setError(t('common.error') || 'Failed to load gift idea details');
      } finally {
        setLoading(false);
      }
    };

    fetchGiftIdeaDetails();
  }, [id, t]);

  // Gérer l'action "Je vais l'acheter"
  const handleMarkAsBuying = async () => {
    if (!id) return;

    try {
      const response = await giftIdeaService.markAsBuying(id);
      setGiftIdea(response.giftIdea as ExtendedGiftIdea);
    } catch (error) {
      console.error('Error marking gift as buying:', error);
      alert(t('giftIdeas.errorMarkingAsBuying'));
    }
  };

  // Gérer l'action "J'ai acheté"
  const handleMarkAsBought = async () => {
    if (!id) return;

    try {
      const response = await giftIdeaService.markAsBought(id);
      setGiftIdea(response.giftIdea as ExtendedGiftIdea);
    } catch (error) {
      console.error('Error marking gift as bought:', error);
      alert(t('giftIdeas.errorMarkingAsBought'));
    }
  };

  // Retourner à la liste des cadeaux du groupe
  const handleBackToGroup = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-lg text-red-600">{error}</p>
        <Button variant="outline" onClick={handleBackToGroup} className="mt-4">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  if (!giftIdea) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-lg">{t('giftIdeas.notFound')}</p>
        <Button variant="outline" onClick={handleBackToGroup} className="mt-4">
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <PageHeader
          title={giftIdea.title}
          onBackClick={handleBackToGroup}
          className="mb-0 mr-3"
        />
        <StatusTag status={giftIdea.status as GiftStatus} />
      </div>

      <GiftIdeaDetailCard
        giftIdea={giftIdea}
        currentUser={user}
        onMarkAsBuying={handleMarkAsBuying}
        onMarkAsBought={handleMarkAsBought}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default GiftIdeaDetails;
