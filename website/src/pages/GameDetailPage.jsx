import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import axios from 'axios';
import { getRequestConfig } from '../helpers/getRequestJwt';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { PlainHeader } from '../components/Header';
import { useGameListState } from '../contexts/GamesListContext';

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
          <GameInformation game={game} />
        </>
      )}
    </div>
  );
};

const Header = ({ gameTitle }) => {
  const history = useHistory();
  const {
    yearState: [, setCurrentYear]
  } = useGameListState();

  function goBack() {
    history.push('/');
    setCurrentYear(new Date().getFullYear().toString());
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

const GameInformation = ({ game }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setData(game);
    setIsLoading(false);
  }, [game, setIsLoading]);

  return (
    <div className='game-content'>
      {isLoading ? (
        <Spin size='large' />
      ) : (
        <div className='game-detail'>
          <img
            src={data?.image?.original_url}
            width='200px'
            height='200px'
            alt={`${game?.name} art`}
          />
          <p>{data?.deck}</p>
          <div>
            Platforms:
            <ul>
              {data?.platforms?.map(platform => (
                <li key={platform?.name}>{platform?.name}</li>
              ))}
            </ul>
          </div>
          <a href={data?.site_detail_url}>More info at giantbomb.com</a>
        </div>
      )}
    </div>
  );
};
