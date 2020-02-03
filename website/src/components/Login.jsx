import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Button } from 'antd';
import { useGameListState } from '../contexts/GamesListContext';

const Login = () => {
  const {
    yearState: [, setCurrentYear]
  } = useGameListState();

  async function login() {
    await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
    setCurrentYear(new Date().getFullYear().toString());
  }

  return (
    <>
      <Button type='primary' onClick={login}>
        Login
      </Button>
    </>
  );
};

export default Login;
