import React from 'react';

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <div
      className="flex-grow overflow-y-auto w-full transition-all duration-300 ease-in-out bg-gray-100"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {children}
    </div>
  );
};

export default MainContainer;
