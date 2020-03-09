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
    let subscribed = true;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user && subscribed) {
        setUser(user);
      } else if (subscribed) {
        setUser(null);
      }
    });

    return () => (subscribed = false);
  }, [setUser]);

  useEffect(() => {
    let subscribed = true;
    async function getToken() {
      try {
        if (!user) return;
        let userToken = await user.getIdToken(true);
        if (subscribed) {
          setToken(userToken);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getToken();

    return () => (subscribed = false);
  }, [setToken, user]);

  return token;
};

export const useUserContext = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let subscribed = true;
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) return;
      if (user && subscribed) {
        setUser(user);
      } else if (subscribed) {
        setUser(null);
      }
    });

    return () => (subscribed = false);
  }, [setUser]);

  return user;
};
