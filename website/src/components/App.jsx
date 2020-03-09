import React from 'react';
import GameListEditor from './GamesList';
import Header from './Header';
import HomePage from './HomePage';
import { IfFirebaseAuthed, IfFirebaseUnAuthed } from '@react-firebase/auth';
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
      <Router>
        <GameListProvider>
          <Switch>
            <Route exact path='/'>
              <HomeView />
            </Route>
            <Route path='/game/:gameId'>
              <GameView />
            </Route>
            <Route path='/share/:uid/:year'>
              <ShareView />
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

const HomeView = () => {
  return (
    <>
      <Header />
      <IfFirebaseAuthed>
        {({ user }) => <GameListEditor user={user} />}
      </IfFirebaseAuthed>
      <IfFirebaseUnAuthed>
        <HomePage />
      </IfFirebaseUnAuthed>
    </>
  );
};

const GameView = () => {
  return (
    <>
      <IfFirebaseAuthed>
        {({ user }) => <GameDetailPage user={user} />}
      </IfFirebaseAuthed>
      <IfFirebaseUnAuthed>
        <NoMatch />
      </IfFirebaseUnAuthed>
    </>
  );
};

const ShareView = () => {
  return (
    <>
      <IfFirebaseAuthed>
        {({ user }) => <ListSharePage user={user} />}
      </IfFirebaseAuthed>
      <IfFirebaseUnAuthed>
        <NoMatch />
      </IfFirebaseUnAuthed>
    </>
  );
};

export default App;
