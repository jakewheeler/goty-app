export const getRequestConfig = token => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
