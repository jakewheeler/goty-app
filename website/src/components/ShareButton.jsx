import React from 'react';
import { Button } from 'antd';
import { useGameListState } from '../contexts/GamesListContext';
import { useUserContext } from '../hooks/customHooks';
import { useState } from 'react';
import { useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareButton = () => {
  const {
    yearState: [year]
  } = useGameListState();
  const [shareUrl, setShareUrl] = useState('');

  const user = useUserContext();

  useEffect(() => {
    let subscribed = true;
    if (subscribed && user) {
      const baseURL = window.location;
      const shareURL = 'share';
      setShareUrl(`${baseURL}${shareURL}/${user.uid}/${year}`);
    }

    return () => (subscribed = false);
  }, [setShareUrl, user, year]);

  return (
    <>
      <CopyToClipboard text={shareUrl}>
        <Button type='primary'>Share</Button>
      </CopyToClipboard>
    </>
  );
};

export default ShareButton;
