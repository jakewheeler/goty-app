import React, { useState, useContext } from 'react';

const GameListContext = React.createContext();

const GameListProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString()
  );

  const [gamesList, setGamesList] = useState([]);

  const gameStore = {
    gameListState: [gamesList, setGamesList],
    yearState: [currentYear, setCurrentYear]
  };

  return (
    <GameListContext.Provider value={gameStore}>
      {children}
    </GameListContext.Provider>
  );
};

const useGameListState = () => {
  const context = useContext(GameListContext);
  if (context === undefined) {
    throw new Error('useGameListState must be used within GamesListProvider');
  }
  return context;
};

export { GameListProvider, useGameListState };
