import React from 'react';
import DraggableArea from './GamesList';
import Header from './Header';
import HomePage from './HomePage';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { GameListProvider } from '../contexts/GamesListContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { NoMatch } from '../pages/NoMatchPage';
import ListSharePage from '../pages/ListSharePage';

// styling
import '../styles/main.scss';
import { GameDetailPage } from '../pages/GameDetailPage';

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
            <Route path='/game/:gameId'>
              <FirebaseAuthConsumer>
                {({ user }) => <GameDetailPage user={user} />}
              </FirebaseAuthConsumer>
            </Route>
            <Route path='/share/:key/:year'>
              <FirebaseAuthConsumer>
                {({ user }) => <ListSharePage user={user} />}
              </FirebaseAuthConsumer>
            </Route>
            <Route>
              <NoMatch />
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
