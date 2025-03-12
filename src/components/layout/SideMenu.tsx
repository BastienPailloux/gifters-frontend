import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GroupList from './GroupList';
import { groupService } from '../../services/api';
import useOutsideClick from "../../hooks/useOutsideClick";

const SideMenu: React.FC = () => {
  const { t } = useTranslation();
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Fonction pour créer un groupe, mémorisée pour éviter des re-render inutiles
  const createGroup = useCallback(() => {
    if (newGroupName.trim()) {
      groupService.createGroup({
        name: newGroupName.trim(),
        description: ''
      })
        .then(() => {
          setIsCreatingGroup(false);
          setNewGroupName('');
          // Recharger la page pour afficher le nouveau groupe
          window.location.reload();
        })
        .catch((error) => console.error("Erreur lors de la création du groupe:", error));
    } else {
      // Annuler si le nom est vide
      setIsCreatingGroup(false);
      setNewGroupName('');
    }
  }, [newGroupName]);

  // Utiliser notre hook personnalisé pour gérer les clics en dehors
  useOutsideClick(inputRef, createGroup, isCreatingGroup);

  // Focus sur l'input quand on passe en mode création
  useEffect(() => {
    if (isCreatingGroup && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreatingGroup]);

  // Gestion des touches Entrée et Escape pour l'input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createGroup();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsCreatingGroup(false);
      setNewGroupName('');
    }
  };

  return (
    <div className="bg-white h-full shadow-md flex-shrink-0 border-r border-gray-200 w-full overflow-hidden">
      <div className="p-4 h-full overflow-y-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{t('sidemenu.groups')}</h2>

        {/* Utilisation du composant GroupList */}
        <GroupList />

        <div className="mt-6 space-y-2">
          {isCreatingGroup ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('sidemenu.groupNamePlaceholder') || 'Enter group name...'}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 w-full"
            >
              <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('sidemenu.createGroup')}
            </button>
          )}

          <Link
            to="/invitations"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 w-full"
          >
            <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            {t('sidemenu.joinGroup')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
