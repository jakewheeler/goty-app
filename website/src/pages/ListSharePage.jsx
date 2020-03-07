import React from 'react';
import { PlainHeader } from '../components/Header';
import { useParams, useHistory } from 'react-router-dom';
import { PageHeader } from 'antd';
import { useGameListState } from '../contexts/GamesListContext';
import DraggableArea from '../components/GamesList';

const ListSharePage = user => {
  return (
    <div>
      <PlainHeader />
      <HomeHeader />
      {/* {JSON.stringify(user, null, 2)} */}
      <DraggableArea isEditable={false} />
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
