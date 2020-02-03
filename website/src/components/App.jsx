import React from 'react';
import DraggableArea from './GamesList';
import Header from './Header';
import HomePage from './HomePage';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { GameListProvider } from '../contexts/GamesListContext';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// styling
import '../styles/main.scss';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <GameListProvider>
          <Switch>
            <Route exact path='/'>
              <Header />
              <UserContent />
            </Route>
            <Route path='/game/:id'>
              <div>nice game here</div>
            </Route>
          </Switch>
        </GameListProvider>
      </Router>
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
