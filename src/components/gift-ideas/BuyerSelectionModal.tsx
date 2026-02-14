import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modals/Modal';
import Button from '../common/forms/Button';
import Avatar from '../common/display/Avatar';
import useAuth from '../../hooks/useAuth';

interface EligibleBuyer {
  id: number;
  name: string;
  accountType: string;
}

interface BuyerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (buyerId: number) => void;
  eligibleBuyers: EligibleBuyer[];
  isLoading?: boolean;
}

const BuyerSelectionModal: React.FC<BuyerSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  eligibleBuyers,
  isLoading = false
}) => {
  const { t } = useTranslation(['gifts', 'common']);
  const { user } = useAuth();
  const [selectedBuyerId, setSelectedBuyerId] = useState<number | null>(
    eligibleBuyers.length === 1 ? eligibleBuyers[0].id : null
  );

  const handleConfirm = () => {
    if (selectedBuyerId !== null) {
      onConfirm(selectedBuyerId);
    }
  };

  const isCurrentUser = (buyerId: number) => {
    return user && String(buyerId) === String(user.id);
  };

  const getBuyerLabel = (buyer: EligibleBuyer) => {
    if (isCurrentUser(buyer.id)) {
      return t('common:you');
    }
    if (buyer.accountType === 'managed') {
      return t('common:managedAccount');
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('gifts:giftIdeas.selectBuyer')}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t('gifts:giftIdeas.selectBuyerDescription')}
        </p>

        <div className="space-y-2">
          {eligibleBuyers.map((buyer) => {
            const label = getBuyerLabel(buyer);
            const isSelected = selectedBuyerId === buyer.id;

            return (
              <div
                key={buyer.id}
                onClick={() => setSelectedBuyerId(buyer.id)}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="buyer"
                  checked={isSelected}
                  onChange={() => setSelectedBuyerId(buyer.id)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 mr-4"
                  onClick={(e) => e.stopPropagation()}
                />
                <Avatar name={buyer.name} size="md" />
                <div className="ml-4 flex-1">
                  <p className="text-base font-medium text-gray-900">{buyer.name}</p>
                </div>
                {label && (
                  <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedBuyerId === null || isLoading}
            isLoading={isLoading}
          >
            {t('common:confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BuyerSelectionModal;
