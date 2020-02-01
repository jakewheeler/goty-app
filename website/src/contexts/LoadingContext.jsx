import React from 'react';
import { useState, useContext } from 'react';

const LoadingContext = React.createContext(null);

const LoadingContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

const useLoadingState = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error(
      'useLoadingState must be used within LoadingContextProvider'
    );
  }
  return context;
};

export { LoadingContextProvider, useLoadingState };
