import React, { useState, useEffect } from 'react';
import { GameCard } from './GamesList';
import { Input, Spin, List, Button } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
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

  async function searchForGame(e) {
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
        onKeyDown={async e => searchForGame(e)}
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

const GoToTop = ({ isVisible }) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      {isVisible && (
        <Button
          style={{ zIndex: 2, position: 'fixed', right: 20, bottom: 20 }}
          type='primary'
          shape='circle'
          size='large'
          onClick={scrollToTop}
        >
          <CaretUpOutlined />
        </Button>
      )}
    </>
  );
};

const SearchResults = ({ isSearching, searchResults }) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolling]);

  const handleScroll = () => {
    if (window.pageYOffset !== 0) {
      setIsScrolling(true);
    } else {
      setIsScrolling(false);
    }
  };

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
    <div className='list-container'>
      <div className='scroll-icon'>
        <GoToTop isVisible={isScrolling} />
      </div>
      <div className='list-parent'>
        <List
          className='search-results'
          itemLayout='horizontal'
          dataSource={searchResults}
          bordered={false}
          renderItem={game => (
            <List.Item key={game.id} style={{ borderBottom: 'none' }}>
              <GameCard game={game} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default SearchBar;
