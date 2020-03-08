import { useEffect, useState } from 'react';
import axios from 'axios';
import firebase from 'firebase/app';

export const useFetch = url => {
  const [{ data, isLoading }, setData] = useState({
    data: null,
    isLoading: false
  });

  useEffect(() => {
    async function fetch() {
      setData({ data: null, isLoading: true });
      const data = await axios.get(url);
      setData({ data: data.data(), isLoading: false });
    }
    fetch();
  }, [data, setData, isLoading, url]);

  return [data, isLoading];
};

export const useFetchToken = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const fbUser = firebase.auth().currentUser;
      console.log(fbUser);
      setUser(fbUser);
    }
    fetchUser();
  }, [setUser]);

  useEffect(() => {
    async function getToken() {
      try {
        if (!user) return;
        let userToken = await user.getIdToken(true);
        setToken(userToken);
      } catch (err) {
        console.error(err);
      }
    }
    getToken();
  }, [setToken, user]);

  return token;
};
