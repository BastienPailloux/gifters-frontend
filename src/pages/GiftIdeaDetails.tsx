import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { giftIdeaService } from '../services/api';
import Button from '../components/common/forms/Button';
import PageHeader from '../components/common/layout/PageHeader';
import StatusTag, { GiftStatus } from '../components/common/display/StatusTag';
import Card from '../components/common/display/Card';
import useAuth from '../hooks/useAuth';

// Type pour les détails d'un GiftIdea
interface GiftIdeaDetails {
  id: string;
  title: string;
  description?: string;
  price?: number;
  link?: string;
  image_url?: string;
  status: GiftStatus;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  buyer_id?: string;

  // Données structurées
  recipients: Array<{
    id: string;
    name: string;
  }>;
  group_name?: string;

  // Relations
  created_by?: {
    id: string;
    name: string;
    email?: string;
  };
  buyer?: {
    id: string;
    name: string;
    email?: string;
  };
}

const GiftIdeaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [giftIdea, setGiftIdea] = useState<GiftIdeaDetails | null>(null);
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
        console.log('response', response);
        setGiftIdea(response.giftIdea);
      } catch (error) {
        console.error('Error fetching gift idea details:', error);
        setError(t('common.error') || 'Failed to load gift idea details');
      } finally {
        setLoading(false);
      }
    };

    fetchGiftIdeaDetails();
  }, [id, t]);

  // Vérifier si l'utilisateur peut interagir avec ce cadeau
  const canInteract = () => {
    if (!giftIdea || !user) return false;

    // L'utilisateur ne peut pas acheter son propre cadeau
    const isRecipient = giftIdea.recipients.some(recipient => recipient.id === user.id);
    if (isRecipient) return false;

    // Si le cadeau est déjà acheté, personne ne peut interagir
    if (giftIdea.status === 'bought') return false;

    return true;
  };

  // Gérer l'action "Je vais l'acheter"
  const handleMarkAsBuying = async () => {
    if (!id || !canInteract()) return;

    try {
      const response = await giftIdeaService.markAsBuying(id);
      setGiftIdea(response.giftIdea);
    } catch (error) {
      console.error('Error marking gift as buying:', error);
      alert(t('giftIdeas.errorMarkingAsBuying'));
    }
  };

  // Gérer l'action "J'ai acheté"
  const handleMarkAsBought = async () => {
    if (!id || !canInteract()) return;

    try {
      const response = await giftIdeaService.markAsBought(id);
      setGiftIdea(response.giftIdea);
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

      <Card
        variant="elevated"
        className="mb-6"
        bodyClassName="p-0"
      >
        <div className="relative">
          {/* Boutons d'action en haut à droite */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {canInteract() && (
              <>
                {giftIdea.status === 'proposed' && (
                  <Button variant="primary" onClick={handleMarkAsBuying}>
                    {t('giftIdeas.markAsBuying')}
                  </Button>
                )}
                {giftIdea.status === 'buying' && giftIdea.buyer?.id === user?.id && (
                  <Button variant="primary" onClick={handleMarkAsBought}>
                    {t('giftIdeas.markAsBought')}
                  </Button>
                )}
                {giftIdea.link && (
                  <a
                    href={giftIdea.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {t('giftIdeas.visitStore')}
                  </a>
                )}
              </>
            )}
          </div>

          {/* Contenu principal */}
          <div className={`p-6 grid ${giftIdea.image_url ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
            {/* Colonne de gauche avec l'image (si disponible) */}
            {giftIdea.image_url && (
              <div className="flex flex-col">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">{t('giftIdeas.imageLabel')}</p>
                  <img
                    src={giftIdea.image_url}
                    alt={giftIdea.title}
                    className="max-w-full h-auto max-h-60 object-contain rounded border"
                  />
                </div>

                <div className="mt-auto">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">{t('giftIdeas.createdBy')}</p>
                    <p>{giftIdea.created_by?.name}</p>
                  </div>

                  {giftIdea.buyer && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">{t('giftIdeas.buyer')}</p>
                      <p>{giftIdea.buyer.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Colonne d'informations (ou colonne unique si pas d'image) */}
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">{t('giftIdeas.for')}</p>
                <p className="font-medium">
                  {giftIdea.recipients.map(recipient => recipient.name).join(', ')}
                </p>
              </div>

              {giftIdea.price !== undefined && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">{t('giftIdeas.priceLabel')}</p>
                  <p className="font-medium">{formatPrice(giftIdea.price)}</p>
                </div>
              )}

              {giftIdea.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">{t('giftIdeas.descriptionLabel')}</p>
                  <p className="whitespace-pre-wrap">{giftIdea.description}</p>
                </div>
              )}

              {giftIdea.link && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">{t('giftIdeas.urlLabel')}</p>
                  <a
                    href={giftIdea.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {giftIdea.link}
                  </a>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-500">{t('giftIdeas.group')}</p>
                <p>{giftIdea.group_name}</p>
              </div>

              {/* Afficher les informations de création/achat quand il n'y a pas d'image */}
              {!giftIdea.image_url && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">{t('giftIdeas.createdBy')}</p>
                    <p>{giftIdea.created_by?.name}</p>
                  </div>

                  {giftIdea.buyer && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">{t('giftIdeas.buyer')}</p>
                      <p>{giftIdea.buyer.name}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GiftIdeaDetails;
