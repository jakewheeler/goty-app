import { Link } from 'react-router-dom';
import React from 'react';

export const NoMatch = () => {
  return (
    <div className='noMatch'>
      <h1>404 😔</h1>
      <Link to='/'>Go home</Link>
    </div>
  );
};
