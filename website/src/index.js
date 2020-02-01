import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import firebase from 'firebase/app';
import 'firebase/auth';
import config from './firebase/config';
import { FirebaseAuthProvider } from '@react-firebase/auth';
import { LoadingContextProvider } from './contexts/LoadingContext';

ReactDOM.render(
  <FirebaseAuthProvider firebase={firebase} {...config}>
    <LoadingContextProvider>
      <App />
    </LoadingContextProvider>
  </FirebaseAuthProvider>,
  document.getElementById('root')
);
