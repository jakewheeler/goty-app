import React from 'react';
import SearchBar from './SearchBar';
import YearPicker from './YearPicker';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import Login from './Login';
import Logout from './Logout';

const Header = () => {
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn, user }) => (
        <header>
          <div className='site-info'>
            <h1>My_GOTY</h1>
          </div>
          {isSignedIn ? (
            <AuthHeaderContent user={user} />
          ) : (
            <UnauthHeaderContent />
          )}
        </header>
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

export default Header;
