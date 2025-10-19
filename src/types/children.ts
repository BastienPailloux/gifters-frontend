/**
 * Types pour la gestion des comptes managés (children)
 */

/**
 * Interface représentant un compte child/managé
 */
export interface Child {
  id: string | number;
  name: string;
  birthday?: string;
  gender?: string;
  account_type: 'managed';
  parent_id: string | number;
  created_at: string;
  updated_at: string;
}

/**
 * Interface pour la création d'un compte child
 */
export interface CreateChildData {
  name: string;
  birthday?: string;
  gender?: string;
}

/**
 * Interface pour la mise à jour d'un compte child
 */
export interface UpdateChildData {
  name?: string;
  birthday?: string;
  gender?: string;
}

/**
 * Interface pour la réponse API lors de la récupération des children
 */
export interface ChildrenResponse {
  children: Child[];
}

/**
 * Interface pour la réponse API d'un child individuel
 */
export interface ChildResponse {
  child: Child;
}

/**
 * État de la page ChildrenList
 */
export interface ChildrenListState {
  children: Child[];
  loading: boolean;
  error: string | null;
}

/**
 * Interface pour les props du composant ChildFormModal
 */
export interface ChildFormModalProps extends CreateChildData {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  child?: Child;
}
