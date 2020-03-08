import React from 'react';
import { Button } from 'antd';
import { useGameListState } from '../contexts/GamesListContext';
import { useUserContext } from '../hooks/customHooks';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareButton = () => {
  const {
    yearState: [year]
  } = useGameListState();
  const [shareUrl, setShareUrl] = useState('');

  const user = useUserContext();

  useEffect(() => {
    const baseURL = window.location;
    const shareURL = 'share';
    if (!user) return;
    setShareUrl(`${baseURL}${shareURL}/${user.uid}/${year}`);
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
