import axios from 'axios';

// Définir l'URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Créer une instance axios avec des configurations par défaut
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Vérifier si le token a un format valide
      if (token.split('.').length === 3) {
        config.headers['Authorization'] = `Bearer ${token.trim()}`;

        // Nettoyer tout en-tête d'autorisation dupliqué potentiel
        if (config.headers['authorization']) {
          delete config.headers['authorization'];
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse (comme les 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si l'erreur est 401 Unauthorized, déconnecter l'utilisateur
    if (error.response && error.response.status === 401) {
      // Supprimer les données d'authentification
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Rediriger vers la page de login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData: { name: string; email: string; password: string; password_confirmation: string; newsletter_subscription?: boolean }) => {
    // Récupération de la langue courante pour l'initialisation
    const currentLanguage = localStorage.getItem('i18nextLng') || 'en';

    // Ajout de la langue aux données d'inscription
    const userDataWithLocale = {
      ...userData,
      locale: currentLanguage
    };

    // On envoie les données directement sans les imbriquer dans un objet 'user'
    const response = await api.post('/signup', { user: userDataWithLocale });

    // Stocker le token et les informations utilisateur dans le localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else if (response.data.data && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Connexion d'un utilisateur
  login: async (credentials: { email: string; password: string }) => {

    try {
      // On envoie les données directement sans les imbriquer dans un objet 'user'
      const response = await api.post('/login', { user: credentials });

      // Stocker le token et les informations utilisateur dans le localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else if (response.data.data && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      } else {
        console.error('ERREUR : Aucun token trouvé dans la réponse', response.data);
      }

      return response.data;
    } catch (error) {
      console.error('Erreur pendant la connexion :', error);
      throw error; // Relancer l'erreur pour que useAuth puisse la gérer
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await api.delete('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Demander la réinitialisation du mot de passe
  requestPasswordReset: async (email: string) => {
    try {
      // Plus besoin d'envoyer la locale car elle est déjà stockée dans la base de données
      const response = await api.post('/password', {
        user: { email }
      });

      return {
        success: true,
        message: response.data?.message || 'Instructions sent to your email'
      };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  // Réinitialiser le mot de passe avec le token
  resetPassword: async (params: { reset_password_token: string; password: string; password_confirmation: string }) => {
    try {
      const response = await api.put('/password', { user: params });
      return {
        success: true,
        message: response.data?.message || 'Password successfully reset'
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Service pour les groupes
export const groupService = {
  // Récupérer tous les groupes de l'utilisateur
  getGroups: async () => {
    try {
      const response = await api.get('/groups');
      return response.data;
    } catch (error) {
      console.error('Error in getGroups API call:', error);
      throw error;
    }
  },

  // Récupérer un groupe spécifique
  getGroup: async (id: string) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  // Créer un nouveau groupe
  createGroup: async (groupData: { name: string; description: string }) => {
    const response = await api.post('/groups', { group: groupData });
    return response.data;
  },

  // Mettre à jour un groupe
  updateGroup: async (id: string, groupData: { name?: string; description?: string }) => {
    const response = await api.put(`/groups/${id}`, { group: groupData });
    return response.data;
  },

  // Supprimer un groupe
  deleteGroup: async (id: string) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },

  // Quitter un groupe
  leaveGroup: async (id: string) => {
    const response = await api.delete(`/groups/${id}/leave`);
    return response.data;
  },
};

// Service pour les idées de cadeaux
export const giftIdeaService = {
  // Récupérer toutes les idées de cadeaux
  getGiftIdeas: async () => {
    const response = await api.get('/gift_ideas');
    return response.data;
  },

  // Récupérer spécifiquement les idées de cadeaux en cours d'achat par l'utilisateur actuel
  getBuyingGiftIdeas: async () => {
    try {
      const response = await api.get('/gift_ideas', {
        params: { status: 'buying' }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching buying gifts:', error);
      throw error;
    }
  },

  // Récupérer les idées de cadeaux pour un groupe spécifique
  getGiftIdeasByGroup: async (groupId: string, statuses?: string[], excludeOwnWishlist: boolean = false) => {
    try {
      const params: { group_id: string; status?: string[]; exclude_own_wishlist?: string } = {
        group_id: groupId,
        exclude_own_wishlist: excludeOwnWishlist ? 'true' : undefined
      };

      // Ajouter les statuts à filtrer s'ils sont spécifiés
      if (statuses && statuses.length > 0) {
        params.status = statuses;
      }

      const response = await api.get('/gift_ideas', { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching gift ideas for group ${groupId}:`, error);
      throw error;
    }
  },

  // Récupérer les idées de cadeaux pour un acheteur spécifique
  getGiftIdeasByBuyer: async (buyerId: string, groupId?: string, statuses?: string[]) => {
    try {
      const params: { buyer_id: string; group_id?: string; status?: string[] } = { buyer_id: buyerId };

      // Ajouter le groupe si spécifié
      if (groupId) {
        params.group_id = groupId;
      }

      // Ajouter les statuts à filtrer s'ils sont spécifiés
      if (statuses && statuses.length > 0) {
        params.status = statuses;
      }

      const response = await api.get('/gift_ideas', { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching gift ideas for buyer ${buyerId}:`, error);
      throw error;
    }
  },

  // Récupérer les idées de cadeaux créées par un utilisateur spécifique
  getGiftIdeasByCreator: async (creatorId: string, statuses?: string[]) => {
    try {
      const params: { created_by_id: string; status?: string[] } = { created_by_id: creatorId };

      // Ajouter les statuts à filtrer s'ils sont spécifiés
      if (statuses && statuses.length > 0) {
        params.status = statuses;
      }

      const response = await api.get('/gift_ideas', { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching gift ideas created by user ${creatorId}:`, error);
      throw error;
    }
  },

  // Récupérer une idée de cadeau spécifique
  getGiftIdea: async (id: string) => {
    const response = await api.get(`/gift_ideas/${id}`);
    return response.data;
  },

  // Créer une nouvelle idée de cadeau
  createGiftIdea: async (giftData: {
    title: string;
    description: string;
    price: number;
    link?: string;
    image_url?:string;
    recipient_ids: string[];
  }) => {
    const response = await api.post('/gift_ideas', { gift_idea: giftData });
    return response.data;
  },

  // Mettre à jour une idée de cadeau
  updateGiftIdea: async (id: string, giftData: {
    title?: string;
    description?: string;
    price?: number;
    link?: string;
    recipient_ids?: string[];
  }) => {
    const response = await api.put(`/gift_ideas/${id}`, { gift_idea: giftData });
    return response.data;
  },

  // Supprimer une idée de cadeau
  deleteGiftIdea: async (id: string) => {
    const response = await api.delete(`/gift_ideas/${id}`);
    return response.data;
  },

  // Marquer comme "en cours d'achat"
  markAsBuying: async (id: string) => {
    const response = await api.put(`/gift_ideas/${id}/mark_as_buying`);
    return response.data;
  },

  // Marquer comme acheté
  markAsBought: async (id: string) => {
    const response = await api.put(`/gift_ideas/${id}/mark_as_bought`);
    return response.data;
  },
};

// Service pour les invitations
export const invitationService = {
  // Récupérer toutes les invitations d'un groupe
  getGroupInvitations: async (groupId: string) => {
    const response = await api.get(`/groups/${groupId}/invitations`);

    // Retourner les invitations depuis le nouveau format de réponse
    return response.data.invitations || [];
  },

  // Créer une nouvelle invitation
  createInvitation: async (groupId: string, invitationData: { email: string; message?: string }) => {
    // Envoyer email et message comme paramètres directs au lieu de les encapsuler dans un objet invitation
    const response = await api.post(`/groups/${groupId}/invitations`, {
      email: invitationData.email,
      message: invitationData.message || '',
      invitation: { role: 'member' } // Garder l'objet invitation pour le paramètre role
    });
    return response.data;
  },

  // Récupérer une invitation spécifique par token
  getInvitation: async (token: string) => {
    const response = await api.get(`/invitations/${token}`);
    return response.data;
  },

  // Accepter une invitation
  acceptInvitation: async (token: string) => {
    const response = await api.post('/invitations/accept', { token });
    return response.data;
  },

  // Supprimer une invitation
  deleteInvitation: async (token: string) => {
    const response = await api.delete(`/invitations/${token}`);
    return response.data;
  },
};

// Service pour les memberships
export const membershipService = {
  // Récupérer tous les membres d'un groupe
  getGroupMembers: async (groupId: string) => {
    try {
      const response = await api.get(`/groups/${groupId}/memberships`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for group ${groupId}:`, error);
      throw error;
    }
  },

  // Récupérer un membership spécifique
  getMembership: async (groupId: string, membershipId: string) => {
    try {
      const response = await api.get(`/groups/${groupId}/memberships/${membershipId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching membership ${membershipId}:`, error);
      throw error;
    }
  },

  // Ajouter un membre au groupe (admin uniquement)
  addMember: async (groupId: string, userId: string, role: 'member' | 'admin' = 'member') => {
    try {
      const response = await api.post(`/groups/${groupId}/memberships`, {
        membership: { user_id: userId, role }
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding member to group ${groupId}:`, error);
      throw error;
    }
  },

  // Mettre à jour le rôle d'un membre
  updateMemberRole: async (groupId: string, membershipId: string, role: 'member' | 'admin') => {
    try {
      const response = await api.put(`/groups/${groupId}/memberships/${membershipId}`, {
        membership: { role }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating membership ${membershipId}:`, error);
      throw error;
    }
  },

  // Supprimer un membre du groupe
  removeMember: async (groupId: string, membershipId: string) => {
    try {
      const response = await api.delete(`/groups/${groupId}/memberships/${membershipId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing membership ${membershipId}:`, error);
      throw error;
    }
  },
};

/**
 * Service pour l'extraction de métadonnées à partir d'URL
 *
 * TODO: SCRAPING_FEATURE - Ce service est temporairement désactivé dans l'interface
 * mais le code est conservé pour une utilisation future lorsque les problèmes
 * de scraping seront résolus.
 */
export const metadataService = {
  // Récupère les métadonnées d'une URL
  fetchMetadata: async (url: string) => {
    const response = await api.post('/metadata/fetch', { url });
    return response.data;
  },
};

// Service pour les utilisateurs
export const userService = {
  // Récupérer les informations complètes du profil de l'utilisateur courant
  getCurrentUserProfile: async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('Current user not found');
      }
      const response = await api.get(`/users/${currentUser.id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  },

  // Mettre à jour le profil de l'utilisateur courant
  updateProfile: async (profileData: {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    current_password?: string;
    birthday?: string;
    phone_number?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    newsletter_subscription?: boolean;
  }) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('Current user not found');
      }

      const response = await api.put(`/users/${currentUser.id}`, { user: profileData });

      // Mettre à jour les informations utilisateur dans le localStorage si nécessaire
      if (response.data && response.data.user) {
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Récupérer les informations d'un autre utilisateur
  getUserById: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  // Récupérer la liste des IDs des utilisateurs qui partagent au moins un groupe avec l'utilisateur courant
  getSharedUsers: async () => {
    try {
      const response = await api.get('/users/shared_users');
      return response.data;
    } catch (error) {
      console.error('Error fetching shared users:', error);
      throw error;
    }
  },

  // Récupérer les groupes partagés entre l'utilisateur courant et un autre utilisateur
  getSharedGroups: async (userId: string) => {
    try {
      // Nous devons utiliser une approche différente car l'endpoint /users/shared-groups/:id n'existe pas
      // On va d'abord récupérer les groupes de l'utilisateur courant
      const myGroupsResponse = await api.get('/groups');
      const myGroups = myGroupsResponse.data || [];

      // Ensuite, nous filtrons les groupes pour trouver ceux qui ont l'utilisateur spécifié comme membre
      const sharedGroups = [];

      for (const group of myGroups) {
        try {
          // Récupérer les détails de chaque groupe, y compris les membres
          const groupDetailsResponse = await api.get(`/groups/${group.id}`);
          const groupDetails = groupDetailsResponse.data;

          // Vérifier si l'utilisateur est membre de ce groupe
          if (groupDetails.members && groupDetails.members.some((member: { id: string }) => member.id === userId)) {
            sharedGroups.push(group);
          }
        } catch (e) {
          console.error(`Error checking if user ${userId} is in group ${group.id}:`, e);
        }
      }

      return { groups: sharedGroups };
    } catch (error) {
      console.error(`Error fetching shared groups with user ${userId}:`, error);
      throw error;
    }
  },

  // Récupérer les idées cadeaux pour un utilisateur spécifique (filtrées par statut)
  getUserGiftIdeas: async (userId: string, statuses?: string[]) => {
    try {
      const params: { recipient_id: string; status?: string[] } = {
        recipient_id: userId
      };

      // Ajouter les statuts à filtrer s'ils sont spécifiés
      if (statuses && statuses.length > 0) {
        params.status = statuses;
      }

      const response = await api.get('/gift_ideas', { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching gift ideas for user ${userId}:`, error);
      throw error;
    }
  },

  // Mettre à jour la préférence de langue de l'utilisateur
  updateLocale: async (locale: string) => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('Current user not found');
      }

      const response = await api.patch(`/users/${currentUser.id}/update_locale`, { user: { locale } });

      // Mettre à jour l'information dans le localStorage
      if (response.data && response.data.data) {
        const updatedUser = { ...currentUser, locale: response.data.data.locale };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      console.error('Error updating user locale:', error);
      throw error;
    }
  },
};

// Service de contact
export const contactService = {
  // Envoyer un message de contact
  sendContactMessage: async (contactData: { name: string; email: string; subject: string; message: string }) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  },
};

// Service de newsletter
export const newsletterService = {
  // S'abonner à la newsletter
  subscribe: async (newsletterData: { email: string; list_id?: string; redirect_url?: string }) => {
    try {
      const response = await api.post('/newsletter/subscribe', { newsletter: newsletterData });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  },

  // Se désabonner de la newsletter
  unsubscribe: async (email: string, list_id?: string) => {
    try {
      const params: { email: string; list_id?: string } = { email };

      if (list_id) {
        params.list_id = list_id;
      }

      const response = await api.delete('/newsletter/unsubscribe', { params });
      return response.data;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      throw error;
    }
  }
};

export default api;
