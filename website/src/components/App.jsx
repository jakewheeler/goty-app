import React from 'react';
import DraggableArea from './GamesList';
import Header from './Header';
import HomePage from './HomePage';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { GameListProvider } from '../contexts/GamesListContext';

// styling
import '../styles/main.scss';

const App = () => {
  return (
    <div className='App'>
      <GameListProvider>
        <Header />
        <UserContent />
      </GameListProvider>
    </div>
  );
};

const UserContent = () => {
  return (
    <FirebaseAuthConsumer>
      {({ isSignedIn }) => {
        if (isSignedIn === true) {
          return <DraggableArea />;
        } else {
          return <HomePage />;
        }
      }}
    </FirebaseAuthConsumer>
  );
};
export default App;
