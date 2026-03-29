import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import ScrollToTop from './components/common/navigation/ScrollToTop';
import RouteRenderer from './routes/RouteRenderer';
import routes from './routes/routeConfig';

/**
 * Composant principal de l'application
 * Utilise une approche moderne et DRY pour la définition des routes
 */
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <ScrollToTop />
          <RouteRenderer routes={routes} />
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
