import React, { useState, useContext } from 'react';
import axios from 'axios';
import { getRequestConfig } from '../helpers/getRequestJwt';

const GameListContext = React.createContext();

const GameListProvider = ({ children }) => {
  // current year selected by user
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString()
  );

  // year list
  const [years, setYears] = useState([]);

  // current game list selected by user
  const [gamesList, setGamesList] = useState([]);

  // store available to app
  const gameStore = {
    gameListState: [gamesList, setGamesList],
    yearState: [currentYear, setCurrentYear],
    yearListState: [years, setYears]
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

const getYearData = async (token, uid) => {
  if (!token) return;
  try {
    const years = await axios.get(`user/years/${uid}`, getRequestConfig(token));
    return years.data;
  } catch (error) {
    return [];
  }
};

export { GameListProvider, useGameListState, getYearData };
