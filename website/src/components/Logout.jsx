import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Button } from 'antd';

const Logout = () => {
  function logout() {
    firebase.auth().signOut();
  }
  return (
    <Button type='primary' onClick={logout}>
      Logout
    </Button>
  );
};

export default Logout;
