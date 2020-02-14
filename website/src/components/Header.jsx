import React from 'react';
import SearchBar from './SearchBar';
import YearPicker from './YearPicker';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import Login from './Login';
import Logout from './Logout';
import { Link } from 'react-router-dom';
import GitHubLogo from './GitHubLogo';

const Header = () => {
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user }) => (
        <PlainHeader>
          {isSignedIn ? (
            <AuthHeaderContent user={user} />
          ) : (
            <UnauthHeaderContent />
          )}
        </PlainHeader>
      )}
    </FirebaseAuthConsumer>
  );
};

const AuthHeaderContent = ({ user }) => {
  return (
    <>
      <SearchBar />
      <div className='user-data-container'>
        <div className='left-side'>
          <YearPicker />
        </div>
        <div className='right-side'>
          <div className='user-data-items'>
            <div>Hello, {user.displayName}</div>
            <Logout />
          </div>
        </div>
      </div>
    </>
  );
};

const UnauthHeaderContent = () => {
  return (
    <div className='user-data-container'>
      <div className='right-side'>
        <div className='user-data-items'>
          <Login />
        </div>
      </div>
    </div>
  );
};

export const PlainHeader = ({ children }) => {
  return (
    <header>
      <div className='site-info'>
        <div className='plain-header-left'>
          <Link to='/'>
            <h1>My_GOTY</h1>
          </Link>
        </div>
        <div className='plain-header-right'>
          <GitHubLogo height='4rem' width='4rem' />
        </div>
      </div>
      {children}
    </header>
  );
};

export default Header;
