import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MainContainer from './MainContainer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <MainContainer>
        {children}
      </MainContainer>
      <Footer />
    </div>
  );
};

export default Layout;
