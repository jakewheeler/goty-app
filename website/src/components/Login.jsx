import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Button } from 'antd';

const Login = () => {
  async function login() {
    await firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider());
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
