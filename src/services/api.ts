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
    const response = await api.get('/groups');
    return response.data;
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

  // Rejoindre un groupe
  joinGroup: async (id: string) => {
    const response = await api.post(`/groups/${id}/join`);
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
    for_user_id: string;
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
    const response = await api.post(`/groups/${groupId}/invitations`, { invitation: invitationData });
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

export default api;
