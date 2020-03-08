import React from 'react';
import { PlainHeader } from '../components/Header';
import { useParams, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import { useGameListState } from '../contexts/GamesListContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { GamesList } from '../components/GamesList';
import { useFetchToken } from '../hooks/customHooks';
import axios from 'axios';
import { getRequestConfig } from '../helpers/getRequestJwt';

const ListSharePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);
  let { uid, year } = useParams();
  const userKey = `${uid}_${year}`;

  const token = useFetchToken();

  useEffect(() => {
    async function getGames() {
      try {
        setIsLoading(true);
        let resp = await axios.get(
          `/user/list/share/${userKey}`,
          getRequestConfig(token)
        );
        let { games } = resp.data;

        setGames([...games]);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    if (token) {
      getGames();
    }
  }, [userKey, setGames, setIsLoading, token]);

  console.log(token);

  return (
    <div>
      <PlainHeader />
      <HomeHeader />
      {!isLoading && <GamesList games={games} readOnly={true} />}
    </div>
  );
};

const HomeHeader = () => {
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
      title='Home'
    />
  );
};

export default ListSharePage;
