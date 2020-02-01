import React, { useState } from 'react';
import { GameCard } from './GamesList';
import { Input } from 'antd';
import { Spin } from 'antd';
import axios from 'axios';
import { getRequestConfig } from '../helpers/getRequestJwt';
import { useFetchToken } from '../hooks/customHooks';

const SearchBar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const token = useFetchToken();

  async function onEnterKeyPress(e) {
    const text = e.target.value;
    setIsLoading(false);
    setIsSearching(false);
    if (e.key === 'Enter') {
      setIsLoading(true);
      const searchedGames = await axios.get(
        `/api/gamelist/${text}`,
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
    <div className='search-results' id='searchResults'>
      <ul>
        {searchResults.map(result => (
          <li key={result.id}>
            <GameCard game={result} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
