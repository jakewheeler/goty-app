import React from 'react';
import GameListEditor from './GamesList';
import Header from './Header';
import HomePage from './HomePage';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { GameListProvider } from '../contexts/GamesListContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NoMatch from '../pages/NoMatchPage';
import ListSharePage from '../pages/ListSharePage';

// styling
import '../styles/main.scss';
import { GameDetailPage } from '../pages/GameDetailPage';

const App = () => {
  return (
    <div className='App'>
      <FirebaseAuthConsumer>
        {({ isSignedIn, user }) => (
          <Router>
            <GameListProvider>
              <Switch>
                <Route exact path='/'>
                  <Header />
                  {isSignedIn ? <GameListEditor user={user} /> : <HomePage />}
                </Route>
                <Route path='/game/:gameId'>
                  {isSignedIn ? <GameDetailPage user={user} /> : <NoMatch />}
                </Route>
                <Route path='/share/:uid/:year'>
                  {isSignedIn ? <ListSharePage user={user} /> : <NoMatch />}
                </Route>
                <Route>
                  <NoMatch />
                </Route>
              </Switch>
            </GameListProvider>
          </Router>
        )}
      </FirebaseAuthConsumer>
    </div>
  );
};

export default App;
