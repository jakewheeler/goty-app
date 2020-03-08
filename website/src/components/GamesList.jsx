import React from 'react';
import { useGameListState, getYearData } from '../contexts/GamesListContext';
import { Button, Spin } from 'antd';
import { Card } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { getRequestConfig } from '../helpers/getRequestJwt';
import { useFetchToken } from '../hooks/customHooks';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ShareButton from './ShareButton';

const GRID = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,

  background: isDragging ? '#646675' : '#3E4053',

  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: '#14151E',
  padding: GRID
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const renderGame = (game, index, readOnly) => {
  return (
    <DraggableGame
      key={game.id}
      index={index}
      id={game.id}
      gameObj={game}
      readOnly={readOnly}
    />
  );
};

const GameListEditor = ({ user }) => {
  const [disableBtn, setDisableBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { uid } = user;
  const {
    gameListState: [games, setGames],
    yearState: [currentYear],
    yearListState: [, setYears]
  } = useGameListState();

  const saveKey = `${uid}_${currentYear}`;
  const token = useFetchToken();

  async function saveListHandler() {
    setDisableBtn(true); // disable button

    await axios.put(
      `/user/list/${saveKey}`,
      {
        gamelist: { games }
      },
      getRequestConfig(token)
    );

    const yearData = await getYearData(token, uid);
    setYears([...yearData]);
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
        setDisableBtn(true);
      } catch (err) {
        console.error(err);
      }
    }
    if (token) {
      getGames();
    }
  }, [saveKey, setGames, setIsLoading, setDisableBtn, token]);

  useEffect(() => {
    setDisableBtn(false); // enable on change
  }, [games]);

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const items = reorder(games, result.source.index, result.destination.index);

    setGames(items);
  };

  const disabled = games.length <= 0 && disableBtn;

  if (disabled) {
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
          <ShareButton />
          <DragDropContext onDragEnd={onDragEnd}>
            <GamesList
              games={games}
              readOnly={false}
              disableList={disableBtn}
            />
          </DragDropContext>
        </div>
      )}
    </>
  );
};

export const GamesList = ({ games, readOnly = true }) => {
  return (
    <>
      <div>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {games.map((item, index) => renderGame(item, index, readOnly))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
};

const DraggableGame = ({ id, gameObj, index, readOnly }) => {
  return (
    <Draggable
      key={id}
      draggableId={id.toString()}
      index={index}
      isDragDisabled={readOnly}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <div className='game'>
            <div className='game-container'>
              <div className='game-info'>
                <Link to={`/game/${gameObj.id}`}>{gameObj.name}</Link>
              </div>
              {!readOnly && (
                <div className='remove-btn'>
                  <GameCardButton game={gameObj} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export const GameCard = ({ game }) => {
  return (
    <>
      <Card title={game.name} style={{ width: '100%', height: 250 }}>
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

export default GameListEditor;
