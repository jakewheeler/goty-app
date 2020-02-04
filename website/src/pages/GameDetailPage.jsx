import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import axios from 'axios';
import { getRequestConfig } from '../helpers/getRequestJwt';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { PlainHeader } from '../components/Header';

export const GameDetailPage = user => {
  const { gameId } = useParams();
  const [token, setToken] = useState(null);
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setToken(user);
  }, [user]);

  useEffect(() => {
    async function getGame() {
      if (!token?.user?.ma) return;
      setIsLoading(true);
      try {
        let gameData = await fetchGameInfo(gameId, token.user.ma);
        setGame(gameData);
      } catch (err) {
        console.error('no token');
      } finally {
        setIsLoading(false);
      }
    }
    getGame();
  }, [gameId, setGame, token]);

  return (
    <div id='game-page'>
      <PlainHeader />
      {isLoading ? (
        <Spin size='large' />
      ) : (
        <>
          <Header gameTitle={game?.name} />
          <div>game id = {gameId}</div>
        </>
      )}
    </div>
  );
};

const Header = ({ gameTitle }) => {
  const history = useHistory();

  function goBack() {
    history.push('/');
  }
  return (
    <PageHeader
      style={{
        border: '1px solid rgb(235, 237, 240)'
      }}
      onBack={goBack}
      title={gameTitle}
    />
  );
};

const fetchGameInfo = async (id, token) => {
  const url = `/api/game/${id}`;
  const game = await axios.get(url, getRequestConfig(token));
  return game.data.results[0];
};

const GameInformation = gameId => {};
