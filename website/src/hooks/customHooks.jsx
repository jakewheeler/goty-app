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
  useEffect(() => {
    async function getToken() {
      setToken(await firebase.auth().currentUser.getIdToken(true));
    }
    getToken();
  }, [setToken]);

  return token;
};
