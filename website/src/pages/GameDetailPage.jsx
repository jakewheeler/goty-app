import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import axios from 'axios';
import { getRequestConfig } from '../helpers/getRequestJwt';
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { PlainHeader } from '../components/Header';
import { useFetchToken } from '../hooks/customHooks';

export const GameDetailPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let token = useFetchToken();

  useEffect(() => {
    async function getGame() {
      try {
        if (token) {
          setIsLoading(true);
          let gameData = await fetchGameInfo(gameId, token);
          setGame(gameData);
        }
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

  function goBack() {
    history.goBack();
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
        <div className='game-detail-loading'>
          <Spin size='large' />
        </div>
      ) : (
        <div className='game-detail'>
          <img
            src={data?.image?.original_url}
            width='300px'
            height='400px'
            alt={`${game?.name} art`}
          />
          <p style={{ paddingTop: '1rem', maxWidth: '500px' }}>{data?.deck}</p>
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
