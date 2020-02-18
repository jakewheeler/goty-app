import React, { useState } from 'react';
import { GameCard } from './GamesList';
import { Input } from 'antd';
import { Spin } from 'antd';
import { List } from 'antd';
import axios from 'axios';
import { getRequestConfig } from '../helpers/getRequestJwt';
import { useFetchToken } from '../hooks/customHooks';
import { useGameListState } from '../contexts/GamesListContext';

const SearchBar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const {
    yearState: [currentYear]
  } = useGameListState();
  const token = useFetchToken();

  async function onEnterKeyPress(e) {
    const text = e.target.value;
    setIsLoading(false);
    setIsSearching(false);
    if (e.key === 'Enter' && text) {
      setIsLoading(true);
      const searchedGames = await axios.get(
        `/api/gamelist/${text}/${currentYear}`,
        getRequestConfig(token)
      );
      setSearchResults(searchedGames.data.results);
      setIsLoading(false);
      setIsSearching(true);
    }
  }

  return (
    <div className='search-container'>
      <Input
        placeholder='Find a game..'
        onKeyDown={async e => onEnterKeyPress(e)}
      />
      {isLoading ? (
        <Spin size='large' style={{ marginTop: '.5rem' }} />
      ) : (
        <SearchResults
          isSearching={isSearching}
          searchResults={searchResults}
        />
      )}
    </div>
  );
};

const SearchResults = ({ isSearching, searchResults }) => {
  if (isSearching && searchResults.length <= 0) {
    return (
      <div>
        No results{' '}
        <span role='img' aria-label='sad emoji'>
          😔
        </span>
      </div>
    );
  }

  if (!searchResults?.length || !isSearching) return <div></div>;

  return (
    <List
      className='search-results'
      itemLayout='horizontal'
      dataSource={searchResults}
      renderItem={game => (
        <List.Item key={game.id} className='search-item'>
          <GameCard game={game} />
        </List.Item>
      )}
    />
  );
};

export default SearchBar;
