import { lazy } from 'react';
import { RouteConfig } from '../types/routes';

// Importations paresseuses pour améliorer les performances
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const GroupDetails = lazy(() => import('../pages/GroupDetails'));
const GiftIdeaDetails = lazy(() => import('../pages/GiftIdeaDetails'));
const InvitationJoin = lazy(() => import('../pages/invitation/InvitationJoin'));
const InvitationInput = lazy(() => import('../pages/invitation/InvitationInput'));
const MyGifts = lazy(() => import('../pages/MyGifts'));
const MyGroups = lazy(() => import('../pages/MyGroups'));
const Events = lazy(() => import('../pages/Events'));
const Profile = lazy(() => import('../pages/Profile'));
const Features = lazy(() => import('../pages/Features'));
const Contact = lazy(() => import('../pages/Contact'));
const Pricing = lazy(() => import('../pages/Pricing'));
const About = lazy(() => import('../pages/About'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));
const ChildrenList = lazy(() => import('../pages/children/ChildrenList'));

/**
 * Configuration des routes publiques sans layout
 */
export const publicRoutes: RouteConfig[] = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/invitation/join', component: InvitationJoin },
];

/**
 * Configuration des routes publiques avec layout
 */
export const publicLayoutRoutes: RouteConfig[] = [
  { path: '/features', component: Features, layout: true },
  { path: '/pricing', component: Pricing, layout: true },
  { path: '/contact', component: Contact, layout: true },
  { path: '/about', component: About, layout: true },
  { path: '/terms', component: TermsAndConditions, layout: true },
];

/**
 * Configuration des routes protégées avec layout
 */
export const protectedRoutes: RouteConfig[] = [
  { path: '/dashboard', component: Dashboard, protected: true, layout: true },
  { path: '/gifts', component: MyGifts, protected: true, layout: true },
  { path: '/groups', component: MyGroups, protected: true, layout: true },
  { path: '/groups/:id', component: GroupDetails, protected: true, layout: true },
  { path: '/gift-ideas/:id', component: GiftIdeaDetails, protected: true, layout: true },
  { path: '/events', component: Events, protected: true, layout: true },
  { path: '/profile', component: Profile, protected: true, layout: true },
  { path: '/profile/:id', component: Profile, protected: true, layout: true },
  { path: '/invitations', component: InvitationInput, protected: true, layout: true },
  { path: '/children', component: ChildrenList, protected: true, layout: true },
];

/**
 * Toutes les routes combinées
 */
export const routes: RouteConfig[] = [
  ...publicRoutes,
  ...publicLayoutRoutes,
  ...protectedRoutes,
];

export default routes;
