import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import MainContainer from './MainContainer';
import SideMenu from './SideMenu';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  // Prop optionnelle pour forcer l'affichage ou non du SideMenu
  forceSideMenu?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, forceSideMenu }) => {
  const { isAuthenticated } = useAuth();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(true);
  const { t } = useTranslation();
  const location = useLocation();

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // Vérifier si nous sommes sur la page d'accueil
  const isHomePage = location.pathname === '/';

  // Déterminer si le SideMenu doit être affiché
  // Si forceSideMenu est défini, utiliser cette valeur
  // Sinon, afficher le SideMenu uniquement si l'utilisateur est authentifié ET que nous ne sommes PAS sur la page d'accueil
  const shouldShowSideMenu = forceSideMenu !== undefined
    ? forceSideMenu
    : (isAuthenticated && !isHomePage);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        {shouldShowSideMenu && (
          <div className="flex">
            <div className={`transition-all duration-300 ease-in-out ${isSideMenuOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
              <SideMenu />
            </div>
            <div className="bg-gray-100 flex">
              <button
                onClick={toggleSideMenu}
                className="flex items-center justify-center h-10 w-6 bg-primary-500 text-white rounded-r-md focus:outline-none hover:bg-primary-600 transition-colors z-10 border-t border-r border-b border-primary-600"
                aria-label={isSideMenuOpen ? t('sidemenu.collapse') : t('sidemenu.expand')}
                title={isSideMenuOpen ? t('sidemenu.collapse') : t('sidemenu.expand')}
                style={{
                  marginLeft: '-1px',
                  boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
                }}
              >
                {isSideMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
        <MainContainer>
          {children}
        </MainContainer>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
