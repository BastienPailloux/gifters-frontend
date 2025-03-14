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
      config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Rediriger vers la page de connexion si nécessaire
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData: { name: string; email: string; password: string; password_confirmation: string }) => {
    // On envoie les données directement sans les imbriquer dans un objet 'user'
    const response = await api.post('/signup', { user: userData });

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
    // On envoie les données directement sans les imbriquer dans un objet 'user'
    const response = await api.post('/login', { user: credentials });

    console.log('Login response:', response.data);

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
  getGiftIdeasByGroup: async (groupId: string, statuses?: string[]) => {
    try {
      const params: { group_id: string; status?: string[] } = { group_id: groupId };

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
    url?: string;
    recipient_ids: string[];
    group_id: string;
  }) => {
    const response = await api.post('/gift_ideas', { gift_idea: giftData });
    return response.data;
  },

  // Mettre à jour une idée de cadeau
  updateGiftIdea: async (id: string, giftData: {
    title?: string;
    description?: string;
    price?: number;
    url?: string;
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
    return response.data;
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

export default api;
