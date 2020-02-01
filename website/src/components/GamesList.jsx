import React, { useRef, useCallback } from 'react';
import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import { useGameListState } from '../contexts/GamesListContext';
import { Button, Spin } from 'antd';
import { Card } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { useState } from 'react';
import { getRequestConfig } from '../helpers/getRequestJwt';
import { useFetchToken } from '../hooks/customHooks';

const typeMap = {
  GAME: 'game'
};

const DraggableArea = () => {
  return (
    <>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <FirebaseAuthConsumer>
          {({ user }) => <GamesList user={user} />}
        </FirebaseAuthConsumer>
      </DndProvider>
    </>
  );
};

const GamesList = ({ user }) => {
  const [disableBtn, setDisableBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { uid } = user;
  const {
    gameListState: [games, setGames],
    yearState: [currentYear]
  } = useGameListState();
  const saveKey = `${uid}_${currentYear}`;
  const token = useFetchToken();

  async function saveListHandler() {
    setDisableBtn(true); // disable button

    if (getTableExists(`/user/list/${saveKey}/exists`)) {
      await axios.put(
        `/user/list/${saveKey}`,
        {
          gamelist: { games }
        },
        getRequestConfig(token)
      );
    }
  }

  async function getTableExists(url) {
    let response = await axios.get(url, getRequestConfig(token));
    return response.data;
  }

  useEffect(() => {
    async function getGames() {
      try {
        setIsLoading(true);
        let resp = await axios.get(
          `/user/list/${saveKey}`,
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
  }, [saveKey, setGames, setIsLoading, token]);

  useEffect(() => {
    setDisableBtn(false); // enable on change
  }, [games]);

  const moveGame = useCallback(
    (dragIndex, hoverIndex) => {
      const dragGame = games[dragIndex];
      setGames(
        update(games, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragGame]
          ]
        })
      );
    },
    [games, setGames]
  );

  const renderGame = (game, index) => {
    return (
      <Game
        key={game.id}
        index={index}
        id={game.id}
        gameObj={game}
        moveGame={moveGame}
      />
    );
  };
  if (games.length <= 0) {
    return (
      <div className='empty-list'>
        <h2>
          No games yet{' '}
          <span role='img' aria-label='sad emoji'>
            😢
          </span>
        </h2>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className='game-list-loading'>
          <Spin size='large' />
        </div>
      ) : (
        <div className='games-list'>
          <Button
            className='save-btn'
            type='primary'
            onClick={saveListHandler}
            disabled={disableBtn}
          >
            Save list
          </Button>
          {games.map((game, i) => renderGame(game, i))}
        </div>
      )}
    </>
  );
};

const Game = ({ id, gameObj, index, moveGame }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: typeMap.GAME,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveGame(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: typeMap.GAME, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      className='game'
      ref={ref}
      style={{
        opacity,
        borderStyle: 'solid',
        padding: '20px'
      }}
    >
      <div className='game-container'>
        <div className='game-info'>{gameObj.name}</div>
        <div className='remove-btn'>
          <GameCardButton game={gameObj} />
        </div>
      </div>
    </div>
  );
};

export const GameCard = ({ game }) => {
  return (
    <>
      <Card title={game.name} style={{ width: 600, height: 250 }}>
        <figure className='image is-64x64'>
          <img src={game.image.icon_url} alt={game.name} />
        </figure>
        <GameCardButton game={game} />
      </Card>
    </>
  );
};

const GameCardButton = ({ game }) => {
  const {
    gameListState: [gameList, setGames]
  } = useGameListState();

  let gameExists = isGameInList(game.id);
  function manageList() {
    if (gameExists) {
      // remove
      removeFromListById(game.id);
    } else {
      // add
      addToList(game);
    }
  }

  function addToList(game) {
    if (gameList.length >= 10) return;
    let games = [...gameList];
    games.push({
      id: game.id,
      name: game.name,
      year: game.year
    });
    setGames(games);
  }

  function removeFromListById(gameId) {
    if (gameList.length <= 0) return;
    let games = [...gameList];
    let newList = games.filter(game => game.id !== gameId);
    setGames(newList);
  }

  function isGameInList(gameId) {
    return gameList.filter(game => game.id === gameId).length;
  }

  return (
    <>
      {isGameInList(game.id) ? (
        <Button type='danger' onClick={manageList}>
          Remove
        </Button>
      ) : (
        <Button type='primary' onClick={manageList}>
          Add
        </Button>
      )}
    </>
  );
};

export default DraggableArea;
