import { Link } from 'react-router-dom';
import React from 'react';
import { PlainHeader } from '../components/Header';

const NoMatch = () => {
  return (
    <div className='404'>
      <PlainHeader />
      <div className='no-match'>
        <div className='no-match-contents'>
          <h1>
            Page Not Found{' '}
            <span role='img' aria-label='sad emoji'>
              😔
            </span>
          </h1>
          <Link to='/'>Go home</Link>
        </div>
      </div>
    </div>
  );
};

export default NoMatch;
